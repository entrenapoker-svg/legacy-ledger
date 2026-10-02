use anchor_lang::prelude::*;

#[error_code]
#[derive(PartialEq)]
pub enum LegacyLedgerError {
    #[msg("Invalid will id length")]
    InvalidWillIdLength,
    #[msg("Invalid metadata uri length")]
    InvalidMetadataUriLength,
    #[msg("Too many rules for this will")]
    TooManyRules,
    #[msg("Will must have at least one rule")]
    NoRules,
    #[msg("Too many heirs")]
    TooManyHeirs,
    #[msg("Will must have at least one heir")]
    NoHeirs,
    #[msg("Invalid inactivity threshold")]
    InvalidInactivityThreshold,
    #[msg("Invalid protocol fee")]
    InvalidProtocolFee,
    #[msg("Will already executed")]
    WillAlreadyExecuted,
    #[msg("Will not executed yet")]
    WillNotExecuted,
    #[msg("Inactivity period not met")]
    InactivityPeriodNotMet,
    #[msg("Unauthorized: only the testator can do this")]
    UnauthorizedTestator,
    #[msg("Unauthorized: only the admin can do this")]
    UnauthorizedAdmin,
    #[msg("Heir index out of range")]
    HeirNotFound,
    #[msg("Unauthorized: signer is not the heir for this index")]
    UnauthorizedHeir,
    #[msg("Heir already claimed")]
    HeirAlreadyClaimed,
    #[msg("Invalid rule index")]
    InvalidRuleIndex,
    #[msg("Rule condition not met")]
    RuleConditionNotMet,
    #[msg("Rule type not supported by this build")]
    UnsupportedRuleType,
    #[msg("Date trigger must be in the future")]
    InvalidDateTrigger,
    #[msg("Rule priority must be unique")]
    DuplicatePriority,
    #[msg("Invalid heir configuration")]
    InvalidHeirConfig,
    #[msg("Heir allocations must total exactly 10000 bps")]
    AllocationMismatch,
    #[msg("Invalid token mint")]
    InvalidTokenMint,
    #[msg("Vault asset mismatch")]
    VaultAssetMismatch,
    #[msg("Vault token account does not belong to this vault")]
    InvalidVaultTokenAccount,
    #[msg("Vault holds no assets to distribute")]
    VaultEmpty,
    #[msg("Deposit amount must be greater than zero")]
    ZeroAmount,
    #[msg("Expected remaining accounts in groups of three (vault asset, vault tokens, heir tokens)")]
    InvalidRemainingAccounts,
    #[msg("Remaining account must be writable: pass it with isWritable=true")]
    RemainingAccountNotWritable,
    #[msg("Protocol is paused")]
    ProtocolPaused,
    #[msg("Protocol is not paused")]
    ProtocolNotPaused,
    #[msg("Vault holds less than the requested amount")]
    InsufficientVaultBalance,
    #[msg("Arithmetic overflow")]
    MathOverflow,
}
