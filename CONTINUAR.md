# CONTINUAR LEGACYLEDGER

Contexto completo para retomar en otra ventana. Leelo entero antes de tocar código.

**Repo:** `C:\Users\jamaik\Desktop\legacy-ledger`
**Última actualización:** 2026-10-02 (sesión 2 — investigación)
**Hoy es:** 2 de octubre de 2026

---

## 0. LEÉ ESTO PRIMERO — DOS COSAS QUE CAMBIAN EL PLAN

### ⏰ El tiempo es el recurso escaso, no el código

| Fecha | Qué pasa | Cuánto queda |
|---|---|---|
| **domingo 4/10 16:00** | **Cierra la preselección de proyectos para el Demo Day** de la Build Station BA | **2 días** |
| domingo 4/10 19:30 | Demo Day Argentina (de los preseleccionados) | 2 días |
| **lunes 12/10 23:59 PDT** | **Cierra el envío** = martes 13/10 03:59 ART | **10 días** |
| lunes 12/10 23:59 PDT | **Cierra el registro individual** en colosseum.com | 10 días |
| antes del 28/10 | Ganadores del track Argentina | 26 días |
| 5/12/2026 | Ganadores del hackathon principal | 64 días |

Build Station Buenos Aires: **hoy 2/10 18:00 → domingo 4/10 21:00**, Café Nómada, Malabia 806,
Villa Crespo, CABA. Cupo 50 en simultáneo. Inscripción: https://luma.com/9duum73r

### 💀 El pitch original está muerto

**"El primer testamento programable on-chain" es falso y hay que sacarlo ya.**

Verificado el 2/10/2026: https://github.com/CodeswithrohStudio/will.eth existe y hace
dead man's switch **con porcentajes a múltiples herederos**, en Solidity sobre **Base**, con
reclamo vía ZK proof (Anon Aadhaar) y yield ~7% APY en un vault de YO Protocol mientras el
testador está vivo. 15 commits, sin tracción — pero la idea central ya no es original.

Detalle en `docs/research/COMPETIDORES.md`. Un jurado que haga un search te descarta.

**El pitch defendible es el ángulo argentino**, no la novedad técnica:
> el único testamento on-chain que apunta al stack regulatorio argentino, y al hueco de que
> **Argentina no tiene norma de sucesión de criptoactivos** (ver `docs/research/MERCADO-ARGENTINA.md`).

---

## 1. Qué es el proyecto

LegacyLedger: programa Anchor sobre Solana. Problema que ataca: si tenés activos on-chain y dejás
de operar, nadie puede demostrar que estás muerto, así que nadie mueve los fondos. Convierte el
silencio en señal — N días sin heartbeat firmado → la cadena lo demuestra → cualquiera dispara la
distribución a los herederos.

Contexto del usuario: larg plazo, Wall Street, portfolios, Argentina. **No** trading intradía.

**Lo que NO es:** un wrapper legal. Que el código mueva tokens no hace válido un testamento.

---

## 2. Requisitos del hackathon — lo que te ata

De `docs/research/HACKATHON-RULES.md` (465 líneas, con citas LITERAL de fuente):

- **"Ideas can enter. Working products win."** y **"a working product is required for the final
  submission"** [LITERAL, track Argentina]. No se gana con concepto.
- Criterio de evaluación #1 del hackathon principal: **"Functionality: How well does this Project
  Submission work?"**. El #4 es UX on-chain.
- **Buena noticia:** pide *"a deployed link **or accessible test environment**"*. **No hace falta
  mainnet ni devnet.** Un entorno de test accesible cumple.
- El código preexistente **no descalifica**, pero **la divulgación es obligatoria**.
- Premios: $30.000 gran premio · $300.000 para los 20 siguientes ($15.000 c/u) · $5.000 Public
  Good · $5.000 University · **Solana track $100.000 = 10 proyectos a $10.000** · $250.000 pre-seed
  de la aceleradora. Total **$840.000** en premios + **$2.5M** en seed.
- **Todos los integrantes tienen que registrarse en colosseum.com antes del 12/10 23:59 PT.** Después
  el formulario se deshabilita. Esto es fácil de overlooking y descalifica.

---

## 3. ⚠️ EL BLOQUEO TÉCNICO

**En esta máquina NO hay toolchain de Rust ni Solana:**

```
FALTA  cargo      FALTA  anchor
FALTA  rustc      FALTA  solana
OK    node        OK    npm
```

**El programa Anchor nunca compiló.** Todo el Rust de este repo está sin verificar por compilador.
Un checker estático pasa con 0 findings, pero **no type-chequea**: no valida lifetimes, orden de
borrowing ni resolución de traits. 0 findings ≠ compila.

Instalar (no se hizo — baja cientos de MB y modifica el PATH, es decisión del usuario):

```
rustup
cargo install anchor-cli --version 0.30.1
# solana-install para solana / solana-keygen
```

---

## 4. Qué SÍ está verificado

### Program ID

```
GXWfB5gTPxMLDSAeeYQ3e8TZmZMqpTzfFR3yEiUuBAaM
```

Generado con `scripts/gen-program-keypair.js` (ed25519 vía `node:crypto`, base58 propia).
**No** es placeholder. La versión anterior del código usaba
`Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`, que es la dirección real del programa de
Pump.fun — deployear con eso hubiera apuntado al programa de otro.

`node scripts\verify-program-keypair.js` → 8/8 PASS (incluye re-derivar la pubkey desde el seed).

### Checker estático → 0 findings

```
node scripts\check-program.js
```

### El checker detecta regresiones → 10/10

```
node scripts\self-test-checker.js
```

Inyecta 10 mutaciones (borrar campo de evento, renombrar error, seeds autorreferenciales, drift
de arity, drift de program id, marker accounts, drift de workspace, quitar `cdylib`) y las
detecta todas. **Un checker que no puede fallar no sirve**, así que está mutation-tested.

### Investigación de mercado — cifras con fuente primaria

De `docs/research/MERCADO-ARGENTINA.md`:

| Dato | Cifra | Fuente |
|---|---|---|
| Personas con cuenta comitente | **12,3 M** (55% de la PEA) | BYMA, 02/07/2026 |
| Cuentas totales | **24,6 M** (+35% i.a.) | BYMA, 02/07/2026 |
| CEDEARs en listado oficial | **446 filas / 445 códigos** | BYMA PDF, 16/09/2026 |
| Comitentes con posición en CEDEARs | **+1 M** (878 mil operaron) | BYMA, 02/07/2026 |
| ADTV mercado | **USD MEP 12.261 M** diarios | BYMA, 02/07/2026 |
| Población 65+ | **11,9%** | INDEC Censo 2022 |

> Ojo: se cayó el "65+ = 15,9%" que había antes. Era falso. Y el "1,2M de holders cripto en
> Argentina" **no tiene fuente primaria** — quedó en FALTA, no lo uses.

### El hueco legal que sostiene el pitch

**No existe norma de sucesión de criptoactivos en Argentina.** Lo único explícito es que las
"sucesiones indivisas" están en el **art. 38 de la Ley 27.799** y son contribuyentes de Ganancias.
Ahí está el hueco. Antes se afirmó "Fideicomiso Financiero Ley 24.441 como wrapper válido" sin
opinión legal — **eso es FALTA**, requiere asesor.

### El precedente de tokenización real

`wAL30rd` = **AL30 tokenizado 1:1**, lanzamiento **15/09/2025**, confirmado por Marval y Ripio.
Paga cupón en USDT, se transfiere entre PSAV, se redime por ALyC. Es el **único** precedente real
y es del Estado. **No se encontró ningún CEDEAR ni acción tokenizada emitida** — aunque la
**RG 1150/2026 art. 1 inc. c** los habilita explícitamente.

### ⚠️ La RG 1150/2026 muerde el diseño

- **Prohíbe transferir fuera de los PSAV** (art. 5.f) y **prohíbe DeFi**.
- Exige depósito en Caja de Valores.
- **Máximo 5 PSAV por emisión.**
- El **certificado de tenencia** (art. 28) es lo que hace posible heredar sin inventar: documento
  del ADCVN con efectos de valor anotado.
- El sandbox **vence 31/12/2027**.

Cualquier promesa de liquidez, composability o integración DeFi choca contra el reglamento. Es un
bloqueante de diseño, no un detalle.

---

## 5. Bugs que ya corregí (no los repitas)

La primera versión del programa **no compilaba** y tenía tres bugs de seguridad reales:

1. **El circuit breaker de pausa no pausaba nada.** `pause/unpause` escribían `Protocol.paused`,
   pero las instrucciones chequeaban `will.is_paused` — un campo que **nadie escribía nunca**.
2. **`claim_inheritance` transfería dólares como tokens.** `token::transfer(vault.total_value_usd)`,
   una valuación que ningún código actualizaba, en un vault que no podía recibir fondos.
3. **Overflow de u16** sumando `allocation_bps` de hasta 20 herederos. Input elegido por atacante →
   panic en debug. Ahora acumula en `u32`, con test de regresión.

De compilación: **seeds autorreferenciales** en 4 instrucciones (`seeds = [..., will.will_id…]`
sobre la propia cuenta `will`); **`ActionType::Rebalance` matcheado como struct** siendo unitario;
**faltaba `[lib]` con `crate-type = ["cdylib","lib"]`**; **pin de `solana-program = "2.1.4"`**
incompatible con anchor-lang 0.30.1 (que usa 1.18); **`import`s muertos** en lib.rs; y dos
**marker accounts inventados** (`heir_marker`, `rule_marker`) que obligaban al cliente a mandar
una cuenta de más sin sentido.

Vapor eliminado: oracles Pyth/Switchboard con **feed IDs inventados**, SBTs sin instrucción que
los creara, `VerificationMethod`, biometría, rebalanceo, `withdraw_fees` que emitía `amount: 0`,
`total_value_usd`, `OraclePriceData`.

---

## 6. Mapa del repo

```
Anchor.toml                      program id consistente con lib.rs (localnet + devnet)
Cargo.toml                       workspace, members = ["programs/legacy-ledger"]
README.md                        estado real + tabla FALTA
CONTINUAR.md                     este archivo

programs/legacy-ledger/
  Cargo.toml                     [lib] cdylib; deps: anchor-lang 0.30.1, anchor-spl 0.30.1
  src/lib.rs                     declare_id + 11 entrypoints #[program]
  src/constants.rs               seeds, límites, BPS_TOTAL, SECONDS_PER_DAY
  src/state.rs                   Protocol, Will, Vault, VaultAsset, RuleType, ActionType,
                                 WillRule, Heir, AllocationTarget
  src/validate.rs                lógica pura + 9 tests #[cfg(test)]
  src/pda.rs                     derivación de PDAs + 2 tests
  src/errors.rs                  errores, todos usados (el checker lo valida)
  src/events.rs                  10 eventos
  src/instructions/              initialize_protocol, create_will, register_asset,
                                 deposit_asset, heartbeat, execute_will,
                                 claim_inheritance, update_rule, admin(pause/unpause)

app/                             Next.js — scaffold, NUNCA compilado
docs/PROJECT_SPEC.md             especificación real
docs/research/
  HACKATHON-RULES.md             465 líneas, reglas oficiales con citas LITERAL
  MERCADO-ARGENTINA.md           356 líneas, datos BYMA/INDEC/CNV/RG 1150 con fuentes
  COMPETIDORES.md                will.eth verificado + lista FALTA de lo demás
scripts/
  fetch.js                       fetch de research vía Firecrawl (key del proyecto investigador)
  gen-program-keypair.js         genera keypair ed25519 del programa
  verify-program-keypair.js      8 checks del keypair
  check-program.js               checker de consistencia estática
  self-test-checker.js           10 mutaciones contra el checker

target/deploy/legacy_ledger-keypair.json   GITIGNORED — es clave privada
```

---

## 7. Comandos

```bash
cd C:\Users\jamaik\Desktop\legacy-ledger

node scripts\check-program.js             # 0 findings
node scripts\self-test-checker.js         # 10/10 PASS
node scripts\verify-program-keypair.js    # 8/8 PASS
node scripts\fetch.js "<url>"             # research — YA FUNCIONA
```

Requieren toolchain:

```bash
anchor build
cargo test -p legacy_ledger    # 11 tests ya escritos
cd app; npm install; npm run build
```

### `scripts/fetch.js` — la herramienta de research

Usa la `FIRECRAWL_API_KEY` que ya vive en `C:\Users\jamaik\Desktop\investigador\.env`.
**Verificada funcionando.** Trae markdown limpio de cualquier URL, con fallback a fetch plano
avisando cuál usó.

```bash
node scripts\fetch.js "https://colosseum.com/worldsfair"
node scripts\fetch.js --file urls.txt
```

---

## 8. FALTA — todo lo que no está verificado

| Ítem | Nota |
|------|------|
| Que el programa compile | No hay toolchain. Es lo primero. |
| `#[derive(InitSpace)]` sobre enums con `#[max_len(...)]` | **Riesgo real.** Si el derive no soporta enums, hay que calcular `INIT_SPACE` a mano |
| Sintaxis de `constraint = ... @ Error` en Anchor 0.30.1 | No verificado |
| `Account::try_from` sobre remaining accounts + escritura al drop | Patrón correcto, no verificado |
| Versión actual de Next.js | package.json dice 14.2.0 sin contrastar. Es viejo y tiene CVEs |
| Que el frontend compile | Nunca se corrió `npm install` ni `next build` |
| Casa, Unchained, Safe, Purpose Trust, Coinbase Custody | **NO verificados.** Van como FALTA en COMPETIDORES.md |
| Chronos, EZOTEC, Morrow, Centre, Deadman.sol, Solvy | **NO verificados.** Prioridad: ¿alguno en Solana? |
| Cualquier precio de competidor | FALTA |
| Volumen CEDEARs 1S2026 ("USD 16.295 M, +104%") | No se encontró la página BYMA que lo respalde |
| Cantidad de PSAV inscriptos | Registro CNV dinámico, totales inconsistentes |
| Wrapper legal (fideicomiso, etc.) | FALTA — requiere asesor legal |
| Si el hackathon exige mainnet | Confirmado que **NO**: pide "deployed link **or accessible test environment**" |

---

## 9. Decisiones de diseño y por qué

**`VaultAsset.amount` es la única fuente de verdad; no hay valuación en dólares on-chain.** Un
basket no se puede precio honestamente en la cadena, y un número guardado sería una mentira que
el protocolo no puede defender.

**`claim_inheritance` recibe los mints como `remaining_accounts` de a tres** (VaultAsset, token
account del vault, token account del heredero). Así un heredero cobra todo su portfolio en una
transacción. Cada grupo se verifica contra la PDA del vault.

**Known limitation, documentada:** el cliente decide qué mints pasar. Si omite uno, ese activo
queda en el vault para siempre. Cerrar esto requiere un índice paginado de VaultAssets.

**`register_asset` separado de `deposit_asset`** en vez de `init_if_needed`: evita la feature y
achica la superficie audit.

**Sin `withdraw_fees`.** No hay contabilidad de fees en `Protocol`, así que era mentira.

**Deps mínimas a propósito.** Solo `anchor-lang` y `anchor-spl`. Cada dep de oracles es un
conflicto de versión probable.

**Seeds de cuentas no-`init` usan `bump` canónico, no el guardado.** Cuesta ~1500 CU extra pero
elimina toda ambigüedad de autorreferencia. El campo `bump` se guarda igual porque hace falta
para firmar CPI en `claim_inheritance`.

---

## 10. Cómo probar el dead man's switch sin esperar 180 días

`MIN_INACTIVITY_DAYS = 30` sigue siendo demasiado para una demo. Hacen falta dos cosas:

1. Avanzar el reloj del cluster de test (posible con `solana-program-test` en Rust).
2. O un parámetro de override **solo en devnet** que no exista en mainnet.

**Decisión NO tomada.** Es el bloqueante #2 después del toolchain, porque sin esto no hay demo
posible. Y la demo es lo que se puntúa.

---

## 11. Próximos pasos, en orden de urgencia real

1. **[decisión del usuario]** Instalar el toolchain. Sin esto los pasos 2+ son a ciegas.
2. **Sacar "el primero" de todo el material.** Ya está en la landing; revisar pitch y docs.
   Hecho en `COMPETIDORES.md` y §0 de este archivo.
3. **Registrarse en colosseum.com** los integrantes antes del 12/10 23:59 PT. Trivial y
   descalificante si se olvida.
4. **`anchor build`.** Arreglar lo que rompa. Empezar por `InitSpace` en enums y por
   `constraint = ... @ Error`.
5. `cargo test -p legacy_ledger` — 11 tests ya escritos.
6. **Decidir el override de tiempo para la demo** (§10). Sin esto no hay demo.
7. Tests de integración `solana-program-test`: create → register → deposit → heartbeat →
   (reloj) → execute → claim.
8. Build Station BA este finde. **Preselection cierra domingo 16:00.**
9. Solo después: oracles, SBTs, biometría, yield. Cada uno es un proyecto.

---

## 12. Reglas de copy

- **No decir "el primero" / "primer protocolo".** will.eth existe. Verificado.
- No prometer oracles, SBTs, biometría, rebalanceo o RWAs hybrids hasta que estén en `main`.
- No publicar link, repo, red social ni dominio hasta que exista. La primera versión de la
  landing tenía enlaces inventados a `github.com/legacy-ledger`, `twitter.com/legacyledger` y
  `discord.gg/legacyledger` — eliminados.
- No publicar cifra de mercado sin fuente primaria citada con fecha. Todas las de arriba las tienen.
- **No afirmar nada sobre la legalidad de automatizar sucesiones** sin opinión legal escrita.

---

## 13. Trampas para quien retome

- **El keypair del programa está gitignored a propósito.** Un clone nuevo tiene el mismo
  `declare_id` pero **no** la clave para desplegarlo. Hay que regenerarlo y cambiar `declare_id` +
  `Anchor.toml` **juntos**, o no se puede desplegar. El checker falla con `program id drift` si
  los desincronizás.
- **`ClaimInheritance` valida el índice con cortocircuito a propósito:**
  `usize::from(heir_index) < will.heirs.len()` va PRIMERO en la lista de constraints, para que los
  siguientes no panic-eeen al indexar. Si reordenás los constraints, se rompe.
- **`WillRule` NO tiene campo `executed`.** La versión anterior lo tenía y nadie lo actualizaba.
- **El checker tiene una lista hardcodeada de ítems eliminados** (`const deleted` en
  `check-program.js`). Si eliminás algo nuevo, agregalo ahí.
- **`execute_will` usa dos errores a propósito:** `InactivityPeriodNotMet` si hay regla de
  inactividad y no venció el plazo, `RuleConditionNotMet` si no se disparó nada. El keeper
  necesita distinguir "reintentá en N días" de "no aplica".
- **En Windows, `ls -la` no funciona.** Usar `dir` o cmdlets de PowerShell.
- **Un subagente reportó haber escrito `COMPETIDORES.md` y no lo hizo** — dejó un stub. Si
  delegás research, **verificá que el archivo exista y tenga contenido antes de creer el resumen.**
