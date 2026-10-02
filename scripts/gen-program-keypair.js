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

const { privateKey } = crypto.generateKeyPairSync("ed25519");
const jwk = privateKey.export({ format: "jwk" });

const seed = Buffer.from(jwk.d, "base64url");
const pubkey = Buffer.from(jwk.x, "base64url");

if (seed.length !== 32 || pubkey.length !== 32) {
  throw new Error("seed/pubkey size unexpected");
}

const secretKey = Buffer.concat([seed, pubkey]);

const outDir = path.join(__dirname, "..", "target", "deploy");
fs.mkdirSync(outDir, { recursive: true });
const keypairPath = path.join(outDir, "legacy_ledger-keypair.json");
fs.writeFileSync(keypairPath, JSON.stringify({ version: 0, secretKey: Array.from(secretKey) }));

console.log("PROGRAM_ID=" + base58(pubkey));
console.log("KEYPAIR=" + keypairPath);
console.log("SEED_HEX=" + seed.toString("hex"));
