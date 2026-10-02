use anchor_lang::prelude::*;

#[event]
pub struct ProtocolInitialized {
    pub protocol: Pubkey,
    pub admin: Pubkey,
    pub protocol_fee_bps: u16,
    pub min_inactivity_days: u16,
    pub max_rules_per_will: u8,
    pub timestamp: i64,
}

#[event]
pub struct WillCreated {
    pub will: Pubkey,
    pub vault: Pubkey,
    pub testator: Pubkey,
    pub will_id: String,
    pub inactivity_threshold_days: u16,
    pub heir_count: u8,
    pub timestamp: i64,
}

#[event]
pub struct HeartbeatRecorded {
    pub will: Pubkey,
    pub testator: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct WillExecuted {
    pub will: Pubkey,
    pub keeper: Pubkey,
    pub satisfied_rule_indexes: Vec<u8>,
    pub inactivity_deadline: i64,
    pub timestamp: i64,
}

#[event]
pub struct VaultAssetRegistered {
    pub will: Pubkey,
    pub vault: Pubkey,
    pub mint: Pubkey,
    pub token_account: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct VaultAssetDeposited {
    pub will: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub vault_total: u64,
    pub timestamp: i64,
}

#[event]
pub struct VaultAssetWithdrawn {
    pub will: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub vault_total: u64,
    pub timestamp: i64,
}

#[event]
pub struct InheritanceClaimed {
    pub will: Pubkey,
    pub vault: Pubkey,
    pub heir: Pubkey,
    pub heir_index: u8,
    pub heir_name: String,
    pub allocation_bps: u16,
    pub assets_claimed: u8,
    pub total_base_units: u64,
    pub timestamp: i64,
}

#[event]
pub struct RuleUpdated {
    pub will: Pubkey,
    pub rule_index: u8,
    pub old_rule_type: String,
    pub new_rule_type: String,
    pub timestamp: i64,
}

#[event]
pub struct ProtocolPauseChanged {
    pub protocol: Pubkey,
    pub admin: Pubkey,
    pub paused: bool,
    pub timestamp: i64,
}
