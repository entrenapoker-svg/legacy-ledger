const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58(buf) {
  let zeros = 0;
  while (zeros < buf.length && buf[zeros] === 0) zeros++;
  const digits = [0];
  for (let i = zeros; i < buf.length; i++) {
    let carry = buf[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let out = "1".repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) out += ALPHABET[digits[i]];
  return out;
}

const keypairPath = path.join(__dirname, "..", "target", "deploy", "legacy_ledger-keypair.json");
const kp = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
const secretKey = Buffer.from(kp.secretKey);

const checks = [];
const push = (name, ok, detail) => checks.push({ name, ok, detail });

push("version === 0", kp.version === 0, `version=${kp.version}`);
push("secretKey is 64 bytes", secretKey.length === 64, `len=${secretKey.length}`);

const seed = secretKey.subarray(0, 32);
const storedPub = secretKey.subarray(32, 64);

// Re-derive the public key from the seed alone and compare.
let derivedPub = null;
try {
  const jwk = {
    kty: "OKP",
    crv: "Ed25519",
    d: seed.toString("base64url"),
    x: storedPub.toString("base64url"),
  };
  const priv = crypto.createPrivateKey({ key: jwk, format: "jwk" });
  derivedPub = Buffer.from(priv.export({ format: "jwk" }).x, "base64url");
} catch (e) {
  push("re-derive pubkey from seed", false, e.message);
}

if (derivedPub) {
  push(
    "seed derives the stored pubkey",
    derivedPub.equals(storedPub),
    derivedPub.equals(storedPub) ? "match" : "MISMATCH"
  );
}

push("pubkey is 32 bytes", storedPub.length === 32, `len=${storedPub.length}`);
push("seed is non-zero", seed.some((b) => b !== 0), "ok");

function base58Decode(str) {
  const bytes = [0];
  for (const ch of str) {
    const val = ALPHABET.indexOf(ch);
    if (val < 0) throw new Error(`invalid base58 char: ${ch}`);
    let carry = val;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  let zeros = 0;
  while (zeros < str.length && str[zeros] === "1") zeros++;
  return Buffer.from([...new Array(zeros).fill(0), ...bytes.reverse()]);
}

const programId = base58(storedPub);

let roundTripOk = false;
let roundTripDetail = "";
try {
  const back = base58Decode(programId);
  roundTripOk = back.equals(storedPub);
  roundTripDetail = `decoded ${back.length} bytes, roundtrip=${roundTripOk}`;
} catch (e) {
  roundTripDetail = e.message;
}

push("program id base58 round-trips to 32 bytes", roundTripOk, roundTripDetail);
push(
  "program id is not the Pump.fun placeholder",
  programId !== "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
  programId
);
push(
  "program id is not the System Program placeholder",
  programId !== "11111111111111111111111111111111",
  programId
);

for (const c of checks) {
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.detail ? "  (" + c.detail + ")" : ""}`);
}
console.log("\nPROGRAM_ID=" + programId);
const failed = checks.filter((c) => !c.ok).length;
console.log(failed === 0 ? "ALL CHECKS PASSED" : `${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
