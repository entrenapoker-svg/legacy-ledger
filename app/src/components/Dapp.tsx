"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BN } from "@anchor-lang/core";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Coins,
  ExternalLink,
  HeartPulse,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { PERSONAS, SignerChoice, useApp } from "./Providers";
import {
  CLUSTERS,
  ClusterId,
  DEMO_CLOCK,
  MIN_INACTIVITY_DAYS,
  SECONDS_PER_DAY,
  explorerAddress,
  explorerTx,
} from "@/lib/config";
import {
  HeirInput,
  WillAccount,
  claim,
  createDemoToken,
  createWill,
  deadlineOf,
  deposit,
  executeWill,
  explainError,
  fetchVaultAssets,
  heartbeat,
  initializeProtocol,
  pdas,
  withdraw,
} from "@/lib/program";

const short = (k: PublicKey | string) => {
  const s = typeof k === "string" ? k : k.toBase58();
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
};

function useTokenLabels(cluster: ClusterId) {
  const key = `ll-tokens-${cluster}`;
  const [labels, setLabels] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      setLabels(JSON.parse(localStorage.getItem(key) || "{}"));
    } catch {
      setLabels({});
    }
  }, [key]);
  const add = (mint: string, label: string) => {
    setLabels((prev) => {
      const next = { ...prev, [mint]: label };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  return { labels, add, label: (m: string) => labels[m] ?? short(m) };
}

/** Runs an on-chain action with logging, and refreshes all views afterwards. */
function useAction() {
  const { push, refresh } = useApp();
  const [busy, setBusy] = useState<string | null>(null);
  const run = useCallback(
    async (name: string, fn: () => Promise<string | void>) => {
      setBusy(name);
      push("info", `${name}…`);
      try {
        const sig = await fn();
        push("ok", `${name}: confirmed`, sig || undefined);
        refresh();
        return true;
      } catch (e) {
        console.error(e);
        push("err", `${name}: ${explainError(e)}`);
        return false;
      } finally {
        setBusy(null);
      }
    },
    [push, refresh]
  );
  return { busy, run };
}

function formatDuration(secs: number) {
  if (secs <= 0) return "0s";
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
}

function useNow() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* ------------------------------------------------------------------ */

function TopBar() {
  const { cluster, setCluster, signerChoice, setSignerChoice, wallet, connection, refreshKey, push, personas } = useApp();
  const [sol, setSol] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    if (!wallet) return setSol(null);
    connection
      .getBalance(wallet.publicKey)
      .then((b) => alive && setSol(b / LAMPORTS_PER_SOL))
      .catch(() => alive && setSol(null));
    return () => {
      alive = false;
    };
  }, [wallet, connection, refreshKey]);

  const airdrop = async () => {
    if (!wallet) return;
    try {
      push("info", "Requesting 2 SOL airdrop…");
      const sig = await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, "confirmed");
      push("ok", "Airdrop received", sig);
      setSol((await connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL);
    } catch (e) {
      push(
        "err",
        `Airdrop failed (${explainError(e)}). On devnet use https://faucet.solana.com with the address ${wallet.publicKey.toBase58()}`
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="mr-auto flex items-center gap-2">
          <Shield className="h-7 w-7 text-accent" />
          <span className="font-heading text-lg font-bold">LegacyLedger</span>
          {DEMO_CLOCK && (
            <span className="rounded-full border border-accent/40 px-2 py-0.5 text-xs text-accent" title="Program built with the demo feature">
              demo clock · 1 day = 1 s
            </span>
          )}
        </div>
        <select className="select" value={cluster} onChange={(e) => setCluster(e.target.value as ClusterId)} aria-label="Cluster">
          {(Object.keys(CLUSTERS) as ClusterId[]).map((c) => (
            <option key={c} value={c}>
              {CLUSTERS[c].label}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={signerChoice}
          onChange={(e) => setSignerChoice(e.target.value as SignerChoice)}
          aria-label="Act as"
        >
          {PERSONAS.map((p) => (
            <option key={p} value={p}>
              Act as: {p} {personas ? `(${short(personas[p].publicKey)})` : ""}
            </option>
          ))}
          <option value="Wallet">Act as: browser wallet</option>
        </select>
        {signerChoice === "Wallet" && <WalletMultiButton />}
        {wallet && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">{sol === null ? "…" : `${sol.toFixed(3)} SOL`}</span>
            <button className="btn-ghost-sm" onClick={airdrop}>
              Airdrop
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

function ProtocolGate() {
  const { program, connection, refreshKey } = useApp();
  const [exists, setExists] = useState<boolean | null>(null);
  const [programMissing, setProgramMissing] = useState(false);
  const { busy, run } = useAction();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [proto, prog] = await Promise.all([
          connection.getAccountInfo(pdas.protocol()),
          connection.getAccountInfo(new PublicKey(program?.programId ?? pdas.protocol())),
        ]);
        if (!alive) return;
        setExists(!!proto);
        setProgramMissing(!prog || !prog.executable);
      } catch {
        if (alive) setExists(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [connection, program, refreshKey]);

  if (programMissing && program)
    return (
      <div className="card-base border-accent/50 text-sm">
        <AlertTriangle className="mr-2 inline h-4 w-4 text-accent" />
        The program <code>{short(program.programId)}</code> is not deployed on this cluster. Run{" "}
        <code>scripts/demo-local.sh</code> for localnet, or <code>scripts/deploy-devnet.sh</code> for devnet.
      </div>
    );
  if (exists !== false || !program) return null;
  return (
    <div className="card-base flex flex-wrap items-center gap-3 border-accent/50">
      <AlertTriangle className="h-5 w-5 text-accent" />
      <span className="mr-auto text-sm">The protocol config account is not initialized on this cluster yet (one-time step).</span>
      <button className="btn-primary-sm" disabled={!!busy} onClick={() => run("Initialize protocol", () => initializeProtocol(program))}>
        Initialize protocol
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DemoTokens() {
  const { program, wallet, connection, refreshKey, cluster } = useApp();
  const { labels, add, label } = useTokenLabels(cluster);
  const { busy, run } = useAction();
  const [holdings, setHoldings] = useState<{ mint: string; amount: string }[]>([]);

  useEffect(() => {
    let alive = true;
    if (!wallet) return;
    connection
      .getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_PROGRAM_ID })
      .then((r) => {
        if (!alive) return;
        setHoldings(
          r.value.map((a) => ({
            mint: a.account.data.parsed.info.mint as string,
            amount: a.account.data.parsed.info.tokenAmount.uiAmountString as string,
          }))
        );
      })
      .catch(() => alive && setHoldings([]));
    return () => {
      alive = false;
    };
  }, [wallet, connection, refreshKey, labels]);

  const mintDemo = () =>
    run("Mint demo tokens", async () => {
      if (!program) throw new Error("No signer");
      const bond = await createDemoToken(program, 6, 1000);
      add(bond.toBase58(), "dBOND (demo)");
      const usd = await createDemoToken(program, 6, 5000);
      add(usd.toBase58(), "dUSD (demo)");
    });

  return (
    <section className="card-base space-y-3">
      <h2 className="flex items-center gap-2 text-lg">
        <Coins className="h-5 w-5 text-accent" /> Your tokens
      </h2>
      <p className="text-sm text-muted">
        The vault holds any SPL token. For the demo, mint two test tokens: a tokenized bond stand-in and a dollar stand-in. They have no value.
      </p>
      {holdings.length === 0 ? (
        <p className="text-sm text-muted">No SPL tokens in this account.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {holdings.map((h) => (
            <li key={h.mint} className="flex justify-between">
              <span>{label(h.mint)}</span>
              <span className="tabular-nums">{h.amount}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="btn-secondary-sm" disabled={!program || !!busy} onClick={mintDemo}>
        <Plus className="h-4 w-4" /> Mint demo tokens
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CreateWill({ onCreated }: { onCreated(id: string): void }) {
  const { program, personas } = useApp();
  const { busy, run } = useAction();
  const [willId, setWillId] = useState("");
  const [days, setDays] = useState(MIN_INACTIVITY_DAYS);
  const [useDate, setUseDate] = useState(false);
  const [date, setDate] = useState("");
  const [heirs, setHeirs] = useState<HeirInput[]>([{ name: "", wallet: "", percent: 100 }]);

  useEffect(() => setWillId(`will-${Math.random().toString(36).slice(2, 8)}`), []);

  const total = heirs.reduce((s, h) => s + (Number(h.percent) || 0), 0);
  const validWallets = heirs.every((h) => {
    try {
      new PublicKey(h.wallet);
      return true;
    } catch {
      return false;
    }
  });
  const valid =
    willId.length > 0 &&
    willId.length <= 64 &&
    days >= MIN_INACTIVITY_DAYS &&
    heirs.length > 0 &&
    heirs.every((h) => h.name.trim() && h.percent > 0) &&
    validWallets &&
    Math.abs(total - 100) < 1e-9 &&
    (!useDate || !!date);

  const fillDemo = () => {
    if (!personas) return;
    setHeirs([
      { name: "Ana (daughter)", wallet: personas["Heir A"].publicKey.toBase58(), percent: 60 },
      { name: "Bruno (son)", wallet: personas["Heir B"].publicKey.toBase58(), percent: 40 },
    ]);
  };

  const submit = () =>
    run("Create will", async () => {
      if (!program) throw new Error("No signer");
      const ts = useDate ? Math.floor(new Date(date).getTime() / 1000) : null;
      const sig = await createWill(program, willId, days, heirs, ts);
      onCreated(willId);
      setWillId(`will-${Math.random().toString(36).slice(2, 8)}`);
      return sig;
    });

  const set = (i: number, patch: Partial<HeirInput>) => setHeirs((hs) => hs.map((h, j) => (j === i ? { ...h, ...patch } : h)));

  return (
    <section className="card-base space-y-4">
      <h2 className="flex items-center gap-2 text-lg">
        <Plus className="h-5 w-5 text-accent" /> Create a will
      </h2>
      <label className="block text-sm">
        <span className="text-muted">Will ID (public, unique)</span>
        <input className="input-base mt-1" value={willId} onChange={(e) => setWillId(e.target.value.trim())} maxLength={64} />
      </label>
      <label className="block text-sm">
        <span className="text-muted">
          Fire after this many days without a sign of life (min {MIN_INACTIVITY_DAYS})
          {DEMO_CLOCK && ` — demo clock: ${days} days = ${days} seconds`}
        </span>
        <input
          className="input-base mt-1"
          type="number"
          min={MIN_INACTIVITY_DAYS}
          max={3650}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} />
        <span className="text-muted">Also release on a fixed date</span>
      </label>
      {useDate && <input className="input-base" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Heirs (must add up to 100%)</span>
          <button className="text-accent hover:underline" onClick={fillDemo}>
            Use demo heirs
          </button>
        </div>
        {heirs.map((h, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.4fr_70px_32px] gap-2">
            <input className="input-sm" placeholder="Name" value={h.name} onChange={(e) => set(i, { name: e.target.value })} />
            <input className="input-sm" placeholder="Wallet address" value={h.wallet} onChange={(e) => set(i, { wallet: e.target.value.trim() })} />
            <input
              className="input-sm"
              type="number"
              min={0.01}
              max={100}
              step={0.01}
              value={h.percent}
              onChange={(e) => set(i, { percent: Number(e.target.value) })}
              aria-label="Percent"
            />
            <button className="text-muted hover:text-accent" onClick={() => setHeirs((hs) => hs.filter((_, j) => j !== i))} aria-label="Remove heir">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm">
          <button className="text-accent hover:underline" disabled={heirs.length >= 10} onClick={() => setHeirs((hs) => [...hs, { name: "", wallet: "", percent: 0 }])}>
            + Add heir
          </button>
          <span className={Math.abs(total - 100) < 1e-9 ? "text-green-400" : "text-accent"}>Total {total}%</span>
        </div>
      </div>
      <button className="btn-primary w-full" disabled={!program || !valid || !!busy} onClick={submit}>
        {busy ? "Signing…" : "Create will"}
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface AssetRow {
  mint: PublicKey;
  amount: BN;
  decimals: number;
}

function WillView({ willId }: { willId: string }) {
  const { program, wallet, connection, refreshKey, cluster } = useApp();
  const { label } = useTokenLabels(cluster);
  const { busy, run } = useAction();
  const now = useNow();
  const [will, setWill] = useState<WillAccount | null | undefined>(undefined);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [myTokens, setMyTokens] = useState<{ mint: string; amount: string; decimals: number }[]>([]);
  const [depMint, setDepMint] = useState("");
  const [depAmount, setDepAmount] = useState("100");

  const willPda = useMemo(() => pdas.will(willId), [willId]);

  useEffect(() => {
    let alive = true;
    if (!program) return;
    (async () => {
      try {
        const w = await program.account.will.fetchNullable(willPda);
        if (!alive) return;
        setWill(w);
        if (!w) return setAssets([]);
        const va = await fetchVaultAssets(program, w.vault);
        const rows = await Promise.all(
          va.map(async ({ account }) => ({
            mint: account.mint,
            amount: account.amount,
            decimals: (await getMint(connection, account.mint)).decimals,
          }))
        );
        if (alive) setAssets(rows);
      } catch (e) {
        console.error(e);
        if (alive) setWill(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [program, willPda, connection, refreshKey]);

  useEffect(() => {
    let alive = true;
    if (!wallet) return;
    connection
      .getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_PROGRAM_ID })
      .then((r) => {
        if (!alive) return;
        const toks = r.value
          .map((a) => ({
            mint: a.account.data.parsed.info.mint as string,
            amount: a.account.data.parsed.info.tokenAmount.uiAmountString as string,
            decimals: a.account.data.parsed.info.tokenAmount.decimals as number,
          }))
          .filter((t) => Number(t.amount) > 0);
        setMyTokens(toks);
        setDepMint((m) => m || toks[0]?.mint || "");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [wallet, connection, refreshKey]);

  if (will === undefined) return <section className="card-base text-muted">Loading {willId}…</section>;
  if (will === null)
    return (
      <section className="card-base text-muted">
        No will with ID <code>{willId}</code> on this cluster.
      </section>
    );

  const me = wallet?.publicKey.toBase58();
  const isTestator = me === will.testator.toBase58();
  const heirIndex = will.heirs.findIndex((h) => h.wallet.toBase58() === me);
  const deadline = deadlineOf(will);
  const left = deadline - now;
  const dateRule = will.rules.find((r) => "dateTrigger" in r.ruleType && r.enabled);
  const dateTs = dateRule && "dateTrigger" in dateRule.ruleType ? dateRule.ruleType.dateTrigger!.timestamp.toNumber() : null;
  const fireable = !will.isExecuted && (left <= 0 || (dateTs !== null && now >= dateTs));
  const status = will.isExecuted ? "Executed — heirs can claim" : fireable ? "Silence period over — anyone can execute" : "Active";
  const pct = Math.max(0, Math.min(100, ((now - will.lastHeartbeat.toNumber()) / (will.inactivityThresholdDays * SECONDS_PER_DAY)) * 100));

  const toBase = (ui: string, decimals: number) => {
    const [i, f = ""] = ui.split(".");
    return new BN(i + f.padEnd(decimals, "0").slice(0, decimals));
  };
  const fmt = (a: BN, d: number) => {
    const s = a.toString().padStart(d + 1, "0");
    const whole = s.slice(0, s.length - d);
    const frac = s.slice(s.length - d).replace(/0+$/, "");
    return frac ? `${whole}.${frac}` : whole;
  };
  const selectedDecimals = myTokens.find((t) => t.mint === depMint)?.decimals ?? assets.find((a) => a.mint.toBase58() === depMint)?.decimals ?? 6;

  return (
    <section className="card-base space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl">{will.willId}</h2>
          <p className="text-sm text-muted">
            Testator{" "}
            <a className="link-base" href={explorerAddress(will.testator.toBase58(), cluster)} target="_blank" rel="noreferrer">
              {short(will.testator)}
            </a>{" "}
            · will account{" "}
            <a className="link-base" href={explorerAddress(willPda.toBase58(), cluster)} target="_blank" rel="noreferrer">
              {short(willPda)}
            </a>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            will.isExecuted ? "bg-green-500/15 text-green-400" : fireable ? "bg-accent/20 text-accent" : "bg-white/10 text-white"
          }`}
        >
          {status}
        </span>
      </div>

      {!will.isExecuted && (
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted">Silence since last sign of life</span>
            <span className="tabular-nums">{left > 0 ? `fires in ${formatDuration(left)}` : "deadline passed"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-white/10">
            <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">
            Threshold: {will.inactivityThresholdDays} days{DEMO_CLOCK ? " (demo clock: seconds)" : ""}.{" "}
            {dateTs && `Also releases on ${new Date(dateTs * 1000).toLocaleString()}.`}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {isTestator && !will.isExecuted && (
          <button className="btn-primary-sm" disabled={!!busy} onClick={() => run("I'm alive (heartbeat)", () => heartbeat(program!, willId))}>
            <HeartPulse className="h-4 w-4" /> I&apos;m alive
          </button>
        )}
        {!will.isExecuted && (
          <button
            className="btn-secondary-sm"
            disabled={!!busy || !fireable}
            title={fireable ? "Anyone can do this" : "Not yet: the testator is still inside the silence window"}
            onClick={() => run("Execute will (keeper)", () => executeWill(program!, willId))}
          >
            <Zap className="h-4 w-4" /> Execute (any keeper)
          </button>
        )}
        {will.isExecuted && heirIndex >= 0 && !will.heirs[heirIndex].claimed && (
          <button className="btn-primary-sm" disabled={!!busy} onClick={() => run(`Claim inheritance (${will.heirs[heirIndex].name})`, () => claim(program!, willId, heirIndex))}>
            <CheckCircle2 className="h-4 w-4" /> Claim my {will.heirs[heirIndex].allocationBps / 100}%
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm text-muted">
          <Users className="h-4 w-4" /> Heirs
        </h3>
        <table className="w-full text-sm">
          <tbody>
            {will.heirs.map((h, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-1.5">
                  {h.name} {heirIndex === i && <span className="text-accent">(you)</span>}
                </td>
                <td className="text-muted">{short(h.wallet)}</td>
                <td className="text-right tabular-nums">{h.allocationBps / 100}%</td>
                <td className="text-right">{h.claimed ? <span className="text-green-400">claimed</span> : <span className="text-muted">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm text-muted">
          <Coins className="h-4 w-4" /> Vault
        </h3>
        {assets.length === 0 ? (
          <p className="text-sm text-muted">Empty. {isTestator && "Deposit tokens below."}</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {assets.map((a) => (
                <tr key={a.mint.toBase58()} className="border-t border-border">
                  <td className="py-1.5">{label(a.mint.toBase58())}</td>
                  <td className="text-right tabular-nums">{fmt(a.amount, a.decimals)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isTestator && !will.isExecuted && (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <p className="text-sm text-muted">Move tokens into the vault, or take them back while you are alive. Either one counts as a sign of life.</p>
          <div className="flex flex-wrap gap-2">
            <select className="select flex-1" value={depMint} onChange={(e) => setDepMint(e.target.value)}>
              {[...new Set([...myTokens.map((t) => t.mint), ...assets.map((a) => a.mint.toBase58())])].map((m) => (
                <option key={m} value={m}>
                  {label(m)} {myTokens.find((t) => t.mint === m) ? `— wallet: ${myTokens.find((t) => t.mint === m)!.amount}` : ""}
                </option>
              ))}
            </select>
            <input className="input-sm w-28" value={depAmount} onChange={(e) => setDepAmount(e.target.value)} aria-label="Amount" />
            <button
              className="btn-primary-sm"
              disabled={!!busy || !depMint}
              onClick={() => run("Deposit", () => deposit(program!, willId, new PublicKey(depMint), toBase(depAmount, selectedDecimals)))}
            >
              Deposit
            </button>
            <button
              className="btn-secondary-sm"
              disabled={!!busy || !assets.some((a) => a.mint.toBase58() === depMint)}
              onClick={() => run("Withdraw", () => withdraw(program!, willId, new PublicKey(depMint), toBase(depAmount, selectedDecimals)))}
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function WillList({ selected, onSelect }: { selected: string; onSelect(id: string): void }) {
  const { program, wallet, refreshKey } = useApp();
  const [wills, setWills] = useState<{ id: string; role: string }[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    if (!program || !wallet) return;
    program.account.will
      .all()
      .then((all) => {
        if (!alive) return;
        const me = wallet.publicKey.toBase58();
        const mine = all
          .map(({ account }) => {
            const roles = [];
            if (account.testator.toBase58() === me) roles.push("testator");
            if (account.heirs.some((h) => h.wallet.toBase58() === me)) roles.push("heir");
            return { id: account.willId, role: roles.join(" + "), created: account.createdAt.toNumber() };
          })
          .filter((w) => w.role)
          .sort((a, b) => b.created - a.created);
        setWills(mine);
      })
      .catch(() => alive && setWills([]));
    return () => {
      alive = false;
    };
  }, [program, wallet, refreshKey]);

  return (
    <section className="card-base space-y-3">
      <h2 className="flex items-center gap-2 text-lg">
        <Search className="h-5 w-5 text-accent" /> Wills
      </h2>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) onSelect(query.trim());
        }}
      >
        <input className="input-sm flex-1" placeholder="Open any will by ID (keepers, heirs)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn-secondary-sm">Open</button>
      </form>
      {wills.length === 0 ? (
        <p className="text-sm text-muted">This account is not testator or heir of any will yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {wills.map((w) => (
            <li key={w.id}>
              <button
                className={`flex w-full justify-between rounded px-2 py-1 text-left hover:bg-white/5 ${selected === w.id ? "bg-accent/10" : ""}`}
                onClick={() => onSelect(w.id)}
              >
                <span>{w.id}</span>
                <span className="text-muted">{w.role}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ActivityLog() {
  const { log, cluster, refresh } = useApp();
  return (
    <section className="card-base space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-accent" /> Activity
        </h2>
        <button className="text-muted hover:text-accent" onClick={refresh} aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      {log.length === 0 && <p className="text-sm text-muted">Transactions you sign appear here with a link to the explorer.</p>}
      <ul className="max-h-64 space-y-1 overflow-auto text-xs">
        {log.map((l) => (
          <li key={l.id} className={l.kind === "err" ? "text-red-400" : l.kind === "ok" ? "text-green-400" : "text-muted"}>
            {l.text}{" "}
            {l.sig && (
              <a className="link-base inline-flex items-center gap-1" href={explorerTx(l.sig, cluster)} target="_blank" rel="noreferrer">
                tx <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function Dapp() {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("will");
    if (id) setSelected(id);
  }, []);

  const select = (id: string) => {
    setSelected(id);
    const url = new URL(window.location.href);
    url.searchParams.set("will", id);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="max-w-3xl">
          <h1 className="text-balance text-3xl sm:text-4xl">
            If you go silent, your <span className="text-accent">heirs</span> still get your assets.
          </h1>
          <p className="mt-2 text-muted">
            Lock SPL tokens in a vault controlled by a Solana program. Sign a heartbeat now and then. If you stop for longer than your threshold,
            anyone can trigger the will and each heir claims exactly their share — no custodian, no court order needed to move the tokens.
          </p>
        </div>
        <ProtocolGate />
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <WillList selected={selected} onSelect={select} />
            <CreateWill onCreated={select} />
            <DemoTokens />
          </div>
          <div className="space-y-6">
            {selected ? (
              <WillView willId={selected} />
            ) : (
              <section className="card-base text-muted">
                <p className="mb-2 font-semibold text-white">Live demo in 60 seconds</p>
                <ol className="list-decimal space-y-1 pl-5 text-sm">
                  <li>Act as <b>Testator</b> → Airdrop → Mint demo tokens.</li>
                  <li>Create a will → Use demo heirs (60/40) → 30 days (= 30 s on the demo clock).</li>
                  <li>Deposit both tokens into the vault.</li>
                  <li>Wait for the bar to fill. Switch to <b>Keeper</b> → Airdrop → Execute.</li>
                  <li>Switch to <b>Heir B</b>, then <b>Heir A</b> → Airdrop → Claim. Each gets exactly 40% / 60%.</li>
                </ol>
              </section>
            )}
            <ActivityLog />
          </div>
        </div>
        <footer className="border-t border-border pt-6 text-xs text-muted">
          Hackathon prototype, unaudited. Use test tokens only. A program moving tokens is not a legally valid will; this is not legal or financial advice.
        </footer>
      </main>
    </div>
  );
}
