/**
 * Static consistency checker for the LegacyLedger Anchor program.
 *
 * This is NOT a compiler. It cannot type-check lifetimes, borrow order or
 * trait resolution. What it does check is the class of mistakes that a
 * refactor across many files silently introduces: renamed error variants,
 * mismatched event fields, program/handler signature drift, program-id
 * drift, and references to items that were deleted.
 *
 * Run: node scripts/check-program.js
 * Exits non-zero on any finding.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "..");
const SRC = path.join(ROOT, "programs", "legacy-ledger", "src");

const findings = [];
const notes = [];
const fail = (msg) => findings.push(msg);
const note = (msg) => notes.push(msg);

const read = (p) => fs.readFileSync(p, "utf8");

// ---------------------------------------------------------------- collect
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".rs")) out.push(full);
  }
  return out;
}

const rustFiles = walk(SRC);
if (rustFiles.length === 0) {
  console.error("No .rs files found under " + SRC);
  process.exit(2);
}

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, "/");
const sources = new Map(rustFiles.map((p) => [p, read(p)]));

const libRs = path.join(SRC, "lib.rs");
const errorsRs = path.join(SRC, "errors.rs");
const eventsRs = path.join(SRC, "events.rs");
const stateRs = path.join(SRC, "state.rs");
const anchorToml = path.join(ROOT, "Anchor.toml");

for (const required of [libRs, errorsRs, eventsRs, stateRs, anchorToml]) {
  if (!fs.existsSync(required)) fail("missing file: " + rel(required));
}
if (findings.length) {
// ------------------------------------------- account mutability vs. handler
// Anchor only serialises accounts marked `mut`. A handler that takes
// `&mut ctx.accounts.foo` without `mut` on the field silently drops the write.
// This is exactly the bug that made `Protocol.total_wills` always stay at 0.
for (const [file, text] of sources) {
  const structRe = /#\[derive\(Accounts\)\][\s\S]*?\npub struct\s+[A-Za-z0-9_]+[^{]*\{([\s\S]*?)\n\}/g;
  let sm;
  while ((sm = structRe.exec(text)) !== null) {
    const body = sm[1];
    // Fields declared without `mut`.
    const fieldRe = /#\[account\(([\s\S]*?)\)\]\s*\n\s*pub\s+([a-z_0-9]+)\s*:/g;
    let fm;
    while ((fm = fieldRe.exec(body)) !== null) {
      const attrs = fm[1];
      const name = fm[2];
      if (/\bmut\b/.test(attrs.split("constraint")[0])) continue;
      // Does any handler in this file mutate it?
      const mutates = new RegExp(`&mut\\s+ctx\\.accounts\\.${name}\\b`).test(text);
      if (mutates) {
        fail(
          `${rel(file)}: handler takes &mut ctx.accounts.${name} but '${name}' is not declared \`mut\`; the write will be silently dropped`
        );
      }
    }
  }
}

// ------------------------------------------------------- pause coverage
// Every instruction that touches a specific will must honour the protocol
// circuit breaker. A pause that only covers some instructions is a pause that
// does not work. `pause_protocol` / `unpause_protocol` are exempt by design.
const PAUSE_EXEMPT = new Set(["PauseProtocol", "UnpauseProtocol", "InitializeProtocol"]);
for (const [file, text] of sources) {
  const re = /#\[derive\(Accounts\)\][\s\S]*?\npub struct\s+([A-Za-z0-9_]+)[^{]*\{([\s\S]*?)\n\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const name = m[1];
    const body = m[2];
    if (PAUSE_EXEMPT.has(name)) continue;
    // Instructions that never read a will/vault cannot be affected by pause.
    if (!/\bpub will\s*:/.test(body) && !/\bpub vault\s*:/.test(body)) continue;
    if (!/\bpub protocol\s*:/.test(body)) {
      fail(`${rel(file)}: ${name} touches a will but has no \`protocol\` account; it cannot honour the circuit breaker`);
      continue;
    }
    const protoBlock = body.match(/#\[account\(([\s\S]*?)\)\]\s*\n\s*pub protocol\s*:/);
    if (!protoBlock || !/!protocol\.paused/.test(protoBlock[1])) {
      fail(`${rel(file)}: ${name} has \`protocol\` but no \`!protocol.paused\` constraint`);
    }
  }
}

report();
}

// ------------------------------------------------------- enum variant sets
function enumVariants(source, enumName) {
  const re = new RegExp(`pub enum ${enumName}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const m = source.match(re);
  if (!m) return null;
  const body = m[1];
  const variants = new Set();
  // Top-level variant declarations only: a line starting with an identifier.
  for (const line of body.split("\n")) {
    const vm = line.match(/^\s{4}([A-Z][A-Za-z0-9_]*)/);
    if (vm) variants.add(vm[1]);
  }
  return variants;
}

const errorVariants = enumVariants(sources.get(errorsRs), "LegacyLedgerError");
if (!errorVariants) fail("could not parse LegacyLedgerError enum");

const stateSrc = sources.get(stateRs);
const ruleTypeVariants = enumVariants(stateSrc, "RuleType");
const actionTypeVariants = enumVariants(stateSrc, "ActionType");
if (!ruleTypeVariants) fail("could not parse RuleType enum");
if (!actionTypeVariants) fail("could not parse ActionType enum");

// ------------------------------------------- error variant references
for (const [file, text] of sources) {
  const re = /LegacyLedgerError::([A-Za-z0-9_]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (errorVariants && !errorVariants.has(m[1])) {
      fail(`${rel(file)}: uses LegacyLedgerError::${m[1]}, which does not exist`);
    }
  }
}

// ------------------------------------------- state enum variant references
const enumRefs = [
  ["RuleType", ruleTypeVariants],
  ["ActionType", actionTypeVariants],
];
for (const [name, variants] of enumRefs) {
  for (const [file, text] of sources) {
    const re = new RegExp(`${name}::([A-Za-z0-9_]+)`, "g");
    let m;
    while ((m = re.exec(text)) !== null) {
      if (variants && !variants.has(m[1])) {
        fail(`${rel(file)}: uses ${name}::${m[1]}, which does not exist`);
      }
    }
  }
}

// ------------------------------------------------- event field agreement
function eventFields(source, structName) {
  const re = new RegExp(`pub struct ${structName}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const m = source.match(re);
  if (!m) return null;
  const fields = [];
  for (const line of m[1].split("\n")) {
    const fm = line.match(/^\s*pub ([a-z_][a-z0-9_]*)\s*:/);
    if (fm) fields.push(fm[1]);
  }
  return fields;
}

const eventsSrc = sources.get(eventsRs);
const emitRe = /emit!\s*\(\s*([A-Za-z0-9_]+)\s*\{([\s\S]*?)\n\s*\}\s*\)/g;
let emitCount = 0;
for (const [file, text] of sources) {
  let m;
  const re = new RegExp(emitRe.source, "g");
  while ((m = re.exec(text)) !== null) {
    emitCount++;
    const structName = m[1];
    const declared = eventFields(eventsSrc, structName);
    if (!declared) {
      fail(`${rel(file)}: emits ${structName}, which is not declared in events.rs`);
      continue;
    }
    const passed = [];
    for (const line of m[2].split("\n")) {
      const fm = line.match(/^\s*([a-z_][a-z0-9_]*)\s*[:,]/);
      if (fm) passed.push(fm[1]);
    }
    const missing = declared.filter((f) => !passed.includes(f));
    const extra = passed.filter((f) => !declared.includes(f));
    if (missing.length) {
      fail(`${rel(file)}: emit!(${structName}) omits field(s): ${missing.join(", ")}`);
    }
    if (extra.length) {
      fail(`${rel(file)}: emit!(${structName}) passes undeclared field(s): ${extra.join(", ")}`);
    }
  }
}
if (emitCount === 0) fail("no emit! call sites found - parser is probably broken");

// ------------------------------------- program entrypoint vs handler arity
function programFns(source) {
  // entrypoints look like: pub fn name(ctx: Context<X>, a: T, ..) -> Result<()>
  const re = /pub fn\s+([a-z0-9_]+)\s*\(\s*ctx:\s*Context<([A-Za-z0-9_]+)>\s*(?:,([\s\S]*?))?\)\s*->\s*Result<\(\)>/g;
  const map = new Map();
  let m;
  while ((m = re.exec(source)) !== null) {
    const rest = (m[3] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    map.set(m[1], { total: rest.length + 1, ctx: m[2] });
  }
  return map;
}

function handlerFns(source) {
  const re = /pub fn\s+([a-z0-9_]+)\s*\(\s*ctx:\s*Context<([A-Za-z0-9_]+)>\s*,?\s*([\s\S]*?)\)\s*->\s*Result<\(\)>/g;
  const map = new Map();
  let m;
  while ((m = re.exec(source)) !== null) {
    const rest = (m[3] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    map.set(m[1], { args: rest.length, ctxType: m[2] });
  }
  return map;
}

const libSrc = sources.get(libRs);
const entrypoints = programFns(libSrc);
if (entrypoints.size === 0) fail("no #[program] entrypoints parsed from lib.rs");

const allHandlers = new Map();
const ctxTypesDefined = new Set();

for (const [file, text] of sources) {
  // lib.rs holds the #[program] wrappers, which are not the handlers.
  if (file === libRs) continue;
  for (const [name, info] of handlerFns(text)) {
    if (allHandlers.has(name)) {
      fail(`duplicate handler fn '${name}' in ${rel(file)} and ${rel(allHandlers.get(name).file)}`);
    }
    allHandlers.set(name, { ...info, file });
    ctxTypesDefined.add(info.ctxType);
  }
}

// every Context<T> used by an entrypoint must be a declared #[derive(Accounts)] struct
const ctxRe = /pub struct ([A-Za-z0-9_]+)<'info>\s*\{/g;
for (const [file, text] of sources) {
  let m;
  const re = new RegExp(ctxRe.source, "g");
  while ((m = re.exec(text)) !== null) {
    const before = text.slice(Math.max(0, m.index - 200), m.index);
    if (!/derive\(Accounts\)/.test(before)) {
      fail(`${rel(file)}: '${m[1]}' has lifetime params but no #[derive(Accounts)] just above`);
    }
  }
}

for (const [name, info] of entrypoints) {
  const handler = allHandlers.get(name);
  if (!handler) {
    fail(`entrypoint '${name}' has no handler fn in instructions/`);
    continue;
  }
  if (handler.args !== info.total - 1) {
    fail(
      `arity mismatch on '${name}': entrypoint passes ${info.total - 1} args, handler takes ${handler.args}`
    );
  }
  if (info.ctx !== handler.ctxType) {
    fail(
      `context mismatch on '${name}': entrypoint uses Context<${info.ctx}>, handler expects Context<${handler.ctxType}>`
    );
  }
}
for (const name of allHandlers.keys()) {
  if (!entrypoints.has(name)) {
    note(`handler '${name}' has no #[program] entrypoint in lib.rs (not callable)`);
  }
}

// ------------------------------------------------------- program id drift
const declareMatch = libSrc.match(/declare_id!\("([1-9A-HJ-NP-Za-km-z]+)"\)/);
if (!declareMatch) {
  fail("could not parse declare_id! from lib.rs");
} else {
  const id = declareMatch[1];
  const toml = read(anchorToml);
  const tomlIds = [...toml.matchAll(/legacy_ledger\s*=\s*"([^"]+)"/g)].map((m) => m[1]);
  if (tomlIds.length === 0) {
    fail("Anchor.toml has no legacy_ledger program id");
  }
  for (const t of tomlIds) {
    if (t !== id) fail(`program id drift: lib.rs=${id} Anchor.toml=${t}`);
  }
  if (id === "11111111111111111111111111111111") fail("declare_id! is still the System Program placeholder");
  if (id === "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS") fail("declare_id! is still the Pump.fun placeholder");
  note(`program id consistent: ${id}`);
}

// crate name must match Anchor.toml key and the [lib] name
const programCargo = read(path.join(ROOT, "programs", "legacy-ledger", "Cargo.toml"));
const libName = programCargo.match(/\[lib\]\s*\nname\s*=\s*"([^"]+)"/);
const crateType = programCargo.match(/crate-type\s*=\s*\[([^\]]+)\]/);
if (!libName) fail("programs/legacy-ledger/Cargo.toml has no [lib] name");
if (!crateType) fail("programs/legacy-ledger/Cargo.toml has no crate-type");
else if (!/cdylib/.test(crateType[1])) fail("crate-type must include cdylib to produce a .so");
if (libName && libName[1] !== "legacy_ledger") fail(`[lib] name '${libName[1]}' != 'legacy_ledger'`);
if (!/^\s*anchor-lang/m.test(programCargo)) fail("Cargo.toml does not depend on anchor-lang");

// the workspace must list the program as an exact member path
const rootCargo = path.join(ROOT, "Cargo.toml");
if (!fs.existsSync(rootCargo)) {
  fail("no workspace Cargo.toml at repo root");
} else {
  const rootToml = read(rootCargo);
  const membersMatch = rootToml.match(/members\s*=\s*\[([\s\S]*?)\]/);
  if (!membersMatch) {
    fail("workspace Cargo.toml has no members list");
  } else {
    const members = membersMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
    const norm = (p) => p.replace(/\\/g, "/").replace(/\/+$/, "");
    const expected = norm(path.join("programs", "legacy-ledger"));
    if (!members.some((m) => norm(m) === expected)) {
      fail(`workspace members [${members.join(", ")}] does not include ${expected}`);
    }
    for (const m of members) {
      const onDisk = path.join(ROOT, m);
      if (!fs.existsSync(onDisk)) fail(`workspace member '${m}' does not exist on disk`);
    }
  }
}

// ----------------------------------------- unused error variant detection
const nonErrorCode = [...sources.entries()]
  .filter(([file]) => file !== errorsRs)
  .map(([, text]) => text)
  .join("\n");
for (const variant of errorVariants || []) {
  if (!new RegExp(`LegacyLedgerError::${variant}\\b`).test(nonErrorCode)) {
    fail(`errors.rs declares LegacyLedgerError::${variant} but nothing uses it (dead code)`);
  }
}

// ------------------------------------------------- deleted-item references
const deleted = [
  "HeirSBT",
  "withdraw_fees",
  "sbt_proof",
  "VerificationMethod",
  "total_value_usd",
  "OraclePriceData",
  "PYTH_PRICE_FEED",
  "switchboard",
  "pyth_solana_receiver_sdk",
  "token_2022",
  "is_paused",
  "rule.executed",
  "heir_marker",
  "rule_marker",
];
for (const [file, text] of sources) {
  for (const token of deleted) {
    if (text.includes(token)) fail(`${rel(file)}: still references removed item '${token}'`);
  }
  // self-referential seeds: an account's own field inside its own seeds
  const seedsRe = /#\[account\(([\s\S]*?)\)\]\s*\n\s*pub ([a-z_]+)\s*:/g;
  let m;
  while ((m = seedsRe.exec(text)) !== null) {
    const body = m[1];
    const selfName = m[2];
    const seedsMatch = body.match(/seeds\s*=\s*\[([\s\S]*?)\]/);
    if (!seedsMatch) continue;
    const seedsInner = seedsMatch[1];
    const re = new RegExp(`\\b${selfName}\\s*\\.`, "g");
    if (re.test(seedsInner)) {
      fail(`${rel(file)}: '${selfName}' seeds reference itself: [${seedsInner.trim()}]`);
    }
  }
}

// --------------------------------------------------- instruction arg usage
// every #[instruction(...)] list must be consumed by a matching handler signature
for (const [file, text] of sources) {
  const re = /#\[instruction\(([\s\S]*?)\)\]\s*\n\s*pub struct\s+([A-Za-z0-9_]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const declared = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const ctxName = m[2];
    const handlerName = ctxName.charAt(0).toLowerCase() + ctxName.slice(1);
    const handler = allHandlers.get(handlerName);
    if (!handler) continue;
    const ignores = handler.args === 0 && declared.length > 0;
    const usesAll =
      declared.length === handler.args ||
      (declared.length > 0 && text.includes(`_${declared[0].split(":")[0].trim()}`));
    if (!usesAll && !ignores) {
      note(
        `${rel(file)}: Context<${ctxName}> declares ${declared.length} instruction arg(s); verify handler '${handlerName}' consumes them`
      );
    }
  }
}

report();

function report() {
  for (const n of notes) console.log("NOTE  " + n);
  for (const f of findings) console.log("FAIL  " + f);
  const passed = 60 + 11 - findings.length;
  console.log(
    `\n${findings.length === 0 ? "OK" : "FAILED"}: ${findings.length} finding(s), ${notes.length} note(s)`
  );
  console.log("This is a consistency check, not a type check. cargo build-sbf is still required.");
  process.exit(findings.length === 0 ? 0 : 1);
}
