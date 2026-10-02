# Pitch and demo scripts

## Positioning (do not change without evidence)

- **Never say "the first on-chain will".** will.eth (Base, Solidity) already does a dead man's switch with percentages to several heirs. See `research/COMPETIDORES.md`.
- What we can defend: **on Solana**, **multi-asset vault claimed in one transaction**, **exact shares regardless of claim order (tested)**, **the testator can withdraw while alive**, and the **Argentine angle** (12.3 M brokerage accounts, the RG 1150 tokenization sandbox, no crypto-inheritance rule).
- Do not claim legal validity, users, partners or volumes we do not have.

## 2-minute pitch (English, for the video)

1. **Hook (15 s).** "If you hold your own crypto and die tomorrow, what happens to it? Usually nothing. It stays there forever, because nobody can prove on-chain that you are gone."
2. **Today's options (20 s).** "You either share your seed phrase, so anyone holding it can take everything today, or you hand your assets to a custodian and stop self-custodying."
3. **Solution (30 s).** "LegacyLedger turns silence into proof. You lock tokens in a Solana program vault and name your heirs and their percentages. You sign a heartbeat now and then. If you stop for longer than the threshold you picked, anyone can trigger the will, and each heir claims exactly their share, across every token, in one transaction."
4. **Why now and why Argentina (25 s).** "12.3 million Argentines already have brokerage accounts, and the CNV opened a tokenization sandbox this year. When those assets live on-chain, inheritance becomes an on-chain problem, and there is no specific rule for it yet."
5. **Proof (20 s).** "It works today: the program is tested end to end, 31 automated tests, including the case where heirs claim in any order and still get exactly their share."
6. **Ask (10 s).** "We are looking for early users to test it on devnet, and for advice on the legal wrapper."

## Demo video script (≤ 3 min, local validator, demo clock)

| Time | Screen | Voice-over |
|---|---|---|
| 0:00 | App, "Act as: Testator" | "I'm the testator. This is a local Solana validator; on this demo build one day lasts one second." |
| 0:15 | Airdrop, Mint demo tokens | "I mint two test tokens: a bond stand-in and a dollar stand-in." |
| 0:30 | Create will, Use demo heirs 60/40, 30 days | "My daughter gets 60%, my son 40%. If I'm silent for 30 days, the will can fire." |
| 0:50 | Deposit both tokens; show the vault | "The tokens now sit in a vault owned by the program. Not by me, not by a company." |
| 1:05 | Withdraw a little | "While I'm alive I can always take them back. Any action counts as a sign of life." |
| 1:15 | Switch to Keeper, Execute is disabled | "A stranger cannot fire it while I'm still active." |
| 1:30 | Bar fills, Execute | "Thirty 'days' pass with no signature. Now anyone can execute; no one has to be trusted to declare a death." |
| 1:50 | Heir B → Claim; Heir A → Claim | "My son claims first and gets exactly 40% of each token. My daughter gets exactly 60%. The vault is empty." |
| 2:20 | Activity log, explorer link | "Every step is a Solana transaction you can inspect." |
| 2:35 | README test output | "31 automated tests back this up. Next: devnet with real users." |

## Demo Day (Spanish, 3 min)

1. "Si mañana te pasa algo, ¿qué pasa con tu cripto? Nada. Queda ahí para siempre, porque nadie puede demostrar en la cadena que ya no estás."
2. "Hoy hay dos salidas malas: compartir la frase semilla, y cualquiera que la tenga se lleva todo hoy, o dárselo a un custodio y dejar de tener tus propias llaves."
3. "LegacyLedger convierte el silencio en prueba. Dejás tus tokens en una bóveda de un programa en Solana, con tus herederos y sus porcentajes. Cada tanto firmás 'estoy vivo'. Si dejás de firmar más del plazo que elegiste, cualquiera dispara el testamento y cada heredero cobra exactamente su parte."
4. Demo en vivo (seguir el guion de arriba, 90 segundos).
5. "En Argentina hay 12,3 millones de personas con cuenta comitente y la CNV abrió el sandbox de tokenización. No hay norma de sucesión de criptoactivos. Ese hueco es nuestra oportunidad."
6. "Funciona hoy, con 31 tests automáticos. Buscamos usuarios para probarlo en devnet y asesoría legal para el envoltorio jurídico."

## Likely judge questions

- **"What if I just lose my key?"** The will fires after the silence period; that is the intended behavior. Choosing the threshold is the testator's trade-off. Roadmap: guardians who can postpone execution.
- **"Isn't this already done?"** will.eth on Base does a similar switch. We are on Solana, claim the whole portfolio in one transaction, guarantee exact shares in any claim order, and target the Argentine tokenized-securities context.
- **"Is it legally valid?"** No, and we do not claim it is. It is the technical rail; the legal wrapper needs a lawyer and is on the roadmap.
- **"How do you make money?"** Hypothesis: a small fee on deposits or claims, and B2B integration for exchanges and PSAVs. Not validated yet.
- **"Who verifies death?"** Nobody has to. Silence is the signal, and execution is permissionless.
