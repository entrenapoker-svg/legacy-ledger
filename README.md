# LegacyLedger

Programa Anchor sobre Solana: reglas de salida para activos, con dead man's switch y
distribución a herederos.

**Estado: el programa NO compiló nunca.** No hay Rust, Anchor CLI ni Solana CLI instalados en
esta máquina. Ver "FALTA" más abajo.

---

## Verificado

Estas cosas sí están comprobadas:

- **Program ID**: `GXWfB5gTPxMLDSAeeYQ3e8TZmZMqpTzfFR3yEiUuBAaM`
  Generado con `scripts/gen-program-keypair.js` (ed25519 vía Node) y validado por
  `scripts/verify-program-keypair.js`: el seed deriva la pubkey guardada, 64 bytes, round-trip
  base58 correcto, no es un placeholder.
- **Consistencia entre archivos**: `node scripts/check-program.js` pasa con 0 findings.
- **El checker detecta regresiones**: `node scripts/self-test-checker.js` inyecta 10 mutaciones
  (borrar un campo de evento, renombrar un error, seeds autorreferenciales, drift de arity,
  drift de program id, marker accounts, drift de workspace, quitar `cdylib`) y las detecta
  10/10.

## NO verificado - FALTA

| Ítem | Por qué |
|------|---------|
| Que el programa compile | No hay toolchain. `cargo`, `rustc`, `anchor`, `solana` = no instalados |
| Que los `#[derive(InitSpace)]` sobre enums con `#[max_len)]` compilen | No verificado contra el compilador |
| Aritmética de `require!`/`constraint` en versión exacta de Anchor 0.30.1 | No verificado |
| Versión de Next.js / React del frontend | `package.json` dice 14.2.0 sin verificar contra el estado actual |
| Que el frontend compile | Nunca se corrió `npm install` ni `next build` |
| Cualquier cifra de mercado | Ninguna fuente primaria consultada |
| Timeline del hackathon | FALTA - no reconfirmado contra la página oficial |

El checker estático **no type-checkea**. No valida lifetimes, orden de borrowing ni resolución
de traits. Pasa 0 findings y el programa aun así puede no compilar.

---

## Estructura

```
Anchor.toml                      config; program id consistente con lib.rs
Cargo.toml                       workspace
programs/legacy-ledger/
  src/lib.rs                     declare_id + entrypoints #[program]
  src/state.rs                   Protocol, Will, Vault, VaultAsset, reglas
  src/validate.rs                lógica pura + tests #[cfg(test)]
  src/pda.rs                     derivación de PDAs + tests
  src/instructions/              una instrucción por archivo
  src/events.rs                  eventos emitidos
  src/errors.rs                  errores del programa
app/                             Next.js (scaffold, no compilado)
docs/PROJECT_SPEC.md             especificación real + lista FALTA de mercado
scripts/gen-program-keypair.js   genera el keypair del programa
scripts/verify-program-keypair.js valida el keypair
scripts/check-program.js         checker de consistencia estática
scripts/self-test-checker.js     prueba de mutaciones del checker
```

## Comandos

```bash
node scripts/verify-program-keypair.js   # ok
node scripts/check-program.js            # ok, 0 findings
node scripts/self-test-checker.js        # ok, 10/10

# pendientes, requieren instalar el toolchain primero:
# anchor build
# cargo test -p legacy_ledger
# cd app && npm install && npm run build
```

## El keypair del programa

Vive en `target/deploy/legacy_ledger-keypair.json`, que está gitignored a propósito: es una
clave privada y nunca debe ir a un repo. Consecuencia: un clone nuevo tiene el mismo
`declare_id` en el código pero **no** la clave para deployarlo. Quien clonee tiene que generar
su propio keypair y cambiar `declare_id` + `Anchor.toml` juntos, o no va a poder desplegar.

## Próximo paso bloqueante

Instalar el toolchain. Sin esto no se puede verificar nada del programa:

```
rustup          -> cargo, rustc
solana-install  -> solana, solana-keygen
cargo install anchor-cli --version 0.30.1
```

Ese install baja cientos de MB y modifica el PATH de la máquina. No se hizo sin preguntar.
