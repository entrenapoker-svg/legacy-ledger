use anchor_lang::prelude::*;
use crate::constants::*;

pub fn find_protocol() -> (Pubkey, u8) {
    Pubkey::find_program_address(&[PROTOCOL_SEED], &crate::ID)
}

pub fn find_will(will_id: &str) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[WILL_SEED, will_id.as_bytes()], &crate::ID)
}

pub fn find_vault(will: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[VAULT_SEED, will.as_ref()], &crate::ID)
}

pub fn find_vault_asset(vault: &Pubkey, mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[VAULT_ASSET_SEED, vault.as_ref(), mint.as_ref()], &crate::ID)
}

pub fn find_vault_tokens(vault: &Pubkey, mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[VAULT_TOKENS_SEED, vault.as_ref(), mint.as_ref()], &crate::ID)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn seeds_are_deterministic() {
        assert_eq!(find_protocol(), find_protocol());
        assert_eq!(find_will("alvarez-2026"), find_will("alvarez-2026"));
        assert_ne!(find_will("alvarez-2026"), find_will("alvarez-2027"));
    }

    #[test]
    fn distinct_inputs_give_distinct_addresses() {
        let (will, _) = find_will("alvarez-2026");
        let (vault, _) = find_vault(&will);
        let mint_a = Pubkey::new_unique();
        let mint_b = Pubkey::new_unique();

        assert_ne!(will, vault);
        assert_ne!(find_vault_asset(&vault, &mint_a).0, find_vault_asset(&vault, &mint_b).0);
        assert_ne!(find_vault_tokens(&vault, &mint_a).0, find_vault_asset(&vault, &mint_a).0);
        assert_ne!(find_protocol().0, will);
    }
}
