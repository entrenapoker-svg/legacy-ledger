use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod pda;
pub mod state;
pub mod validate;

pub use constants::*;
pub use errors::*;
pub use events::*;
pub use instructions::*;
pub use state::*;
pub use validate::*;

declare_id!("GXWfB5gTPxMLDSAeeYQ3e8TZmZMqpTzfFR3yEiUuBAaM");

#[program]
pub mod legacy_ledger {
    use super::*;

    pub fn initialize_protocol(
        ctx: Context<InitializeProtocol>,
        protocol_fee_bps: u16,
        min_inactivity_days: u16,
        max_rules_per_will: u8,
    ) -> Result<()> {
        instructions::handle_initialize_protocol(
            ctx,
            protocol_fee_bps,
            min_inactivity_days,
            max_rules_per_will,
        )
    }

    pub fn create_will(
        ctx: Context<CreateWill>,
        will_id: String,
        inactivity_threshold_days: u16,
        rules: Vec<WillRule>,
        heirs: Vec<Heir>,
        metadata_uri: String,
    ) -> Result<()> {
        instructions::handle_create_will(
            ctx,
            will_id,
            inactivity_threshold_days,
            rules,
            heirs,
            metadata_uri,
        )
    }

    pub fn register_asset(ctx: Context<RegisterAsset>, will_id: String) -> Result<()> {
        instructions::handle_register_asset(ctx, will_id)
    }

    pub fn deposit_asset(
        ctx: Context<DepositAsset>,
        will_id: String,
        amount: u64,
    ) -> Result<()> {
        instructions::handle_deposit_asset(ctx, will_id, amount)
    }

    pub fn withdraw_asset(
        ctx: Context<WithdrawAsset>,
        will_id: String,
        amount: u64,
    ) -> Result<()> {
        instructions::handle_withdraw_asset(ctx, will_id, amount)
    }

    pub fn heartbeat(ctx: Context<Heartbeat>, will_id: String) -> Result<()> {
        instructions::handle_heartbeat(ctx, will_id)
    }

    pub fn execute_will(ctx: Context<ExecuteWill>, will_id: String) -> Result<()> {
        instructions::handle_execute_will(ctx, will_id)
    }

    pub fn claim_inheritance<'info>(
        ctx: Context<'info, ClaimInheritance<'info>>,
        will_id: String,
        heir_index: u8,
    ) -> Result<()> {
        instructions::handle_claim_inheritance(ctx, will_id, heir_index)
    }

    pub fn update_rule(
        ctx: Context<UpdateRule>,
        will_id: String,
        rule_index: u8,
        new_rule: WillRule,
    ) -> Result<()> {
        instructions::handle_update_rule(ctx, will_id, rule_index, new_rule)
    }

    pub fn pause_protocol(ctx: Context<PauseProtocol>) -> Result<()> {
        instructions::handle_pause_protocol(ctx)
    }

    pub fn unpause_protocol(ctx: Context<UnpauseProtocol>) -> Result<()> {
        instructions::handle_unpause_protocol(ctx)
    }
}
