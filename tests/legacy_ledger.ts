import * as anchor from "@anchor-lang/core";
import { BN, Program } from "@anchor-lang/core";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createAccount,
  createMint,
  getAccount,
  mintTo,
} from "@solana/spl-token";
import { expect } from "chai";
import { LegacyLedger } from "../target/types/legacy_ledger";

// These tests run against a local validator with the program built using the
// `demo` feature, where one inactivity "day" lasts one second. That is what
// lets the dead man's switch fire inside a test run.
const INACTIVITY_DAYS = 30;

const enc = (s: string) => Buffer.from(s);

async function expectError(p: Promise<unknown>, code: string) {
  try {
    await p;
  } catch (e) {
    expect(String(e) + JSON.stringify((e as any)?.logs ?? [])).to.include(code);
    return;
  }
  expect.fail(`expected ${code}, transaction succeeded`);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("legacy_ledger", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.legacyLedger as Program<LegacyLedger>;
  const conn = provider.connection;
  const payer = (provider.wallet as anchor.Wallet).payer;

  const testator = Keypair.generate();
  const heirA = Keypair.generate(); // 60%
  const heirB = Keypair.generate(); // 40%
  const keeper = Keypair.generate();
  const stranger = Keypair.generate();

  const willId = `test-${Date.now().toString(36)}`;
  const [protocolPda] = PublicKey.findProgramAddressSync([enc("protocol")], program.programId);
  const [willPda] = PublicKey.findProgramAddressSync([enc("will"), enc(willId)], program.programId);
  const [vaultPda] = PublicKey.findProgramAddressSync([enc("vault"), willPda.toBuffer()], program.programId);

  let mintA: PublicKey; // e.g. a tokenized CEDEAR
  let mintB: PublicKey; // e.g. a stablecoin
  let testatorA: PublicKey;
  let testatorB: PublicKey;
  const heirAccounts: Record<string, { a: PublicKey; b: PublicKey }> = {};

  const vaultAsset = (mint: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("vasset"), vaultPda.toBuffer(), mint.toBuffer()], program.programId)[0];
  const vaultTokens = (mint: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("vtokens"), vaultPda.toBuffer(), mint.toBuffer()], program.programId)[0];
  const balance = async (ata: PublicKey) => Number((await getAccount(conn, ata)).amount);

  const claimRemaining = (heirKey: string) =>
    [mintA, mintB].flatMap((m, i) => [
      { pubkey: vaultAsset(m), isSigner: false, isWritable: true },
      { pubkey: vaultTokens(m), isSigner: false, isWritable: true },
      { pubkey: i === 0 ? heirAccounts[heirKey].a : heirAccounts[heirKey].b, isSigner: false, isWritable: true },
    ]);

  before(async () => {
    for (const kp of [testator, heirA, heirB, keeper, stranger]) {
      const sig = await conn.requestAirdrop(kp.publicKey, 2 * LAMPORTS_PER_SOL);
      await conn.confirmTransaction(sig, "confirmed");
    }
    mintA = await createMint(conn, payer, payer.publicKey, null, 6);
    mintB = await createMint(conn, payer, payer.publicKey, null, 6);
    testatorA = await createAccount(conn, payer, mintA, testator.publicKey);
    testatorB = await createAccount(conn, payer, mintB, testator.publicKey);
    await mintTo(conn, payer, mintA, testatorA, payer, 1_000_000);
    await mintTo(conn, payer, mintB, testatorB, payer, 500_000);
    for (const [k, kp] of [["A", heirA], ["B", heirB]] as const) {
      heirAccounts[k] = {
        a: await createAccount(conn, payer, mintA, kp.publicKey),
        b: await createAccount(conn, payer, mintB, kp.publicKey),
      };
    }
  });

  it("initializes the protocol (idempotent across runs)", async () => {
    const existing = await conn.getAccountInfo(protocolPda);
    if (!existing) {
      await program.methods
        .initializeProtocol(0, INACTIVITY_DAYS, 8)
        .accountsPartial({ protocol: protocolPda, admin: payer.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
    }
    const p = await program.account.protocol.fetch(protocolPda);
    expect(p.paused).to.eq(false);
  });

  it("rejects heirs that do not add up to 100%", async () => {
    await expectError(
      program.methods
        .createWill(
          `${willId}-bad`,
          INACTIVITY_DAYS,
          [{ ruleType: { inactivity: {} }, action: { distributeToHeirs: {} }, priority: 0, enabled: true }],
          [
            { name: "Ana", wallet: heirA.publicKey, allocationBps: 6000, claimed: false, claimedAt: new BN(0) },
            { name: "Bruno", wallet: heirB.publicKey, allocationBps: 3000, claimed: false, claimedAt: new BN(0) },
          ],
          ""
        )
        .accountsPartial({ testator: testator.publicKey })
        .signers([testator])
        .rpc(),
      "AllocationMismatch"
    );
  });

  it("creates a will with two heirs (60/40) and an inactivity rule", async () => {
    await program.methods
      .createWill(
        willId,
        INACTIVITY_DAYS,
        [{ ruleType: { inactivity: {} }, action: { distributeToHeirs: {} }, priority: 0, enabled: true }],
        [
          { name: "Ana", wallet: heirA.publicKey, allocationBps: 6000, claimed: false, claimedAt: new BN(0) },
          { name: "Bruno", wallet: heirB.publicKey, allocationBps: 4000, claimed: false, claimedAt: new BN(0) },
        ],
        "ipfs://demo"
      )
      .accountsPartial({ protocol: protocolPda, will: willPda, vault: vaultPda, testator: testator.publicKey })
      .signers([testator])
      .rpc();

    const will = await program.account.will.fetch(willPda);
    expect(will.testator.toBase58()).to.eq(testator.publicKey.toBase58());
    expect(will.heirs.map((h) => h.allocationBps)).to.deep.eq([6000, 4000]);
    expect(will.isExecuted).to.eq(false);
  });

  it("registers two assets and deposits them into the vault", async () => {
    for (const [mint, from, amount] of [
      [mintA, testatorA, 1_000_000],
      [mintB, testatorB, 500_000],
    ] as const) {
      await program.methods
        .registerAsset(willId)
        .accountsPartial({
          will: willPda,
          vault: vaultPda,
          vaultAsset: vaultAsset(mint),
          vaultTokenAccount: vaultTokens(mint),
          mint,
          testator: testator.publicKey,
        })
        .signers([testator])
        .rpc();
      await program.methods
        .depositAsset(willId, new BN(amount))
        .accountsPartial({
          will: willPda,
          vault: vaultPda,
          vaultAsset: vaultAsset(mint),
          vaultTokenAccount: vaultTokens(mint),
          from,
          mint,
          testator: testator.publicKey,
        })
        .signers([testator])
        .rpc();
    }
    expect(await balance(vaultTokens(mintA))).to.eq(1_000_000);
    expect(await balance(vaultTokens(mintB))).to.eq(500_000);
    expect((await program.account.vaultAsset.fetch(vaultAsset(mintA))).amount.toNumber()).to.eq(1_000_000);
  });

  it("lets the living testator withdraw part of a deposit", async () => {
    await program.methods
      .withdrawAsset(willId, new BN(100_000))
      .accountsPartial({
        will: willPda,
        vault: vaultPda,
        vaultAsset: vaultAsset(mintB),
        vaultTokenAccount: vaultTokens(mintB),
        to: testatorB,
        mint: mintB,
        testator: testator.publicKey,
      })
      .signers([testator])
      .rpc();
    expect(await balance(vaultTokens(mintB))).to.eq(400_000);
    expect(await balance(testatorB)).to.eq(100_000);
  });

  it("refuses withdrawals by anyone other than the testator", async () => {
    const strangerB = await createAccount(conn, payer, mintB, stranger.publicKey);
    await expectError(
      program.methods
        .withdrawAsset(willId, new BN(1))
        .accountsPartial({
          will: willPda,
          vault: vaultPda,
          vaultAsset: vaultAsset(mintB),
          vaultTokenAccount: vaultTokens(mintB),
          to: strangerB,
          mint: mintB,
          testator: stranger.publicKey,
        })
        .signers([stranger])
        .rpc(),
      "UnauthorizedTestator"
    );
  });

  it("will not execute while the testator is still active", async () => {
    await expectError(
      program.methods
        .executeWill(willId)
        .accountsPartial({ will: willPda, keeper: keeper.publicKey })
        .signers([keeper])
        .rpc(),
      "InactivityPeriodNotMet"
    );
  });

  it("only the testator can send a heartbeat", async () => {
    await expectError(
      program.methods
        .heartbeat(willId)
        .accountsPartial({ will: willPda, testator: stranger.publicKey })
        .signers([stranger])
        .rpc(),
      "UnauthorizedTestator"
    );
    await program.methods
      .heartbeat(willId)
      .accountsPartial({ will: willPda, testator: testator.publicKey })
      .signers([testator])
      .rpc();
  });

  it("heirs cannot claim before execution", async () => {
    await expectError(
      program.methods
        .claimInheritance(willId, 0)
        .accountsPartial({ will: willPda, vault: vaultPda, heir: heirA.publicKey })
        .remainingAccounts(claimRemaining("A"))
        .signers([heirA])
        .rpc(),
      "WillNotExecuted"
    );
  });

  it("after the silence period any keeper can fire the switch", async function () {
    this.timeout(120_000);
    // demo build: 30 "days" == 30 seconds since the last heartbeat.
    await sleep((INACTIVITY_DAYS + 3) * 1000);
    await program.methods
      .executeWill(willId)
      .accountsPartial({ will: willPda, keeper: keeper.publicKey })
      .signers([keeper])
      .rpc();
    const will = await program.account.will.fetch(willPda);
    expect(will.isExecuted).to.eq(true);
  });

  it("blocks deposits and heartbeats after execution", async () => {
    await expectError(
      program.methods
        .heartbeat(willId)
        .accountsPartial({ will: willPda, testator: testator.publicKey })
        .signers([testator])
        .rpc(),
      "WillAlreadyExecuted"
    );
  });

  it("a stranger cannot claim an heir's share", async () => {
    await expectError(
      program.methods
        .claimInheritance(willId, 0)
        .accountsPartial({ will: willPda, vault: vaultPda, heir: stranger.publicKey })
        .remainingAccounts(claimRemaining("A"))
        .signers([stranger])
        .rpc(),
      "UnauthorizedHeir"
    );
  });

  it("the 40% heir claims first and gets exactly 40% of every asset", async () => {
    await program.methods
      .claimInheritance(willId, 1)
      .accountsPartial({ will: willPda, vault: vaultPda, heir: heirB.publicKey })
      .remainingAccounts(claimRemaining("B"))
      .signers([heirB])
      .rpc();
    expect(await balance(heirAccounts.B.a)).to.eq(400_000);
    expect(await balance(heirAccounts.B.b)).to.eq(160_000);
  });

  it("the 60% heir claims second and still gets exactly 60%; the vault ends empty", async () => {
    await program.methods
      .claimInheritance(willId, 0)
      .accountsPartial({ will: willPda, vault: vaultPda, heir: heirA.publicKey })
      .remainingAccounts(claimRemaining("A"))
      .signers([heirA])
      .rpc();
    expect(await balance(heirAccounts.A.a)).to.eq(600_000);
    expect(await balance(heirAccounts.A.b)).to.eq(240_000);
    expect(await balance(vaultTokens(mintA))).to.eq(0);
    expect(await balance(vaultTokens(mintB))).to.eq(0);
    expect((await program.account.vaultAsset.fetch(vaultAsset(mintA))).amount.toNumber()).to.eq(0);
  });

  it("an heir cannot claim twice", async () => {
    await expectError(
      program.methods
        .claimInheritance(willId, 0)
        .accountsPartial({ will: willPda, vault: vaultPda, heir: heirA.publicKey })
        .remainingAccounts(claimRemaining("A"))
        .signers([heirA])
        .rpc(),
      "HeirAlreadyClaimed"
    );
  });
});

