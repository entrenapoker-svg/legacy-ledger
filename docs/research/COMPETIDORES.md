# RESEARCH: LANDSCAPE COMPETITIVO

**Fecha:** 2026-10-02
**Método:** fetch directo vía Firecrawl (`node scripts/fetch.js`) + websearch.
**Advertencia de método:** un subagente reportó haber escrito este análisis pero **no lo escribió**
— dejó un stub de 11 líneas. Todo lo de abajo está verificado por mí en esta sesión, o marcado
FALTA. No confíes en afirmaciones sobre competidores que no tengan URL.

---

## 1. EL COMPETIDOR QUE IMPORTA: will.eth

**Verificado directamente el 2026-10-02.** Repo público:
https://github.com/CodeswithrohStudio/will.eth

Estado real del repo al momento de la lectura: **15 commits**, 0 stars, 0 forks, carpeta
`agent/`, `contracts/`, `frontend/`. Es un proyecto temprano, no un producto con tracción.

### Qué hace, según su README [LITERAL de la fuente]

> "Onchain crypto inheritance via dead man's switch — no lawyers, no courts, no middlemen."
> "$140B in crypto is lost every year when people die without a plan."

Flujo declarado:
1. **Create your will** — asigna **porcentajes a nombres ENS o wallet addresses**. Deploy a **Base** en menos de 5 minutos.
2. **Check in monthly** — botón en la app, o responder `ALIVE` a un bot de Telegram. El contrato se resetea.
3. **If the worst happens** — faltar dos check-ins y cualquier heredero dispara la distribución. Reclaman con un **Anon Aadhaar ZK proof** — sin KYC, sin documentos, sin tribunales.
4. **While you're alive, your estate grows** — los fondos ociosos rinden ~7% APY en un vault de **YO Protocol** en Base.

Arquitectura: Solidity. `contracts/src/Will.sol` (contrato por will), `WillRegistry.sol` (factory
que indexa wills), `IYOVault.sol` (interfaz ERC-4626 de YO Protocol), Foundry.

### Por qué esto destruye el pitch original

| Lo que LegacyLedger iba a decir | Realidad verificada |
|---|---|
| "El primer testamento programable on-chain" | **Falso como afirmación absoluta.** will.eth existe y hace dead man's switch + distribución por porcentajes + condiciones |
| "Dead man's switch con distribución" | **No es novedad.** will.eth lo hace, y con porcentajes a múltiples herederos |
| "Crypto-native, sin abogados" | will.eth dice literalmente lo mismo |
| "0 soluciones crypto-native" | **Falso.** will.eth es exactamente eso |

**Conclusión:** el claim de "el primero" no es defendible y **no debe usarse**. Un jurado que
haga un solo search lo descarta y el resto del pitch se erosiona con él.

### Dónde SÍ hay terreno

| Eje | will.eth | LegacyLedger | notes |
|---|---|---|---|
| Chain | Base | **Solana** | Base no compite por el track de Solana ($100.000, 10 projetos) de Crypto World's Fair. Esto es una ventaja real para el hackathon |
| Identidad del heredero | Anon Aadhaar ZK (India) | Wallet直接 | Aadhaar no aplica a Argentina. Neutral: menos buddy |
| Yield While Alive | ~7% APY en YO Protocol | ninguno | **Es una debilidad.** "Tu legado crece mientras vivís" es un buen pitch y LegacyLedger no lo tiene |
| Ángulo regulatorio | ninguno visible | RG 1150 / CNV / sucesiones ARG | **Terreno libre y verificable** (ver MERCADO-ARGENTINA.md) |
| Reglas condicionales | no (solo check-in) | inactividad + fecha | Rules más expresivas, pero sin oracles reales todavía |

---

## 2. Competidores comerciales

**NO VERIFICADOS en esta sesión.** El subagente nombró Casa, Unchained Capital, Purpose Trust /
CoinPurpose, Safe (Gnosis Safe), Digerati, Coinbase Custody inheritance, y varios proveedores de
"crypto wills". **No abrí ninguno de sus sitios.** Van como FALTA, no como affirmed.

Los dos que hay que verificar primero, por ser los más probablemente peligrosos:

1. **Unchained Capital** — reported por el subagente como "collaborative inheritance". Si es real y
   comercial, es el competidor de UX para no-técnicos, que es exactamente el segmento de "Argentina,
   45+ años, acciones y CEDEARs".
2. **Safe / Gnosis Safe** — la infra de smart accounts dominante. Si Safe ya tiene succession
   planning built-in, el pitch técnico se debilita mucho.

**Cómo verificar cuando haya tiempo:** `node scripts/fetch.js "<url>"` contra cada sitio. Los
planes de pago de Safe y las features de inheritance de Coinbase probablemente bloqueen Firecrawl;
en ese caso usar websearch + docs oficiales.

---

## 3. Protocolos on-chain de dead man's switch

**NO VERIFICADOS.** El subagente nombró: Chronos Protocol, EZOTEC, Morelinks, Deadman.sol, Solvy,
Morrow Protocol, Centre, VanEck. Ninguno abierto por mí. Todos FALTA.

Esto importa por una razón concreta: si hay un protocolo ya en Solana, el proyecto tiene que saberlo antes de pitchar. **Prioridad de verificación: alterna.**

---

## 4. Pricing

FALTA — todo. No se encontró un solo precio público verificado.

---

## 5. Veredicto de defensibilidad

**No se puede pitchear "el primero".** Hay que pitchear la intersección específica:

> "El único testamento on-chain que apunta al stack regulatorio argentino: RG 1150, los PSAV, y
> el hueco legal de la sucesión de criptoactivos que no está regulado en ningún lado."

Eso es verificable (ver MERCADO-ARGENTINA.md), es Argentina-específico, y will.eth no lo toca.
Pero **depende de que el código funcione**, y hoy no compila.

**Debilidad a corregir o escondere:** will.eth rinde 7% APY mientras estás vivo. Es la parte más
atractiva de su pitch y LegacyLedger no tiene equivalente. Si hay tiempo, un vault que rinda es
el feature que más suma.

---

## FALTA — verificar antes de pitchar

1. Casa (casa.com): ¿existe? ¿precio? ¿solo BTC? ¿US-only?
2. Unchained Capital: ¿existe comercialmente? ¿precio? ¿clientela?
3. Safe/Gnosis Safe: ¿tiene succession planning? ¿built-in o módulo?
4. Propósito Trust / CoinPurpose / Steven Gates' Trust Company: ¿existe? ¿operativo?
5. Coinbase Custody / Kraken: ¿features de herencia para holders individuales?
6. Chronos, EZOTEC, Morrow, Centre, Deadman.sol, Solvy, Morelinks: ¿existen? ¿en qué chain?
   **Prioridad: ¿alguno en Solana?**
7. El claim "$140B in crypto lost every year" de will.eth: ¿de dónde sale? No es necesariamente
   verdad y no hay que citarlo sin fuente primaria.
8. Precio de cualquier competidor.
