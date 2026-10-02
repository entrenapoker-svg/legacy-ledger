use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;

/// Moves tokens from the testator's wallet into the vault token account and
/// records the new balance on the VaultAsset. This is the only path by which
/// assets enter a will.
#[derive(Accounts)]
#[instruction(will_id: String)]
pub struct DepositAsset<'info> {
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
        constraint = from.mint == mint.key() @ LegacyLedgerError::InvalidTokenMint,
        constraint = from.owner == testator.key() @ LegacyLedgerError::UnauthorizedTestator,
    )]
    pub from: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub testator: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handle_deposit_asset(
    ctx: Context<DepositAsset>,
    _will_id: String,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, LegacyLedgerError::ZeroAmount);

    let vault_asset = &mut ctx.accounts.vault_asset;

    let new_amount = vault_asset
        .amount
        .checked_add(amount)
        .ok_or(LegacyLedgerError::MathOverflow)?;

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.key(),
            Transfer {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.testator.to_account_info(),
            },
        ),
        amount,
    )?;

    vault_asset.amount = new_amount;

    // Any action signed by the testator proves they are alive.
    let now = Clock::get()?.unix_timestamp;
    ctx.accounts.will.last_heartbeat = now;

    emit!(VaultAssetDeposited {
        will: ctx.accounts.will.key(),
        mint: vault_asset.mint,
        amount,
        vault_total: new_amount,
        timestamp: now,
    });

    msg!("Deposited {} into vault for mint {}", amount, vault_asset.mint);
    Ok(())
}
