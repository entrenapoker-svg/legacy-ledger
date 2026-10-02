use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct Protocol {
    pub admin: Pubkey,
    pub protocol_fee_bps: u16,
    pub min_inactivity_days: u16,
    pub max_rules_per_will: u8,
    pub paused: bool,
    pub total_wills: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Will {
    pub testator: Pubkey,
    pub vault: Pubkey,
    #[max_len(MAX_WILL_ID_LEN)]
    pub will_id: String,
    #[max_len(MAX_METADATA_URI_LEN)]
    pub metadata_uri: String,
    #[max_len(MAX_RULES_PER_WILL)]
    pub rules: Vec<WillRule>,
    #[max_len(MAX_HEIRS_PER_WILL)]
    pub heirs: Vec<Heir>,
    pub inactivity_threshold_days: u16,
    pub last_heartbeat: i64,
    pub created_at: i64,
    pub executed_at: i64,
    pub is_executed: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub will: Pubkey,
    pub bump: u8,
}

/// One entry per SPL mint held by a will. `amount` is the authoritative
/// token quantity; there is no stored USD valuation, because nothing on
/// chain can price a basket of assets honestly.
#[account]
#[derive(InitSpace)]
pub struct VaultAsset {
    pub vault: Pubkey,
    pub mint: Pubkey,
    pub token_account: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum RuleType {
    /// Execute when no heartbeat happened for inactivity_threshold_days.
    Inactivity,
    /// Execute once the chain clock reaches this unix timestamp.
    DateTrigger { timestamp: i64 },
    /// Reserved: price above threshold. Not evaluated by this build.
    PriceAbove {
        #[max_len(MAX_FEED_ID_LEN)]
        feed_id: String,
        threshold: u128,
    },
    /// Reserved: price below threshold. Not evaluated by this build.
    PriceBelow {
        #[max_len(MAX_FEED_ID_LEN)]
        feed_id: String,
        threshold: u128,
    },
    /// Reserved: rebalance to target allocation. Not evaluated by this build.
    Rebalance {
        #[max_len(MAX_ALLOC_TARGETS)]
        target_allocation: Vec<AllocationTarget>,
    },
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum ActionType {
    /// Move each heir's allocation out of the vault, per mint.
    DistributeToHeirs,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub struct AllocationTarget {
    pub mint: Pubkey,
    pub percentage_bps: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub struct WillRule {
    pub rule_type: RuleType,
    pub action: ActionType,
    pub priority: u8,
    pub enabled: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub struct Heir {
    #[max_len(MAX_HEIR_NAME_LEN)]
    pub name: String,
    pub wallet: Pubkey,
    pub allocation_bps: u16,
    pub claimed: bool,
    pub claimed_at: i64,
}
