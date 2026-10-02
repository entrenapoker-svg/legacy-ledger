use crate::constants::*;
use crate::errors::LegacyLedgerError;
use crate::state::{AllocationTarget, Heir, RuleType, WillRule};

/// Heirs must be non-empty, within bounds, each with a non-zero allocation,
/// and the allocations must total exactly 10000 bps.
/// Summation uses u32 so a caller cannot overflow the accumulator with
/// attacker-chosen `allocation_bps` values.
pub fn validate_heirs(heirs: &[Heir]) -> Result<(), LegacyLedgerError> {
    if heirs.is_empty() {
        return Err(LegacyLedgerError::NoHeirs);
    }
    if heirs.len() > MAX_HEIRS_PER_WILL {
        return Err(LegacyLedgerError::TooManyHeirs);
    }

    let mut total_bps: u32 = 0;
    for heir in heirs {
        if heir.name.is_empty() || heir.name.len() > MAX_HEIR_NAME_LEN {
            return Err(LegacyLedgerError::InvalidHeirConfig);
        }
        if heir.allocation_bps == 0 {
            return Err(LegacyLedgerError::InvalidHeirConfig);
        }
        total_bps += u32::from(heir.allocation_bps);
    }

    if total_bps != BPS_TOTAL {
        return Err(LegacyLedgerError::AllocationMismatch);
    }
    Ok(())
}

pub fn validate_rules(rules: &[WillRule], now: i64) -> Result<(), LegacyLedgerError> {
    if rules.is_empty() {
        return Err(LegacyLedgerError::NoRules);
    }
    if rules.len() > MAX_RULES_PER_WILL {
        return Err(LegacyLedgerError::TooManyRules);
    }

    let mut seen_priorities = [false; 256];
    for rule in rules {
        let idx = usize::from(rule.priority);
        if seen_priorities[idx] {
            return Err(LegacyLedgerError::DuplicatePriority);
        }
        seen_priorities[idx] = true;

        match &rule.rule_type {
            // `execute_will` is permissionless. A DateTrigger already in the
            // past would let any keeper fire the will the instant it is
            // created, so a typo like `timestamp: 1` silently hands the estate
            // to the heirs and takes control away from the testator.
            RuleType::DateTrigger { timestamp } if *timestamp <= now => {
                return Err(LegacyLedgerError::InvalidDateTrigger);
            }
            RuleType::Rebalance { target_allocation } => {
                validate_allocation_targets(target_allocation)?;
            }
            _ => {}
        }
    }
    Ok(())
}

fn validate_allocation_targets(targets: &[AllocationTarget]) -> Result<(), LegacyLedgerError> {
    if targets.is_empty() || targets.len() > MAX_ALLOC_TARGETS {
        return Err(LegacyLedgerError::InvalidRuleIndex);
    }
    let mut total_bps: u32 = 0;
    for target in targets {
        total_bps += u32::from(target.percentage_bps);
    }
    if total_bps != BPS_TOTAL {
        return Err(LegacyLedgerError::AllocationMismatch);
    }
    Ok(())
}

pub fn validate_inactivity_days(days: u16) -> Result<(), LegacyLedgerError> {
    if !(MIN_INACTIVITY_DAYS..=MAX_INACTIVITY_DAYS).contains(&days) {
        return Err(LegacyLedgerError::InvalidInactivityThreshold);
    }
    Ok(())
}

pub fn inactivity_deadline(last_heartbeat: i64, threshold_days: u16) -> Result<i64, LegacyLedgerError> {
    let delta = i64::from(threshold_days)
        .checked_mul(SECONDS_PER_DAY)
        .ok_or(LegacyLedgerError::MathOverflow)?;
    last_heartbeat
        .checked_add(delta)
        .ok_or(LegacyLedgerError::MathOverflow)
}

/// An heir's share of `amount`, in base units of that token.
/// Uses u128 intermediates so `amount * bps` cannot overflow u64.
pub fn share_of(amount: u64, allocation_bps: u16) -> Result<u64, LegacyLedgerError> {
    if allocation_bps as u32 > BPS_TOTAL {
        return Err(LegacyLedgerError::InvalidHeirConfig);
    }
    let numerator = u128::from(amount) * u128::from(allocation_bps);
    let share = numerator / u128::from(BPS_TOTAL);
    if share > u128::from(u64::MAX) {
        return Err(LegacyLedgerError::MathOverflow);
    }
    Ok(share as u64)
}

/// An heir's share of what is left in the vault for one mint.
///
/// Heirs claim one at a time, and every claim shrinks the vault balance. A
/// share computed against the live balance (`amount * bps / 10_000`) would pay
/// later heirs less than their allocation, so the share is taken against the
/// basis points still unclaimed instead. The last heir to claim has
/// `allocation_bps == remaining_bps` and therefore sweeps the rounding dust.
pub fn share_of_remaining(
    amount: u64,
    allocation_bps: u16,
    remaining_bps: u32,
) -> Result<u64, LegacyLedgerError> {
    if allocation_bps == 0 || u32::from(allocation_bps) > remaining_bps || remaining_bps > BPS_TOTAL {
        return Err(LegacyLedgerError::InvalidHeirConfig);
    }
    let numerator = u128::from(amount) * u128::from(allocation_bps);
    let share = numerator / u128::from(remaining_bps);
    // share <= amount because allocation_bps <= remaining_bps.
    Ok(share as u64)
}

/// Basis points of the heirs that have not claimed yet.
pub fn unclaimed_bps(heirs: &[Heir]) -> u32 {
    heirs
        .iter()
        .filter(|h| !h.claimed)
        .map(|h| u32::from(h.allocation_bps))
        .sum()
}

/// True when this build knows how to evaluate the rule.
pub fn is_supported_rule(rule: &WillRule) -> bool {
    matches!(rule.rule_type, RuleType::Inactivity | RuleType::DateTrigger { .. })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::ActionType;
    use anchor_lang::prelude::Pubkey;

    const NOW: i64 = 1_700_000_000;

    fn heir(name: &str, bps: u16) -> Heir {
        Heir {
            name: name.to_string(),
            wallet: Pubkey::new_unique(),
            allocation_bps: bps,
            claimed: false,
            claimed_at: 0,
        }
    }

    fn inactivity_rule(priority: u8) -> WillRule {
        WillRule {
            rule_type: RuleType::Inactivity,
            action: ActionType::DistributeToHeirs,
            priority,
            enabled: true,
        }
    }

    #[test]
    fn heirs_must_total_exactly_ten_thousand_bps() {
        let ok = vec![heir("a", 5_000), heir("b", 5_000)];
        assert!(validate_heirs(&ok).is_ok());

        let short = vec![heir("a", 4_999), heir("b", 5_000)];
        assert_eq!(
            validate_heirs(&short),
            Err(LegacyLedgerError::AllocationMismatch)
        );

        let over = vec![heir("a", 5_001), heir("b", 5_000)];
        assert_eq!(
            validate_heirs(&over),
            Err(LegacyLedgerError::AllocationMismatch)
        );
    }

    #[test]
    fn heir_allocation_overflow_does_not_panic() {
        // Ten heirs at u16::MAX each would overflow a u16 accumulator.
        let greedy = vec![heir("a", u16::MAX); MAX_HEIRS_PER_WILL];
        assert_eq!(
            validate_heirs(&greedy),
            Err(LegacyLedgerError::AllocationMismatch)
        );
    }

    #[test]
    fn zero_allocation_is_rejected() {
        let bad = vec![heir("a", 0), heir("b", 10_000)];
        assert_eq!(
            validate_heirs(&bad),
            Err(LegacyLedgerError::InvalidHeirConfig)
        );
    }

    #[test]
    fn empty_heir_list_is_rejected() {
        assert_eq!(validate_heirs(&[]), Err(LegacyLedgerError::NoHeirs));
    }

    #[test]
    fn share_of_uses_bps_and_rounds_down() {
        assert_eq!(share_of(1_000_000, 10_000).unwrap(), 1_000_000);
        assert_eq!(share_of(1_000_000, 5_000).unwrap(), 500_000);
        assert_eq!(share_of(1_000_000, 3_334).unwrap(), 333_400);
        assert_eq!(share_of(1, 5_000).unwrap(), 0);
        assert_eq!(share_of(u64::MAX, 10_000).unwrap(), u64::MAX);
    }

    #[test]
    fn share_of_rejects_allocation_above_one_hundred_percent() {
        assert_eq!(
            share_of(100, BPS_TOTAL as u16 + 1),
            Err(LegacyLedgerError::InvalidHeirConfig)
        );
    }

    #[test]
    fn every_heir_gets_their_allocation_regardless_of_claim_order() {
        // Regression: shares used to be computed against the already-reduced
        // balance, so the second of two 50/50 heirs received 25%.
        let mut heirs = vec![heir("a", 5_000), heir("b", 3_000), heir("c", 2_000)];
        let mut vault: u64 = 1_000_001;
        let mut paid = Vec::new();
        for i in 0..heirs.len() {
            let share =
                share_of_remaining(vault, heirs[i].allocation_bps, unclaimed_bps(&heirs)).unwrap();
            vault -= share;
            heirs[i].claimed = true;
            paid.push(share);
        }
        assert_eq!(paid, vec![500_000, 300_000, 200_001]);
        assert_eq!(vault, 0, "last heir sweeps the dust");
    }

    #[test]
    fn share_of_remaining_rejects_inconsistent_input() {
        assert_eq!(
            share_of_remaining(100, 6_000, 5_000),
            Err(LegacyLedgerError::InvalidHeirConfig)
        );
        assert_eq!(
            share_of_remaining(100, 0, 5_000),
            Err(LegacyLedgerError::InvalidHeirConfig)
        );
        assert_eq!(share_of_remaining(u64::MAX, 10_000, 10_000).unwrap(), u64::MAX);
    }

    #[test]
    fn inactivity_deadline_adds_days() {
        let deadline = inactivity_deadline(1_700_000_000, 180).unwrap();
        assert_eq!(deadline - 1_700_000_000, 180 * SECONDS_PER_DAY);
    }

    #[test]
    fn inactivity_threshold_bounds_are_enforced() {
        assert!(validate_inactivity_days(MIN_INACTIVITY_DAYS).is_ok());
        assert!(validate_inactivity_days(MAX_INACTIVITY_DAYS).is_ok());
        assert_eq!(
            validate_inactivity_days(MIN_INACTIVITY_DAYS - 1),
            Err(LegacyLedgerError::InvalidInactivityThreshold)
        );
        assert_eq!(
            validate_inactivity_days(MAX_INACTIVITY_DAYS + 1),
            Err(LegacyLedgerError::InvalidInactivityThreshold)
        );
    }

    #[test]
    fn duplicate_priorities_are_rejected() {
        let rules = vec![inactivity_rule(0), inactivity_rule(0)];
        assert_eq!(
            validate_rules(&rules, NOW),
            Err(LegacyLedgerError::DuplicatePriority)
        );
    }

    #[test]
    fn rules_must_be_non_empty_and_bounded() {
        assert_eq!(
            validate_rules(&[], NOW),
            Err(LegacyLedgerError::NoRules)
        );
        let many = (0..=MAX_RULES_PER_WILL as u8).map(inactivity_rule).collect::<Vec<_>>();
        assert_eq!(
            validate_rules(&many, NOW),
            Err(LegacyLedgerError::TooManyRules)
        );
    }

    #[test]
    fn date_trigger_in_the_past_is_rejected() {
        // Guards a funds-loss footgun: execute_will is permissionless, so a
        // past timestamp would let any keeper fire the will on creation.
        let stale = vec![WillRule {
            rule_type: RuleType::DateTrigger { timestamp: NOW - 1 },
            action: ActionType::DistributeToHeirs,
            priority: 0,
            enabled: true,
        }];
        assert_eq!(
            validate_rules(&stale, NOW),
            Err(LegacyLedgerError::InvalidDateTrigger)
        );

        let exactly_now = vec![WillRule {
            rule_type: RuleType::DateTrigger { timestamp: NOW },
            action: ActionType::DistributeToHeirs,
            priority: 0,
            enabled: true,
        }];
        assert_eq!(
            validate_rules(&exactly_now, NOW),
            Err(LegacyLedgerError::InvalidDateTrigger)
        );

        let future = vec![WillRule {
            rule_type: RuleType::DateTrigger { timestamp: NOW + 1 },
            action: ActionType::DistributeToHeirs,
            priority: 0,
            enabled: true,
        }];
        assert!(validate_rules(&future, NOW).is_ok());
    }

    #[test]
    fn only_inactivity_and_date_rules_are_supported() {
        assert!(is_supported_rule(&inactivity_rule(0)));
        assert!(is_supported_rule(&WillRule {
            rule_type: RuleType::DateTrigger { timestamp: 42 },
            action: ActionType::DistributeToHeirs,
            priority: 1,
            enabled: true,
        }));
        assert!(!is_supported_rule(&WillRule {
            rule_type: RuleType::PriceAbove {
                feed_id: "feed".to_string(),
                threshold: 1
            },
            action: ActionType::DistributeToHeirs,
            priority: 2,
            enabled: true,
        }));
        assert!(!is_supported_rule(&WillRule {
            rule_type: RuleType::Rebalance {
                target_allocation: vec![]
            },
            action: ActionType::DistributeToHeirs,
            priority: 3,
            enabled: true,
        }));
    }
}
