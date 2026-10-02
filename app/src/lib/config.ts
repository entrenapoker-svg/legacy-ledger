import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import idl from "@/idl/legacy_ledger.json";

export const PROGRAM_ID = new PublicKey(idl.address);

export type ClusterId = "localnet" | "devnet";

export const CLUSTERS: Record<ClusterId, { label: string; url: string }> = {
  localnet: { label: "Localnet (127.0.0.1:8899)", url: "http://127.0.0.1:8899" },
  devnet: { label: "Devnet", url: process.env.NEXT_PUBLIC_DEVNET_RPC || clusterApiUrl("devnet") },
};

export const DEFAULT_CLUSTER: ClusterId =
  (process.env.NEXT_PUBLIC_DEFAULT_CLUSTER as ClusterId) || "devnet";

/**
 * The demo deployment is built with `--features demo`, where one inactivity
 * "day" lasts one second. Set NEXT_PUBLIC_DEMO_CLOCK=false for a production
 * build of the program.
 */
export const DEMO_CLOCK = process.env.NEXT_PUBLIC_DEMO_CLOCK !== "false";
export const SECONDS_PER_DAY = DEMO_CLOCK ? 1 : 86_400;

export const MIN_INACTIVITY_DAYS = 30;
export const BPS_TOTAL = 10_000;

export function explorerTx(sig: string, cluster: ClusterId) {
  const c =
    cluster === "localnet"
      ? "custom&customUrl=" + encodeURIComponent(CLUSTERS.localnet.url)
      : cluster;
  return `https://explorer.solana.com/tx/${sig}?cluster=${c}`;
}

export function explorerAddress(addr: string, cluster: ClusterId) {
  const c =
    cluster === "localnet"
      ? "custom&customUrl=" + encodeURIComponent(CLUSTERS.localnet.url)
      : cluster;
  return `https://explorer.solana.com/address/${addr}?cluster=${c}`;
}
