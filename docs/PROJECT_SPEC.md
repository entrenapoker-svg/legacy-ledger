# LegacyLedger - Especificación

**Nota (2/10, sesión 3):** este documento es la especificación original en castellano. El estado actual (compila, 31 tests, web app funcionando, `withdraw_asset`, reparto corregido) está en `README.md` y `CONTINUAR.md`; donde difieran, mandan esos.

Este documento describe lo que el código hace hoy, no lo que el pitch promete. Donde el pitch
necesita un dato que todavía no verifiqué, dice FALTA.

---

## 1. Qué resuelve

Un deadlock concreto: si tenés activos on-chain y dejás de operar, nadie puede demostrar que
estás muerto. Sin una señal verificable, nadie mueve los fondos. El protocolo convierte el
silencio en una señal: si pasan N días sin un heartbeat firmado por vos, la cadena lo registra
y cualquiera puede disparar la distribución.

**Lo que NO resuelve:** validez legal. Que el código mueva tokens no convierte el testamento en
un documento sucesorio válido. Eso necesita opinión legal por jurisdicción.

---

## 2. Modelo de datos

| Account | Seeds | Qué guarda |
|---------|-------|-----------|
| `Protocol` | `[b"protocol"]` | admin, fees, pausa, contador de wills |
| `Will` | `[b"will", will_id]` | testator, vault, reglas, herederos, último heartbeat |
| `Vault` | `[b"vault", will]` | PDA autoridad de las token accounts |
| `VaultAsset` | `[b"vasset", vault, mint]` | cantidad real en base units de un mint |

`VaultAsset.amount` es la única fuente de verdad de cuánto hay. No hay valuación en dólares
guardada on-chain: un basket de activos no se puede precio honestamente en la cadena, y un
número guardado sería una mentira que el protocolo no puede defender.

### Reglas

```rust
enum RuleType {
    Inactivity,                          // evaluada
    DateTrigger { timestamp },           // evaluada
    PriceAbove { feed_id, threshold },   // NO evaluada
    PriceBelow { feed_id, threshold },   // NO evaluada
    Rebalance { target_allocation },     // NO evaluada
}

enum ActionType {
    DistributeToHeirs,                   // única implementada
}
```

`execute_will` devuelve `UnsupportedRuleType` si encuentra una regla enabled que no sabe
evaluar. Falla explícito en vez de fingir.

---

## 3. Instrucciones

| Instrucción | Quién | Qué hace |
|-------------|-------|----------|
| `initialize_protocol` | admin (signer) | Crea el singleton, valida fees y límites |
| `create_will` | testator | Will + Vault, valida reglas y que los herederos sumen 10000 bps |
| `register_asset` | testator | Vincula un mint al vault: VaultAsset + token account PDA |
| `deposit_asset` | testator | Transfiere tokens reales al vault y actualiza `amount` |
| `heartbeat` | testator | Resetea el reloj de inactividad |
| `execute_will` | cualquiera (keeper) | Marca el will como ejecutado si alguna regla se cumple |
| `claim_inheritance` | heredero | Paga la porción del heredero en todos los mints del vault |
| `update_rule` | testator | Reemplaza una regla, revalidando el conjunto |
| `pause_protocol` / `unpause_protocol` | admin | Circuit breaker global |

`claim_inheritance` recibe los mints como `remaining_accounts` de a tres: VaultAsset, token
account del vault, token account del heredero. Cada grupo se verifica contra la PDA del vault,
así el cliente no puede apuntar la transferencia a una cuenta ajena.

---

## 4. Modelo de seguridad

- **Composición**: `will.heirs[*].wallet == heir.key()`. El heredero es su propia clave.
- **Integridad de allocations**: suman exactamente 10000 bps, acumulado en `u32` para que un
  `allocation_bps` elegido por el atacante no desborde el acumulador.
- **Aritmética**: `share_of` usa `u128` intermedio. `amount * bps` desborda `u64` con facilidad
  si se hace en `u64`.
- **Authority**: las token accounts del vault tienen a la PDA `Vault` como authority. Sin ella
  no se pueden mover fondos.
- **Pausa**: `Protocol.paused` bloquea create, deposit, heartbeat, execute y claim.
- **Known limitation**: el cliente decide qué mints pasar en `claim_inheritance`. Si omite uno,
  ese activo queda en el vault para siempre. El protocolo verifica lo que recibe, no que
  reciba todo.

---

## 5. Mercado - FALTA

Todo lo que sigue needs verification antes de usarse en un pitch. **Ninguna de estas cifras fue
verificada contra una fuente primaria en esta sesión.**

| Dato | Estado |
|------|--------|
| Holders de crypto en Argentina | FALTA verificar |
| Holders de crypto global | FALTA verificar |
| % de holders mayores de 40 años | FALTA verificar |
| CEDEARs / bonos tokenizables en Argentina | FALTA verificar |
| Existencia de un wrapper legal válido ( fideicomiso, etc.) | FALTA - requiere asesor legal |
| Competidores y sus precios | FALTA verificar |
| TAM / proyección de ingresos | FALTA - no Projection sin datos de conversión reales |

No uses cifras de mercado en el pitch hasta que tengan fuente citada con fecha.

---

## 6. Pendiente técnico, en orden

1. Instalar toolchain (Rust, Anchor CLI, Solana CLI) y hacer `anchor build`.
2. Arreglar lo que rompa el compilador. **El checker estático no type-checkea**: no valida
   lifetimes, orden de borrowing ni resolución de traits.
3. Tests de integración con `solana-program-test` para el flujo completo.
4. Deploy a devnet, probar el keeper, medir que la demo no dependa de esperar 180 días.
5. Recién después: oracles, SBTs, WebAuthn. Cada uno es un proyecto.

### Cómo se prueba el dead man's switch sin esperar 180 días

Con `MIN_INACTIVITY_DAYS = 30` el mínimo sigue siendo alto para una demo. La demo necesita
avanzar el reloj del cluster de test, o un parámetro de override explícito para devnet que no
exista en mainnet. **Esta decisión no está tomada.**

---

## 7. Reglas de copy

- No afirmar "el primero" sin evidencia.
- No prometer oracles, SBTs, biometría o rebalanceo hasta que estén en `main`.
- No publicar un link, repo, red social o dominio hasta que exista.
