use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;

/// Adds an SPL mint to the will's vault: one VaultAsset record plus the
/// vault-owned token account that will hold the balance.
#[derive(Accounts)]
#[instruction(will_id: String)]
pub struct RegisterAsset<'info> {
    #[account(
        seeds = [PROTOCOL_SEED],
        bump,
        constraint = !protocol.paused @ LegacyLedgerError::ProtocolPaused
    )]
    pub protocol: Account<'info, Protocol>,

    #[account(
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
        init,
        payer = testator,
        space = 8 + VaultAsset::INIT_SPACE,
        seeds = [VAULT_ASSET_SEED, vault.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub vault_asset: Account<'info, VaultAsset>,

    #[account(
        init,
        payer = testator,
        seeds = [VAULT_TOKENS_SEED, vault.key().as_ref(), mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = vault
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub testator: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handle_register_asset(ctx: Context<RegisterAsset>, _will_id: String) -> Result<()> {
    let vault_asset = &mut ctx.accounts.vault_asset;
    let clock = Clock::get()?;

    vault_asset.vault = ctx.accounts.vault.key();
    vault_asset.mint = ctx.accounts.mint.key();
    vault_asset.token_account = ctx.accounts.vault_token_account.key();
    vault_asset.amount = 0;
    vault_asset.bump = ctx.bumps.vault_asset;

    emit!(VaultAssetRegistered {
        will: ctx.accounts.will.key(),
        vault: ctx.accounts.vault.key(),
        mint: ctx.accounts.mint.key(),
        token_account: ctx.accounts.vault_token_account.key(),
        timestamp: clock.unix_timestamp,
    });

    msg!(
        "Vault asset registered: mint {}",
        ctx.accounts.mint.key()
    );
    Ok(())
}
