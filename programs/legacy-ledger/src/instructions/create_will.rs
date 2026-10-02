use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;
use crate::validate::*;

#[derive(Accounts)]
#[instruction(will_id: String)]
pub struct CreateWill<'info> {
    #[account(
        mut,
        seeds = [PROTOCOL_SEED],
        bump,
        constraint = !protocol.paused @ LegacyLedgerError::ProtocolPaused
    )]
    pub protocol: Account<'info, Protocol>,

    #[account(
        init,
        payer = testator,
        space = 8 + Will::INIT_SPACE,
        seeds = [WILL_SEED, will_id.as_bytes()],
        bump
    )]
    pub will: Account<'info, Will>,

    #[account(
        init,
        payer = testator,
        space = 8 + Vault::INIT_SPACE,
        seeds = [VAULT_SEED, will.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub testator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_create_will(
    ctx: Context<CreateWill>,
    will_id: String,
    inactivity_threshold_days: u16,
    rules: Vec<WillRule>,
    heirs: Vec<Heir>,
    metadata_uri: String,
) -> Result<()> {
    if will_id.is_empty() || will_id.len() > MAX_WILL_ID_LEN {
        return err!(LegacyLedgerError::InvalidWillIdLength);
    }
    if metadata_uri.len() > MAX_METADATA_URI_LEN {
        return err!(LegacyLedgerError::InvalidMetadataUriLength);
    }
    let clock = Clock::get()?;

    validate_inactivity_days(inactivity_threshold_days)?;
    require!(
        inactivity_threshold_days >= ctx.accounts.protocol.min_inactivity_days,
        LegacyLedgerError::InvalidInactivityThreshold
    );
    validate_rules(&rules, clock.unix_timestamp)?;
    validate_heirs(&heirs)?;

    require!(
        rules.len() <= usize::from(ctx.accounts.protocol.max_rules_per_will),
        LegacyLedgerError::TooManyRules
    );

    let protocol = &mut ctx.accounts.protocol;
    let will = &mut ctx.accounts.will;
    let vault = &mut ctx.accounts.vault;

    will.testator = ctx.accounts.testator.key();
    will.vault = vault.key();
    will.will_id = will_id.clone();
    will.metadata_uri = metadata_uri;
    will.rules = rules;
    will.heirs = heirs;
    will.inactivity_threshold_days = inactivity_threshold_days;
    will.last_heartbeat = clock.unix_timestamp;
    will.created_at = clock.unix_timestamp;
    will.executed_at = 0;
    will.is_executed = false;
    will.bump = ctx.bumps.will;

    vault.will = will.key();
    vault.bump = ctx.bumps.vault;

    protocol.total_wills = protocol
        .total_wills
        .checked_add(1)
        .ok_or(LegacyLedgerError::MathOverflow)?;

    emit!(WillCreated {
        will: will.key(),
        vault: vault.key(),
        testator: ctx.accounts.testator.key(),
        will_id,
        inactivity_threshold_days,
        heir_count: u8::try_from(will.heirs.len()).unwrap_or(u8::MAX),
        timestamp: clock.unix_timestamp,
    });

    msg!("Will created: {} by {}", will.will_id, will.testator);
    Ok(())
}
