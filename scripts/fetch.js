/**
 * Fetch helper for research. Reuses the free Firecrawl key that already lives in
 * the investigador project, so this repo does not need its own .env.
 *
 * Usage:
 *   node scripts\fetch.js <url> [markdown|raw]
 *   node scripts\fetch.js --file urls.txt
 *
 * Falls back to plain fetch when Firecrawl is unavailable, and says so, rather
 * than silently returning nothing.
 */

const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(
  "C:\\Users\\jamaik\\Desktop\\investigador\\.env"
);

function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^\s*#/.test(line) || !line.trim()) continue;
    const m = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = readEnv(ENV_PATH);
const KEY = env.FIRECRAWL_API_KEY;

async function viaFirecrawl(url, format) {
  if (!KEY) throw new Error("FIRECRAWL_API_KEY missing in " + ENV_PATH);
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: [format === "raw" ? "rawHtml" : "markdown"],
      onlyMainContent: format !== "raw",
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (!json.success) throw new Error("Firecrawl returned success=false");
  return json.data[format === "raw" ? "rawHtml" : "markdown"] || "";
}

async function viaPlainFetch(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (research)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const args = process.argv.slice(2);
  let urls = [];
  let format = "markdown";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file") urls.push(...fs.readFileSync(args[i + 1], "utf8").split(/\r?\n/).filter((l) => l.trim()));
    else if (args[i] === "--raw") format = "raw";
    else urls.push(args[i]);
  }

  if (urls.length === 0) {
    console.error("no urls given");
    process.exit(2);
  }

  console.log(`Firecrawl key: ${KEY ? "found (len " + KEY.length + ")" : "NOT FOUND"}`);
  console.log(`Format: ${format}\n`);

  for (const url of urls) {
    console.log("=".repeat(78));
    console.log("URL: " + url);
    console.log("=".repeat(78));
    let body, how;
    try {
      body = await viaFirecrawl(url, format);
      how = "firecrawl";
    } catch (e) {
      console.log("[firecrawl failed: " + e.message + "] trying plain fetch");
      try {
        body = await viaPlainFetch(url);
        how = "plain";
      } catch (e2) {
        console.log("[both failed: " + e2.message + "]");
        continue;
      }
    }
    console.log(`[source: ${how}, ${body.length} chars]\n`);
    console.log(body);
    console.log("\n");
  }
}

main();
