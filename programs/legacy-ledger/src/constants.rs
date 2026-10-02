pub const PROTOCOL_SEED: &[u8] = b"protocol";
pub const WILL_SEED: &[u8] = b"will";
pub const VAULT_SEED: &[u8] = b"vault";
pub const VAULT_ASSET_SEED: &[u8] = b"vasset";
pub const VAULT_TOKENS_SEED: &[u8] = b"vtokens";

pub const BPS_TOTAL: u32 = 10_000;

pub const MAX_WILL_ID_LEN: usize = 64;
pub const MAX_METADATA_URI_LEN: usize = 128;
pub const MAX_HEIR_NAME_LEN: usize = 64;
pub const MAX_FEED_ID_LEN: usize = 64;
pub const MAX_RULES_PER_WILL: usize = 8;
pub const MAX_HEIRS_PER_WILL: usize = 10;
pub const MAX_ALLOC_TARGETS: usize = 10;

pub const MIN_INACTIVITY_DAYS: u16 = 30;
pub const MAX_INACTIVITY_DAYS: u16 = 3650;
pub const DEFAULT_INACTIVITY_DAYS: u16 = 180;

pub const MAX_PROTOCOL_FEE_BPS: u16 = 500;

/// Length of one "day" of inactivity, in seconds.
///
/// The `demo` feature shrinks a day to one second so the dead man's switch
/// can be fired live in front of an audience (30 "days" = 30 seconds). It
/// exists only for the public demo deployment and must never ship to mainnet.
#[cfg(not(feature = "demo"))]
pub const SECONDS_PER_DAY: i64 = 86_400;
#[cfg(feature = "demo")]
pub const SECONDS_PER_DAY: i64 = 1;
