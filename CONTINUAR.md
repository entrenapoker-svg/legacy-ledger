# CONTINUAR LEGACYLEDGER

Estado para retomar en otra sesión. **Última actualización: 2026-10-02 noche (sesión 3).**

## 1. Fechas que mandan

| Fecha | Qué pasa |
|---|---|
| sáb 3/10 | Build Station (BA 9–21 h; regionales el mismo día, p. ej. Mendoza 10–16) |
| **dom 4/10 16:00** | Cierra la preselección para el Demo Day de la Build Station BA |
| dom 4/10 19:30 | Demo Day Argentina (preseleccionados) |
| **lun 12/10 23:59 PT** (= 13/10 03:59 ART) | Cierra el envío **y** el registro individual en colosseum.com |
| antes del 28/10 | Ganadores track Argentina |

Detalle y citas: `docs/research/HACKATHON-RULES.md`.

## 2. Qué funciona (verificado el 2/10)

- **El programa compila** (Anchor 1.2.0; antes estaba en 0.30.1 y nunca había compilado).
- **16 tests unitarios + 15 de punta a punta** pasan contra un validador local.
- **La web app funciona de punta a punta** en el navegador contra localnet: personas de demo, crear testamento, depositar, retirar, keeper ejecuta, herederos cobran 60/40 exacto. Capturas en `docs/img/`.
- CI de GitHub (tests + build de la app) y deploy automático de la app a GitHub Pages.

## 3. Bugs corregidos en la sesión 3

1. **El segundo heredero cobraba menos**: la parte se calculaba sobre el saldo ya reducido. Ahora `amount * bps / bps_sin_cobrar`.
2. **`claim_inheritance` no guardaba el saldo** de los VaultAsset leídos de `remaining_accounts` (faltaba `.exit()`).
3. **No había forma de retirar fondos en vida**: se agregó `withdraw_asset`.
4. `create_will` ignoraba `Protocol.min_inactivity_days`.
5. El keypair del programa estaba en un formato que la CLI de Solana no lee (se convirtió, misma clave).

## 4. Pendiente — en orden

1. **[usuario] Deploy a devnet.** Yo no pude conseguir SOL de devnet: el faucet por CLI está limitado y faucet.solana.com pide que los agentes de IA no lo usen. Pasos en `MANANA.md`.
2. **[usuario] Registrar a todos en colosseum.com** antes del 12/10.
3. **[usuario] Validación con usuarios reales** (entrevistas). Sin esto el criterio "validation" queda vacío. No inventar.
4. **[usuario] Videos**: pitch 2–3 min y demo ≤ 3 min. Guiones en `docs/PITCH.md`.
5. **[usuario] Completar los TODO de `docs/SUBMISSION.md`**: equipo, fecha de inicio real, aporte propio vs. IA.
6. Mejoras técnicas posibles: will PDA derivada de la wallet del testador (evita "squatting" de IDs), avisos a herederos, guardianes que posterguen la ejecución.

## 5. Reglas de copy

- No decir "el primero": will.eth existe (Base). `docs/research/COMPETIDORES.md`.
- No inventar usuarios, métricas, socios ni volúmenes: descalifica.
- No afirmar validez legal.
- Cifras de mercado solo con fuente y fecha (`docs/research/MERCADO-ARGENTINA.md`). El "1,2 M de holders cripto en Argentina" **no tiene fuente**: no usar.

## 6. Datos útiles

- Program ID: `GXWfB5gTPxMLDSAeeYQ3e8TZmZMqpTzfFR3yEiUuBAaM`. Keypair en `target/deploy/` (gitignored, es clave privada; backup: no hay otro, cuidarlo).
- Wallet de la CLI en WSL (paga el deploy): `6BeRAC4wykqWbeoXkTTJeZBgwgXLER9VnEMcECQZGkLx`, en `~/.config/solana/id.json` dentro de WSL.
- Herramientas y comandos: ver `CLAUDE.md`.
- `scripts/fetch.js`: fetch para research vía Firecrawl, usa la key de `C:\Users\jamaik\Desktop\investigador\.env`.
