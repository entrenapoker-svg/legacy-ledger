use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::state::*;
use crate::validate::*;

/// Marks a will as executed once at least one enabled rule is satisfied.
/// Anybody may call this: the whole point is that a keeper, not the
/// testator, has to be able to fire the dead man's switch.
#[derive(Accounts)]
#[instruction(will_id: String)]
pub struct ExecuteWill<'info> {
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
        constraint = !will.is_executed @ LegacyLedgerError::WillAlreadyExecuted
    )]
    pub will: Account<'info, Will>,

    pub keeper: Signer<'info>,
}

pub fn handle_execute_will(ctx: Context<ExecuteWill>, _will_id: String) -> Result<()> {
    let will = &mut ctx.accounts.will;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    let deadline = inactivity_deadline(will.last_heartbeat, will.inactivity_threshold_days)?;
    let now_past_deadline = now >= deadline;

    let mut satisfied: Vec<u8> = Vec::new();
    let mut saw_inactivity_rule = false;
    let mut saw_supported_rule = false;
    let mut skipped_unsupported = 0u8;

    for (index, rule) in will.rules.iter().enumerate() {
        if !rule.enabled {
            continue;
        }
        // Reserved rule types (price feeds, rebalance) are not evaluated by this
        // build. They must NOT abort execution: a will that also carries a
        // working DateTrigger would become permanently unexecutable and its
        // funds would be locked forever.
        if !is_supported_rule(rule) {
            skipped_unsupported = skipped_unsupported.saturating_add(1);
            continue;
        }
        saw_supported_rule = true;

        let met = match rule.rule_type {
            RuleType::Inactivity => {
                saw_inactivity_rule = true;
                now_past_deadline
            }
            RuleType::DateTrigger { timestamp } => now >= timestamp,
            _ => false,
        };

        if met {
            satisfied.push(u8::try_from(index).unwrap_or(u8::MAX));
        }
    }

    if skipped_unsupported > 0 {
        msg!(
            "Skipped {} reserved rule(s) this build cannot evaluate",
            skipped_unsupported
        );
    }

    if satisfied.is_empty() {
        // Distinguish "you have not been silent long enough" from
        // "no rule fired yet", because the keeper needs to know whether to retry.
        if !saw_supported_rule && skipped_unsupported > 0 {
            // Every enabled rule is reserved: no keeper can ever fire this will.
            return err!(LegacyLedgerError::UnsupportedRuleType);
        }
        return if saw_inactivity_rule && !now_past_deadline {
            err!(LegacyLedgerError::InactivityPeriodNotMet)
        } else {
            err!(LegacyLedgerError::RuleConditionNotMet)
        };
    }

    will.is_executed = true;
    will.executed_at = now;

    emit!(WillExecuted {
        will: will.key(),
        keeper: ctx.accounts.keeper.key(),
        satisfied_rule_indexes: satisfied,
        inactivity_deadline: deadline,
        timestamp: now,
    });

    msg!(
        "Will {} executed by keeper {} after {} seconds of silence",
        will.will_id,
        ctx.accounts.keeper.key(),
        now - will.last_heartbeat
    );
    Ok(())
}
