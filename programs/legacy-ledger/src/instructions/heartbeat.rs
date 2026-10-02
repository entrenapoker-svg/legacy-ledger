use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(will_id: String)]
pub struct Heartbeat<'info> {
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

    pub testator: Signer<'info>,
}

pub fn handle_heartbeat(ctx: Context<Heartbeat>, _will_id: String) -> Result<()> {
    let will = &mut ctx.accounts.will;
    let clock = Clock::get()?;

    will.last_heartbeat = clock.unix_timestamp;

    emit!(HeartbeatRecorded {
        will: will.key(),
        testator: ctx.accounts.testator.key(),
        timestamp: will.last_heartbeat,
    });

    msg!(
        "Heartbeat recorded for will {} at {}",
        will.will_id,
        will.last_heartbeat
    );
    Ok(())
}
