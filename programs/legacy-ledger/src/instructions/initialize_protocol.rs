use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Protocol::INIT_SPACE,
        seeds = [PROTOCOL_SEED],
        bump
    )]
    pub protocol: Account<'info, Protocol>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_initialize_protocol(
    ctx: Context<InitializeProtocol>,
    protocol_fee_bps: u16,
    min_inactivity_days: u16,
    max_rules_per_will: u8,
) -> Result<()> {
    require!(
        protocol_fee_bps <= MAX_PROTOCOL_FEE_BPS,
        LegacyLedgerError::InvalidProtocolFee
    );
    require!(
        (MIN_INACTIVITY_DAYS..=MAX_INACTIVITY_DAYS).contains(&min_inactivity_days),
        LegacyLedgerError::InvalidInactivityThreshold
    );
    require!(
        max_rules_per_will as usize > 0 && max_rules_per_will as usize <= MAX_RULES_PER_WILL,
        LegacyLedgerError::TooManyRules
    );

    let protocol = &mut ctx.accounts.protocol;
    let clock = Clock::get()?;

    protocol.admin = ctx.accounts.admin.key();
    protocol.protocol_fee_bps = protocol_fee_bps;
    protocol.min_inactivity_days = min_inactivity_days;
    protocol.max_rules_per_will = max_rules_per_will;
    protocol.paused = false;
    protocol.total_wills = 0;
    protocol.bump = ctx.bumps.protocol;

    emit!(ProtocolInitialized {
        protocol: protocol.key(),
        admin: ctx.accounts.admin.key(),
        protocol_fee_bps,
        min_inactivity_days,
        max_rules_per_will,
        timestamp: clock.unix_timestamp,
    });

    msg!("Protocol initialized by admin {}", ctx.accounts.admin.key());
    Ok(())
}
