use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;

/// Lets a living testator take tokens back out of the vault. Without this a
/// deposit would be irreversible for as long as the testator lives, which no
/// one would accept for real savings. Only possible before execution.
#[derive(Accounts)]
#[instruction(will_id: String)]
pub struct WithdrawAsset<'info> {
    #[account(
        seeds = [PROTOCOL_SEED],
        bump,
        constraint = !protocol.paused @ LegacyLedgerError::ProtocolPaused
    )]
    pub protocol: Account<'info, Protocol>,

    #[account(
        mut,
        seeds = [WILL_SEED, will_id.as_bytes()],
        bump,
        constraint = !will.is_executed @ LegacyLedgerError::WillAlreadyExecuted,
        has_one = testator @ LegacyLedgerError::UnauthorizedTestator
    )]
    pub will: Account<'info, Will>,

    #[account(
        seeds = [VAULT_SEED, will.key().as_ref()],
        bump,
        constraint = vault.will == will.key() @ LegacyLedgerError::VaultAssetMismatch
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [VAULT_ASSET_SEED, vault.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = vault_asset.vault == vault.key() @ LegacyLedgerError::VaultAssetMismatch,
        constraint = vault_asset.mint == mint.key() @ LegacyLedgerError::InvalidTokenMint,
    )]
    pub vault_asset: Account<'info, VaultAsset>,

    #[account(
        mut,
        constraint = vault_token_account.owner == vault.key() @ LegacyLedgerError::InvalidVaultTokenAccount,
        constraint = vault_token_account.mint == mint.key() @ LegacyLedgerError::InvalidTokenMint,
        constraint = vault_asset.token_account == vault_token_account.key() @ LegacyLedgerError::VaultAssetMismatch,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = to.mint == mint.key() @ LegacyLedgerError::InvalidTokenMint,
        constraint = to.owner == testator.key() @ LegacyLedgerError::UnauthorizedTestator,
    )]
    pub to: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    pub testator: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handle_withdraw_asset(ctx: Context<WithdrawAsset>, _will_id: String, amount: u64) -> Result<()> {
    require!(amount > 0, LegacyLedgerError::ZeroAmount);

    let new_amount = ctx
        .accounts
        .vault_asset
        .amount
        .checked_sub(amount)
        .ok_or(LegacyLedgerError::InsufficientVaultBalance)?;

    let will_key = ctx.accounts.will.key();
    let vault_seeds: &[&[u8]] = &[VAULT_SEED, will_key.as_ref(), &[ctx.accounts.vault.bump]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.key(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            &[vault_seeds],
        ),
        amount,
    )?;

    ctx.accounts.vault_asset.amount = new_amount;

    // Any action signed by the testator proves they are alive.
    let now = Clock::get()?.unix_timestamp;
    ctx.accounts.will.last_heartbeat = now;

    emit!(VaultAssetWithdrawn {
        will: will_key,
        mint: ctx.accounts.mint.key(),
        amount,
        vault_total: new_amount,
        timestamp: now,
    });

    msg!("Withdrew {} from vault for mint {}", amount, ctx.accounts.mint.key());
    Ok(())
}
