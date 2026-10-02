import { AnchorProvider, BN, Program } from "@anchor-lang/core";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import idl from "@/idl/legacy_ledger.json";
import type { LegacyLedger } from "@/idl/legacy_ledger";
import { PROGRAM_ID, SECONDS_PER_DAY } from "./config";

export type AnyTx = Transaction | VersionedTransaction;

/** Minimal wallet interface shared by wallet-adapter wallets and demo personas. */
export interface AppWallet {
  publicKey: PublicKey;
  signTransaction<T extends AnyTx>(tx: T): Promise<T>;
  signAllTransactions<T extends AnyTx>(txs: T[]): Promise<T[]>;
}

export function keypairWallet(kp: Keypair): AppWallet {
  const sign = <T extends AnyTx>(tx: T): T => {
    if (tx instanceof VersionedTransaction) tx.sign([kp]);
    else tx.partialSign(kp);
    return tx;
  };
  return {
    publicKey: kp.publicKey,
    signTransaction: async (tx) => sign(tx),
    signAllTransactions: async (txs) => txs.map(sign),
  };
}

export function getProgram(connection: Connection, wallet: AppWallet) {
  const provider = new AnchorProvider(connection, wallet as never, { commitment: "confirmed" });
  return new Program<LegacyLedger>(idl as LegacyLedger, provider);
}

export type LLProgram = ReturnType<typeof getProgram>;

const enc = (s: string) => new TextEncoder().encode(s);

export const pdas = {
  protocol: () => PublicKey.findProgramAddressSync([enc("protocol")], PROGRAM_ID)[0],
  will: (willId: string) => PublicKey.findProgramAddressSync([enc("will"), enc(willId)], PROGRAM_ID)[0],
  vault: (will: PublicKey) => PublicKey.findProgramAddressSync([enc("vault"), will.toBuffer()], PROGRAM_ID)[0],
  vaultAsset: (vault: PublicKey, mint: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("vasset"), vault.toBuffer(), mint.toBuffer()], PROGRAM_ID)[0],
  vaultTokens: (vault: PublicKey, mint: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("vtokens"), vault.toBuffer(), mint.toBuffer()], PROGRAM_ID)[0],
};

export type WillAccount = Awaited<ReturnType<LLProgram["account"]["will"]["fetch"]>>;
export type VaultAssetAccount = Awaited<ReturnType<LLProgram["account"]["vaultAsset"]["fetch"]>>;

export interface HeirInput {
  name: string;
  wallet: string;
  percent: number;
}

export function deadlineOf(will: WillAccount): number {
  return will.lastHeartbeat.toNumber() + will.inactivityThresholdDays * SECONDS_PER_DAY;
}

export async function fetchVaultAssets(program: LLProgram, vault: PublicKey) {
  return program.account.vaultAsset.all([{ memcmp: { offset: 8, bytes: vault.toBase58() } }]);
}

export async function initializeProtocol(program: LLProgram) {
  return program.methods
    .initializeProtocol(0, 30, 8)
    .accountsPartial({
      protocol: pdas.protocol(),
      admin: program.provider.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function createWill(
  program: LLProgram,
  willId: string,
  days: number,
  heirs: HeirInput[],
  dateTrigger: number | null
) {
  const rules: Parameters<LLProgram["methods"]["createWill"]>[2] = [
    { ruleType: { inactivity: {} }, action: { distributeToHeirs: {} }, priority: 0, enabled: true },
  ];
  if (dateTrigger) {
    rules.push({
      ruleType: { dateTrigger: { timestamp: new BN(dateTrigger) } },
      action: { distributeToHeirs: {} },
      priority: 1,
      enabled: true,
    });
  }
  const will = pdas.will(willId);
  return program.methods
    .createWill(
      willId,
      days,
      rules,
      heirs.map((h) => ({
        name: h.name,
        wallet: new PublicKey(h.wallet),
        allocationBps: Math.round(h.percent * 100),
        claimed: false,
        claimedAt: new BN(0),
      })),
      ""
    )
    .accountsPartial({
      protocol: pdas.protocol(),
      will,
      vault: pdas.vault(will),
      testator: program.provider.publicKey!,
    })
    .rpc();
}

/** Registers the mint on first use, then moves `amount` base units into the vault. */
export async function deposit(program: LLProgram, willId: string, mint: PublicKey, amount: BN) {
  const owner = program.provider.publicKey!;
  const will = pdas.will(willId);
  const vault = pdas.vault(will);
  const vaultAsset = pdas.vaultAsset(vault, mint);
  const vaultTokenAccount = pdas.vaultTokens(vault, mint);
  const accounts = { will, vault, vaultAsset, vaultTokenAccount, mint, testator: owner };

  const tx = new Transaction();
  const registered = await program.provider.connection.getAccountInfo(vaultAsset);
  if (!registered) {
    tx.add(await program.methods.registerAsset(willId).accountsPartial(accounts).instruction());
  }
  tx.add(
    await program.methods
      .depositAsset(willId, amount)
      .accountsPartial({ ...accounts, from: getAssociatedTokenAddressSync(mint, owner) })
      .instruction()
  );
  return program.provider.sendAndConfirm!(tx);
}

export async function withdraw(program: LLProgram, willId: string, mint: PublicKey, amount: BN) {
  const owner = program.provider.publicKey!;
  const will = pdas.will(willId);
  const vault = pdas.vault(will);
  const to = getAssociatedTokenAddressSync(mint, owner);
  const tx = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(owner, to, owner, mint),
    await program.methods
      .withdrawAsset(willId, amount)
      .accountsPartial({
        will,
        vault,
        vaultAsset: pdas.vaultAsset(vault, mint),
        vaultTokenAccount: pdas.vaultTokens(vault, mint),
        to,
        mint,
        testator: owner,
      })
      .instruction()
  );
  return program.provider.sendAndConfirm!(tx);
}

export async function heartbeat(program: LLProgram, willId: string) {
  return program.methods
    .heartbeat(willId)
    .accountsPartial({ will: pdas.will(willId), testator: program.provider.publicKey! })
    .rpc();
}

export async function executeWill(program: LLProgram, willId: string) {
  return program.methods
    .executeWill(willId)
    .accountsPartial({ will: pdas.will(willId), keeper: program.provider.publicKey! })
    .rpc();
}

/** Claims the heir's share of every asset in the vault in a single transaction. */
export async function claim(program: LLProgram, willId: string, heirIndex: number) {
  const heir = program.provider.publicKey!;
  const will = pdas.will(willId);
  const vault = pdas.vault(will);
  const assets = (await fetchVaultAssets(program, vault)).filter((a) => !a.account.amount.isZero());
  if (assets.length === 0) throw new Error("The vault holds no assets to claim.");

  const tx = new Transaction();
  const remaining = assets.flatMap(({ publicKey, account }) => {
    const heirAta = getAssociatedTokenAddressSync(account.mint, heir);
    tx.add(createAssociatedTokenAccountIdempotentInstruction(heir, heirAta, heir, account.mint));
    return [
      { pubkey: publicKey, isSigner: false, isWritable: true },
      { pubkey: account.tokenAccount, isSigner: false, isWritable: true },
      { pubkey: heirAta, isSigner: false, isWritable: true },
    ];
  });
  tx.add(
    await program.methods
      .claimInheritance(willId, heirIndex)
      .accountsPartial({ will, vault, heir })
      .remainingAccounts(remaining)
      .instruction()
  );
  return program.provider.sendAndConfirm!(tx);
}

/** Creates a demo SPL mint owned by the signer and mints `amount` whole tokens to them. */
export async function createDemoToken(program: LLProgram, decimals: number, amount: number) {
  const conn = program.provider.connection;
  const owner = program.provider.publicKey!;
  const mint = Keypair.generate();
  const ata = getAssociatedTokenAddressSync(mint.publicKey, owner);
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: owner,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(conn),
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(mint.publicKey, decimals, owner, null),
    createAssociatedTokenAccountIdempotentInstruction(owner, ata, owner, mint.publicKey),
    createMintToInstruction(mint.publicKey, ata, owner, BigInt(amount) * 10n ** BigInt(decimals))
  );
  await program.provider.sendAndConfirm!(tx, [mint]);
  return mint.publicKey;
}

/** Best-effort human readable error from an Anchor / web3 failure. */
export function explainError(e: unknown): string {
  const any = e as { error?: { errorMessage?: string; errorCode?: { code?: string } }; message?: string; logs?: string[] };
  if (any?.error?.errorMessage) return `${any.error.errorCode?.code}: ${any.error.errorMessage}`;
  const logs = any?.logs ?? [];
  const anchorLine = logs.find((l) => l.includes("Error Message:"));
  if (anchorLine) return anchorLine.split("Error Message:")[1].trim();
  const msg = any?.message ?? String(e);
  if (msg.includes("debit an account but found no record of a prior credit"))
    return "This wallet has no SOL on this cluster. Use the airdrop button first.";
  return msg.length > 300 ? msg.slice(0, 300) + "…" : msg;
}
