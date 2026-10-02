/**
 * Mutation test for check-program.js.
 *
 * A consistency checker that cannot fail is worse than no checker. This copies
 * the project to a temp dir, injects one realistic regression at a time, and
 * asserts the checker reports it. Then it re-runs the checker on the pristine
 * tree to confirm a clean pass.
 *
 * Run: node scripts/self-test-checker.js
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const CHECKER = path.join(__dirname, "check-program.js");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "target") continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function runChecker(root) {
  try {
    const out = execFileSync(process.execPath, [CHECKER, root], { encoding: "utf8" });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") };
  }
}

const edits = {
  "programs/legacy-ledger/src/errors.rs": (t) =>
    t.replace("ZeroAmount,", "ZeroAmountRenamed,"),

  "programs/legacy-ledger/src/events.rs": (t) => t.replace("    pub inactivity_deadline: i64,\n", ""),

  "programs/legacy-ledger/src/lib.rs": (t) =>
    t.replace(/declare_id!\("[1-9A-HJ-NP-Za-km-z]+"\)/, 'declare_id!("11111111111111111111111111111111")'),

  "Anchor.toml": (t) => t.replace(/legacy_ledger = "[1-9A-HJ-NP-Za-km-z]+"/, 'legacy_ledger = "22222222222222222222222222222222"'),

  "programs/legacy-ledger/src/instructions/heartbeat.rs": (t) =>
    t.replace(
      "seeds = [WILL_SEED, will_id.as_bytes()]",
      "seeds = [WILL_SEED, will.will_id.as_bytes()]"
    ),

  "programs/legacy-ledger/src/instructions/heartbeat.rs:arity": (t) =>
    t.replace("pub fn heartbeat(ctx: Context<Heartbeat>, _will_id: String) -> Result<()> {", "pub fn heartbeat(ctx: Context<Heartbeat>) -> Result<()> {"),

  "programs/legacy-ledger/src/instructions/execute_will.rs": (t) =>
    t.replace("RuleType::DateTrigger { timestamp } => now >= timestamp,", "RuleType::DateReached { timestamp } => now >= timestamp,"),

  "programs/legacy-ledger/src/instructions/claim_inheritance.rs": (t) =>
    t.replace("pub heir: Signer<'info>,", "pub heir: Signer<'info>,\n    pub heir_marker: AccountInfo<'info>,"),

  "Cargo.toml": (t) => t.replace("programs/legacy-ledger", "programs/legacy-ledger-typo"),

  "programs/legacy-ledger/Cargo.toml": (t) =>
    t.replace('crate-type = ["cdylib", "lib"]', 'crate-type = ["lib"]'),
};

const expectations = [
  ["renamed error variant is reported", "programs/legacy-ledger/src/errors.rs"],  ["deleted event field is reported", "programs/legacy-ledger/src/events.rs"],
  ["placeholder declare_id is reported", "programs/legacy-ledger/src/lib.rs"],
  ["Anchor.toml program id drift is reported", "Anchor.toml"],
  ["self-referential seed is reported", "programs/legacy-ledger/src/instructions/heartbeat.rs"],
  ["handler arity drift is reported", "programs/legacy-ledger/src/instructions/heartbeat.rs:arity"],
  ["non-existent enum variant is reported", "programs/legacy-ledger/src/instructions/execute_will.rs"],
  ["stray marker account is reported", "programs/legacy-ledger/src/instructions/claim_inheritance.rs"],
  ["workspace member drift is reported", "Cargo.toml"],
  ["missing cdylib crate-type is reported", "programs/legacy-ledger/Cargo.toml"],
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ll-checker-"));
let failures = 0;

// baseline: the real tree must pass
const baseline = runChecker(ROOT);
if (baseline.code !== 0) {
  console.log("FAIL  baseline tree does not pass the checker");
  console.log(baseline.out);
  failures++;
} else {
  console.log("PASS  baseline tree passes the checker");
}

for (const [label, key] of expectations) {
  const [relPath, variant] = key.split(":");
  const work = path.join(tmp, label.replace(/\W+/g, "_"));
  copyDir(ROOT, work);

  const target = path.join(work, relPath);
  const before = fs.readFileSync(target, "utf8");
  const after = edits[key](before);
  if (after === before) {
    console.log(`FAIL  mutation for "${label}" did not change ${relPath} - the mutation is stale`);
    failures++;
    continue;
  }
  fs.writeFileSync(target, after);

  const result = runChecker(work);
  if (result.code === 0) {
    console.log(`FAIL  "${label}" was NOT detected`);
    console.log(result.out);
    failures++;
  } else {
    const firstFail = (result.out.match(/^FAIL.*$/m) || ["(no FAIL line)"])[0].trim();
    console.log(`PASS  "${label}" detected -> ${firstFail.slice(0, 110)}`);
  }
  void variant;
}

fs.rmSync(tmp, { recursive: true, force: true });

console.log(`\n${failures === 0 ? "OK" : "FAILED"}: ${failures} self-test failure(s)`);
process.exit(failures === 0 ? 0 : 1);
