use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct PauseProtocol<'info> {
    #[account(
        mut,
        seeds = [PROTOCOL_SEED],
        bump,
        has_one = admin @ LegacyLedgerError::UnauthorizedAdmin
    )]
    pub protocol: Account<'info, Protocol>,

    pub admin: Signer<'info>,
}

pub fn handle_pause_protocol(ctx: Context<PauseProtocol>) -> Result<()> {
    let protocol = &mut ctx.accounts.protocol;
    require!(!protocol.paused, LegacyLedgerError::ProtocolPaused);

    protocol.paused = true;

    emit!(ProtocolPauseChanged {
        protocol: protocol.key(),
        admin: ctx.accounts.admin.key(),
        paused: true,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("Protocol paused by {}", ctx.accounts.admin.key());
    Ok(())
}

#[derive(Accounts)]
pub struct UnpauseProtocol<'info> {
    #[account(
        mut,
        seeds = [PROTOCOL_SEED],
        bump,
        has_one = admin @ LegacyLedgerError::UnauthorizedAdmin
    )]
    pub protocol: Account<'info, Protocol>,

    pub admin: Signer<'info>,
}

pub fn handle_unpause_protocol(ctx: Context<UnpauseProtocol>) -> Result<()> {
    let protocol = &mut ctx.accounts.protocol;
    require!(protocol.paused, LegacyLedgerError::ProtocolNotPaused);

    protocol.paused = false;

    emit!(ProtocolPauseChanged {
        protocol: protocol.key(),
        admin: ctx.accounts.admin.key(),
        paused: false,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("Protocol unpaused by {}", ctx.accounts.admin.key());
    Ok(())
}
