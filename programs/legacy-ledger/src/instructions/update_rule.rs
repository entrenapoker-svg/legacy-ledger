use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;
use crate::validate::*;

#[derive(Accounts)]
#[instruction(will_id: String, rule_index: u8, new_rule: WillRule)]
pub struct UpdateRule<'info> {
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

pub fn handle_update_rule(
    ctx: Context<UpdateRule>,
    _will_id: String,
    rule_index: u8,
    new_rule: WillRule,
) -> Result<()> {
    let will = &mut ctx.accounts.will;
    let index = usize::from(rule_index);
    let clock = Clock::get()?;

    require!(index < will.rules.len(), LegacyLedgerError::InvalidRuleIndex);

    let mut candidate = will.rules.clone();
    candidate[index] = new_rule.clone();
    validate_rules(&candidate, clock.unix_timestamp)?;

    let old_type = format!("{:?}", will.rules[index].rule_type);
    let new_type = format!("{:?}", new_rule.rule_type);
    will.rules[index] = new_rule;
    // Any action signed by the testator proves they are alive.
    will.last_heartbeat = clock.unix_timestamp;

    emit!(RuleUpdated {
        will: will.key(),
        rule_index,
        old_rule_type: old_type,
        new_rule_type: new_type,
        timestamp: clock.unix_timestamp,
    });

    msg!("Rule {} updated on will {}", rule_index, will.will_id);
    Ok(())
}
