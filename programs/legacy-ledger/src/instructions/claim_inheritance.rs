use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;
use crate::validate::*;

/// Pays one heir their allocation across every asset in the vault.
///
/// The client passes the vault's mints as `remaining_accounts`, three at a
/// time: VaultAsset, vault token account, heir token account. Each group is
/// verified structurally against the vault PDA, so a client cannot point the
/// transfer at an account it does not own.
#[derive(Accounts)]
#[instruction(will_id: String, heir_index: u8)]
pub struct ClaimInheritance<'info> {
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
        constraint = will.is_executed @ LegacyLedgerError::WillNotExecuted
    )]
    pub will: Account<'info, Will>,

    #[account(
        seeds = [VAULT_SEED, will.key().as_ref()],
        bump,
        constraint = vault.will == will.key() @ LegacyLedgerError::VaultAssetMismatch
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        constraint = usize::from(heir_index) < will.heirs.len() @ LegacyLedgerError::HeirNotFound,
        constraint = heir.key() == will.heirs[usize::from(heir_index)].wallet @ LegacyLedgerError::UnauthorizedHeir,
        constraint = !will.heirs[usize::from(heir_index)].claimed @ LegacyLedgerError::HeirAlreadyClaimed,
    )]
    pub heir: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handle_claim_inheritance<'info>(
    ctx: Context<'info, ClaimInheritance<'info>>,
    _will_id: String,
    heir_index: u8,
) -> Result<()> {
    let clock = Clock::get()?;
    let will_key = ctx.accounts.will.key();
    let will = &mut ctx.accounts.will;
    let vault = &ctx.accounts.vault;

    let allocation_bps = will.heirs[usize::from(heir_index)].allocation_bps;
    // Shares are taken against the bps still unclaimed, not against 10_000,
    // because earlier claims already shrank every vault balance.
    let remaining_bps = unclaimed_bps(&will.heirs);
    let heir_name = will.heirs[usize::from(heir_index)].name.clone();
    let vault_key = vault.key();
    let vault_bump = [vault.bump];
    let vault_seeds: &[&[u8]] = &[VAULT_SEED, will_key.as_ref(), &vault_bump];

    let remaining = ctx.remaining_accounts;
    if remaining.is_empty() || remaining.len() % 3 != 0 {
        return err!(LegacyLedgerError::InvalidRemainingAccounts);
    }

    let mut total_transferred: u64 = 0;
    let mut groups = 0u8;

    for chunk in remaining.chunks_exact(3) {
        // Every account in the triplet is mutated: the VaultAsset balance is
        // decremented and both token accounts are written by the transfer CPI.
        // A client that omits `isWritable` would otherwise fail deep inside the
        // CPI with an opaque error, so reject it up front.
        for account_info in chunk {
            require!(
                account_info.is_writable,
                LegacyLedgerError::RemainingAccountNotWritable
            );
        }

        let mut vault_asset: Account<VaultAsset> = Account::try_from(&chunk[0])?;
        let vault_tokens: Account<TokenAccount> = Account::try_from(&chunk[1])?;
        let heir_tokens: Account<TokenAccount> = Account::try_from(&chunk[2])?;

        require!(
            vault_asset.vault == vault_key,
            LegacyLedgerError::VaultAssetMismatch
        );
        require!(
            vault_asset.token_account == vault_tokens.key(),
            LegacyLedgerError::VaultAssetMismatch
        );
        require!(
            vault_tokens.owner == vault_key,
            LegacyLedgerError::InvalidVaultTokenAccount
        );
        require!(
            vault_tokens.mint == vault_asset.mint,
            LegacyLedgerError::InvalidTokenMint
        );
        require!(
            vault_tokens.mint == heir_tokens.mint,
            LegacyLedgerError::InvalidTokenMint
        );
        // Without this the heir could name any account holding the same mint as
        // the destination and burn their own inheritance into someone else's
        // wallet.
        require!(
            heir_tokens.owner == ctx.accounts.heir.key(),
            LegacyLedgerError::UnauthorizedHeir
        );

        let share = share_of_remaining(vault_asset.amount, allocation_bps, remaining_bps)?;
        if share == 0 {
            continue;
        }

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.key(),
                Transfer {
                    from: vault_tokens.to_account_info(),
                    to: heir_tokens.to_account_info(),
                    authority: vault.to_account_info(),
                },
                &[vault_seeds],
            ),
            share,
        )?;

        vault_asset.amount = vault_asset
            .amount
            .checked_sub(share)
            .ok_or(LegacyLedgerError::MathOverflow)?;
        // Accounts loaded by hand from remaining_accounts are not persisted by
        // Anchor's exit routine; without this the balance change is lost.
        vault_asset.exit(&crate::ID)?;

        total_transferred = total_transferred
            .checked_add(share)
            .ok_or(LegacyLedgerError::MathOverflow)?;
        groups = groups.saturating_add(1);
    }

    if total_transferred == 0 {
        return err!(LegacyLedgerError::VaultEmpty);
    }

    will.heirs[usize::from(heir_index)].claimed = true;
    will.heirs[usize::from(heir_index)].claimed_at = clock.unix_timestamp;

    emit!(InheritanceClaimed {
        will: will_key,
        vault: vault_key,
        heir: ctx.accounts.heir.key(),
        heir_index,
        heir_name,
        allocation_bps,
        assets_claimed: groups,
        total_base_units: total_transferred,
        timestamp: clock.unix_timestamp,
    });

    msg!(
        "Heir {} claimed {} base units across {} assets",
        heir_index,
        total_transferred,
        groups
    );
    Ok(())
}
