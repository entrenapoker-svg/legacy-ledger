"use client";

import { Buffer } from "buffer";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Connection, Keypair } from "@solana/web3.js";
import { CLUSTERS, ClusterId, DEFAULT_CLUSTER } from "@/lib/config";
import { AppWallet, LLProgram, getProgram, keypairWallet } from "@/lib/program";
import "@solana/wallet-adapter-react-ui/styles.css";

if (typeof globalThis !== "undefined" && !(globalThis as { Buffer?: unknown }).Buffer) {
  (globalThis as { Buffer?: unknown }).Buffer = Buffer;
}

/** Demo personas: throwaway keypairs kept in this browser so a live demo can switch roles without extensions. */
export const PERSONAS = ["Testator", "Heir A", "Heir B", "Keeper"] as const;
export type PersonaName = (typeof PERSONAS)[number];
export type SignerChoice = PersonaName | "Wallet";

function loadPersonas(): Record<PersonaName, Keypair> {
  const out = {} as Record<PersonaName, Keypair>;
  for (const name of PERSONAS) {
    const key = `ll-persona-${name}`;
    let kp: Keypair | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
    } catch {
      kp = null;
    }
    if (!kp) {
      kp = Keypair.generate();
      try {
        localStorage.setItem(key, JSON.stringify(Array.from(kp.secretKey)));
      } catch {
        /* storage unavailable: persona lives for this session only */
      }
    }
    out[name] = kp;
  }
  return out;
}

export interface LogEntry {
  id: number;
  kind: "ok" | "err" | "info";
  text: string;
  sig?: string;
}

interface AppState {
  cluster: ClusterId;
  setCluster(c: ClusterId): void;
  connection: Connection;
  personas: Record<PersonaName, Keypair> | null;
  signerChoice: SignerChoice;
  setSignerChoice(s: SignerChoice): void;
  wallet: AppWallet | null;
  program: LLProgram | null;
  log: LogEntry[];
  push(kind: LogEntry["kind"], text: string, sig?: string): void;
  refreshKey: number;
  refresh(): void;
}

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}

function readStored<T extends string>(key: string, fallback: T): T {
  try {
    return (localStorage.getItem(key) as T) || fallback;
  } catch {
    return fallback;
  }
}

function Inner({ children, cluster, setCluster }: { children: ReactNode; cluster: ClusterId; setCluster(c: ClusterId): void }) {
  const adapterWallet = useAnchorWallet();
  const [personas, setPersonas] = useState<Record<PersonaName, Keypair> | null>(null);
  const [signerChoice, setSignerChoiceState] = useState<SignerChoice>("Testator");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setPersonas(loadPersonas());
    setSignerChoiceState(readStored<SignerChoice>("ll-signer", "Testator"));
  }, []);

  const setSignerChoice = useCallback((s: SignerChoice) => {
    setSignerChoiceState(s);
    try {
      localStorage.setItem("ll-signer", s);
    } catch {}
  }, []);

  const connection = useMemo(() => new Connection(CLUSTERS[cluster].url, "confirmed"), [cluster]);

  const wallet: AppWallet | null = useMemo(() => {
    if (signerChoice === "Wallet") return (adapterWallet as AppWallet | undefined) ?? null;
    return personas ? keypairWallet(personas[signerChoice]) : null;
  }, [signerChoice, adapterWallet, personas]);

  const program = useMemo(() => (wallet ? getProgram(connection, wallet) : null), [connection, wallet]);

  const push = useCallback((kind: LogEntry["kind"], text: string, sig?: string) => {
    setLog((l) => [{ id: Date.now() + Math.random(), kind, text, sig }, ...l].slice(0, 30));
  }, []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const value: AppState = {
    cluster,
    setCluster,
    connection,
    personas,
    signerChoice,
    setSignerChoice,
    wallet,
    program,
    log,
    push,
    refreshKey,
    refresh,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [cluster, setClusterState] = useState<ClusterId>(DEFAULT_CLUSTER);
  useEffect(() => setClusterState(readStored<ClusterId>("ll-cluster", DEFAULT_CLUSTER)), []);
  const setCluster = (c: ClusterId) => {
    setClusterState(c);
    try {
      localStorage.setItem("ll-cluster", c);
    } catch {}
  };

  return (
    <ConnectionProvider endpoint={CLUSTERS[cluster].url}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Inner cluster={cluster} setCluster={setCluster}>
            {children}
          </Inner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
