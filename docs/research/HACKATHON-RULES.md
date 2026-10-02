# Crypto World's Fair (Colosseum) + Superteam Argentina Track — Reglas oficiales

**Fecha de esta investigación: 2 de octubre de 2026.**
Todas las páginas fueron leídas el 2/10/2026. Las fechas que se citan son las que la página
declara; cuando una página no declara fecha de publicación, se dice.

Leyenda de niveles de certeza:
- **[LITERAL]** = texto copiado de la fuente.
- **[INFERENCIA]** = conclusión mía a partir de lo leído, no escrita por la fuente.
- **[FALTA]** = no encontrado en ninguna fuente oficial accesible.

---

## Fuentes consultadas (con estado)

| # | URL | Estado | Fecha de la página |
|---|---|---|---|
| F1 | https://colosseum.com/worldsfair | Leída completa | Sin fecha de publicación declarada. Contiene Workshops del 15/9/2026 al 5/10/2026 → contenido de octubre 2026 |
| F2 | https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf | Leída completa (PDF, 25.863 chars) | Documento © 2026 Colosseum Org LLC. Sin fecha de emisión |
| F3 | https://colosseum.com/hackathon | Leída completa (incluye FAQ `#faqs`) | Sin fecha declarada. Menciona "Live Now / Fall 2026" |
| F4 | https://colosseum.com/worldsfair/resources | Leída completa | Sin fecha declarada |
| F5 | https://colosseum.com/arena/hackathon | **Bloqueada** — redirige a login ("Create your account") | n/a |
| F6 | https://colosseum.com/worldsfair/guidelines | **404** | n/a |
| F7 | https://colosseum.com/legal/ | **404** (no hay índice) | n/a |
| F8 | https://superteam.fun/earn/hackathon/crypto-worlds-fair | Leída (37 tracks listados) | Countdown vivo: "Submissions Close In 10d:12h:55m" al 2/10/2026 |
| F9 | https://superteam.fun/earn/listing/colosseum-crypto-worlds-fair-hackathon-superteam-argentina-track | Leída completa | `publishedAt: 2026-09-22T01:01:24.100Z` |
| F10 | https://superteam.ar/colosseum | Leída completa (hub oficial Superteam Argentina) | Countdown vivo; cohorte 28/9 → 12/10/2026 |
| F11 | https://superteam.ca/colosseum | Leída (track Canadá — **NO** Argentina; solo como referencia cruzada del proceso Colosseum) | Timeline con "Today · Oct 2" |
| F12 | https://blog.colosseum.com/expanding-the-arena/ | Hallazgo vía búsqueda | Publicado 2026-09-03 |
| F13 | https://luma.com/superteamar | Devuelve vacío (calendario JS-rendered) | n/a |

URL del PDF de reglas (sacada del `href` exacto del footer de F1):
`https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf`
[Nota técnica: el href en el HTML usa un apóstrofo crudo, no escapado. Firecrawl lo parsea bien.]

---

## A. FECHAS LÍMITE

### A.1 Las 5 fechas confirmadas

| # | Evento | Fecha | Hora / timezone | Fuente |
|---|---|---|---|---|
| 1 | **Inicio del concurso** | **14 de septiembre de 2026** | **6:00am PT** | F2 §5 — [LITERAL] "The Contest Period starts at 6:00am PT on September 14, 2026" |
| 2 | **Cierre de submissions (Colosseum)** | **12 de octubre de 2026** | **11:59pm PT** | F2 §5 y §6(a) — [LITERAL] "ends at 11:59pm PT on October 12, 2026". Confirmado por F1: "Submissions due October 12, 2026". En hora argentina (UTC-3) = **13/10 03:59 ART** [F10 lo dice literal] |
| 3 | **Cierre de registro individual** | **12 de octubre de 2026** | **11:59pm PT** | F2 §6(a) — [LITERAL] "each Member must visit and register on the colosseum.com platform before 11:59pm PT on October 12, 2026. After 11:59pm PT on October 12, 2026, the individual registration form will be disabled" |
| 4 | **Anuncio de ganadores (hackathon principal)** | **5 de diciembre de 2026** | [LITERAL] "by December 5, 2026" (F2 §5) y "on or about December 5, 2026" (F2 §13) | F2 |
| 5 | **Anuncio de ganadores (track Argentina)** | **antes del 28 de octubre de 2026** | [LITERAL] "Ganadores del track, antes del 28/10/2026" | F10. **Contradicción entre fuentes → ver A.4** |

Equivalencias de zona horaria del deadline (calculadas, no declaradas):
- 12/10/2026 23:59 PDT (UTC-7) = 13/10 02:59 UTC = 13/10 03:59 ART (UTC-3).
- El campo interno del listing de Earn es `"deadline":"2026-10-13T06:59:00.000Z"` [F9, dato crudo del HTML].
  Eso es **13/10 06:59 UTC = 12/10 23:59 PDT**, o sea exactamente el deadline de Colosseum. Coincide con F2 §5. [INFERENCIA: el listing de Earn usa el deadline global de Colosseum, no uno propio]

### A.2 Countdown dinámico — texto literal observado

- F1 (colosseum.com/worldsfair): "Submissions due **October 12, 2026**" (texto estático, no countdown).
- F8 (superteam.fun/earn/hackathon/crypto-worlds-fair): "Submissions Close In **10d:12h:55m**" y "Total Prizes **$344,947**", "Tracks **37**". Leído 2/10/2026 → el countdown es **relativo**, no una fecha fija.
- F9 (listing Argentina): "REMAINING **10d:12h:50m**", "0 SUBMISSIONS" al momento de leer.
- F10 (superteam.ar/colosseum): "La entrega para el track cierra en **10días 7h 12min**" + texto fijo "**12/10/2026, 23:59 en Argentina**".

**Ojo:** ninguno de estos countdowns es una fecha. Las fechas fijas están en F2 (el PDF legal) y en el
texto estático de F10. Son esas las que hay que usar.

### A.3 Build Station y Demo Day

**Build Station — Argentina (SÍ existe, fechas confirmadas).** Fuente F10, [LITERAL]:

- **Build Station Buenos Aires**: viernes **2/10/2026 18:00** → domingo **4/10/2026 21:00** (hora Argentina GMT-3).
  Sede: **Café Nómada, Malabia 806, Villa Crespo, CABA**. Cupo: 50 personas en simultáneo. Presencial o remoto.
  - viernes 2/10 · 18:00–21:00 — Conformación de equipos, dudas y arranque
  - sábado 3/10 · 9:00–21:00 — Sede abierta para construir
  - domingo 4/10 · 9:00–21:00 — **16:00 cierra la preselección de proyectos** / **19:30 arranca el Demo Day** con los seleccionados
- **Build Stations regionales**, todas el **sábado 3/10/2026**:
  Formosa 9:00–18:00 · Salta 9:30–18:00 · Jujuy 10:00–17:00 · Tucumán 10:30–17:30 · Mar del Plata 10:30–17:30 · Mendoza 10:00–16:00
- Inscripción Build Station: https://luma.com/9duum73r · Hub del programa: https://luma.com/3qmbyb6h

**Demo Day — Argentina:** el del Demo Day de la Build Station (4/10 19:30, local). El Demo Day **final**
para los equipos preseleccionados **no tiene fecha publicada**.

**Build Station / Demo Day del hackathon principal de Colosseum:** [FALTA] — no hay fecha publicada.
Lo único literal que dice F3 es: "partners such as Superteam and the Solana Foundation host build
spaces in cities around the world during our hackathons. Check the schedule at solana.com/events".

### A.4 Contradicción sobre cuándo se anuncian los ganadores

| Fuente | Qué dice |
|---|---|
| F2 (PDF legal) §5 y §13 | Ganadores **"by / on or about December 5, 2026"** |
| F3 (colosseum.com/hackathon FAQ) | "Hackathon winners—and the subset accepted into the Accelerator—are announced **roughly one month after the submission deadline**" → ≈ mediados de noviembre 2026 |
| F9 (listing Argentina, texto renderizado) | "WINNER ANNOUNCEMENT BY **October 27, 2026** - as scheduled by the sponsor" |
| F9 (campo interno del HTML) | `2026-10-28` |
| F10 (superteam.ar) | "Ganadores del track, **antes del 28/10/2026**" |

**Las dos fuentes oficiales principales se contradicen** (5 de diciembre vs. "un mes después del
deadline"). El PDF legal es el documento contractual, pero la landing dice otra cosa. No se puede
resolver con las fuentes disponibles. Para el track Argentina, lo seguro es **antes del 28/10/2026**
y el texto visible del listing dice 27/10 — la diferencia entre el texto y el dato interno del propio
listing es un problema de la plataforma.

### A.5 Otras fechas del programa Argentina (F10)

- 28/9 → 12/10/2026 — cohorte / hub online (inscripción libre)
- 30/9–2/10/2026 — Workshop Week online (3 días: Negocio & GTM / Solana & Tech / AI & Tech)
- 2/10 → 4/10/2026 — Build Station
- 5/10 → 11/10/2026 — Mentorship "Top Talent" (solo equipos seleccionados, con aprobación)
- **12/10/2026 23:59 ART** — cierre del track en Earn (según F10)
- **13/10/2026 03:59 ART** — cierre global de Colosseum (según F10) = 12/10 23:59 PDT

**Contradicción de deadline Earn:** F10 dice "12/10/2026, 23:59 en Argentina" para el track, pero el
campo interno de F9 dice `2026-10-13T06:59:00.000Z` (= 13/10 03:59 ART, el deadline global). Diferencia
de 4 horas. **[INFERENCIA: para no arriesgar, respetar el deadline global de Colosseum, que es el
posterior.]**

---

## B. CRITERIOS DE EVALUACIÓN

**Hay dos listas distintas y ninguna es la "ponderación" del jurado. Ninguna de las dos publica
pesos o porcentajes.** [FALTA: no existe ponderación publicada]

### B.1 Criterios oficiales del PDF legal — F2 §8 "Winner Determination"

Cada Project Submission será juzgada por Colosseum y un panel de jueces. [LITERAL]:

- **(a) Functionality**: "How well does this Project Submission work? What is the quality of the code?"
- **(b) Potential Impact**: "How big is the total addressable market for this Project Submission? What will be the impact of this Project Submission on the broader crypto ecosystem?"
- **(c) Novelty**: "How unique is this Project Submission's concept?"
- **(d) UX**: "How well does this Project Submission utilize blockchain to create great UX for downstream users?"
- **(e) Open-source**: "Is this Project Submission open-source? How well does the Project Submission compose with other primitives in the crypto ecosystem?"
- **(f) Business Plan**: "Is there a viable business that can be built in the future around this Submission? How adept is the team building the product to execute on the vision?"

### B.2 Criterios de la FAQ de Colosseum — F3

[LITERAL] "Every submission is reviewed against factors including:" (la palabra que usan es
*including*, o sea la lista no es exhaustiva):

- **Founder + Market Fit** — "¿el equipo tiene las habilidades y experiencia correctas para tener éxito en este mercado, y por qué está motivado a resolver este problema?"
- **Insight** — "¿el equipo fundador tiene algún insight único basado en su comprensión profunda del problema? ¿Hay alguna tecnología nueva o tendencia que crea una oportunidad?"
- **Product + Execution** — "¿qué tan bien funciona el producto? ¿cómo se compara con la competencia? ¿qué tan rápido el equipo está lanzando product updates y atendiendo feedback de usuarios?"
- **Potential Market Size** — "¿qué tan grande es el TAM? ¿ya es grande, o chico pero creciendo rápido?"
- **Founder Communication** — "¿los fundadores comunican la visión del producto con claridad y son capaces de crecer la base de usuarios?"
- **Viability** — "¿puede este proyecto convertirse en un negocio escalable y sostenible?"
- **Traction** — "¿el producto ya tiene demanda o ingresos? ¿qué tan durables son?"

Frase clave sobre elCharacter del hackathon [LITERAL]: "**Colosseum hackathons are startup competitions**",
"**Although the hackathon is a speed run through technical development, participants should also refine
their go-to-market strategy and presentation**", "**We evaluate more than the product itself**".

### B.3 Qué se mira en el repo de GitHub — F3 [LITERAL]

"Mostly, we want to see that you and your team:
- Did significant work during the hackathon
- Were the ones to do this work, rather than a third party
- Prioritized feature development strategically"

Lo que **NO** buscan [LITERAL]:
- "Using a particular language or framework"
- "Specific design patterns, best practices, or code-quality checks"

### B.4 Proceso de selección — F3 [LITERAL]

1. El equipo de Colosseum hace **múltiples rondas de evaluación** y avanza un shortlist de los productos
   de más alta calidad al panel de jurado.
2. Después del juzgamiento individual, **un grupo mucho más pequeño es invitado a una entrevista Zoom
   de 15 minutos**.
3. Con las entrevistas completas, se eligen los ganadores.
4. F1 confirma que el **equipo de Colosseum revisa todas las submissions de producto y determina los
   ganadores generales**; los "Track Judges" (builders, investors y operators que trabajan con Colosseum)
   evalúan las tracks dedicadas.

Jurado general (F1): Clay Robbins, Matty Taylor, Nate Levine, Max Monciardini, Michael Rinko (todos Colosseum).
Track Judges (F1): Adam Gutierrez (Phantom), Arihant Bansal, Binji (Ethlabs), Daniel Sapkota (Lightcone),
David Tso (Base), Dean (Realms), Jed Halfon (Anza), Jill Gunter (Espresso), Julian Deschler (Arcium),
Julian Ma (Ethlabs), LBO, Milian (Arcium), Mitchell (MetaDAO), Ray Zhang (Ellipsis Labs),
Sitaram (Avici), w.sol (Drift).

### B.5 Qué "penaliza"

- F3: los productos **sin** GitHub privado con accesoorfalso. [INFERENCIA]
- F2 §8(e): el open-source es un **criterio evaluado**. Un repo privado no descalifica, pero
  F3 dice que si es privado hay que darle acceso a `hackathon@colosseum.com`. [INFERENCIA: el
  open-source suma puntos en el criterio (e), pero no es eliminatorio]
- F3: los equipos que no pueden explicar GTM, validación de demanda y distribución, en una hackathon
  que se define a sí misma como "startup competition", quedan por debajo en "Viability"/"Business Plan".
  [INFERENCIA — la fuente no dice "penaliza", lo dice como factor de evaluación]
- F9: **"Fabricated users, metrics, revenue, partnerships or transactions may result in disqualification."**
  [LITERAL] Esto sí es explícito.

---

## C. REQUISITOS DE SUBMISSION

### C.1 Hackathon principal (Colosseum) — F3, [LITERAL]

El portal pide: "Hackathon builders should view their product submission as a pitch to Colosseum's
venture fund, other investors, and an application to our Accelerator."

- Nombre del producto + descripción breve
- Qué blockchains y qué herramientas se están integrando
- Todos los integrantes del equipo, con contexto de sus backgrounds y experiencia previa
- Dónde está ubicado el equipo
- Un logo o gráfico del producto
- **Link a un repositorio de GitHub.** Open-sourceTah encouraged, pero los repos privados se permiten
  si se le da acceso a `hackathon@colosseum.com` para revisión
- **Un video de presentación de dos a tres minutos.** "This is one of the first resources judges review,
  so it should be clear, concise, and high quality"
- **Un video de demo de producto de no más de tres minutos** explicando cómo funciona el producto
- Estrategia go-to-market, validación de demanda y planes de desarrollo de distribución

Restricción de idioma — F2 §12(a)(i) [LITERAL]: "**All Content must be in English**".

**Código en mainnet/devnet:** [FALTA] — ninguna fuente oficial encontrada dice si el código tiene que
estar deployado en mainnet, devnet o testnet. La FAQ solo pide que el video de demo muestre "cómo
funciona el producto" y la repo tenga "significant work during the hackathon".

### C.2 Track Argentina — requisitos ADICIONALES — F9, [LITERAL]

"**Your final submission must include:**"

1. **Working product and demo video.** A deployed link or accessible test environment, instructions for
   trying the product y un video corto mostrando la funcionalidad core.
2. **Repository and technical overview.** Link al repo o acceso privado para revisión + explicación breve
   de arquitectura, integración con Solana, dependencias clave y consideraciones de seguridad.
3. **Problem, users and validation.** Problema, usuarios objetivo, solución + **evidencia verificable**
   de user feedback, testing, usage, pilotos, compromisos de clientes, ingresos u otra validación.
4. **Progress and disclosures.** El registro de punto de partida + el changelog semanal. Identificar
   claramente: trabajo hecho durante la competencia, código o assets previos, componentes de terceros
   y open source, y **uso material de IA**.
5. **Team and roadmap.** Presentar el equipo, la contribución de cada miembro y próximos pasos prácticos.

**Y además, al unirse** [LITERAL]: "When joining, provide a brief record of the project's state at the
official competition start: existing product and code, users, revenue, funding, team responsibilities
and your first milestone. Keep a short weekly changelog so your progress can be reviewed."

**Shortlisted teams** [LITERAL]: "Shortlisted teams must also submit a **pitch deck** and present at
**Demo Day**. Presentation details will be shared with selected teams."

**Auditoría y riesgo** [LITERAL]: "Smart-contract and financial products must clearly state their audit
status, testing environment and known material risks. Demos must not expose users or funds to undisclosed risks."

### C.3 Actualizaciones semanales (Colosseum) — F3 [LITERAL]

"Weekly updates ... **aren't strictly required** for every participant, but we strongly recommend them
for anyone serious about competing. Each update should be a **concise, one-minute video** highlighting
progress and notable challenges from the previous week."

En la track Argentina el changelog semanal **sí** es requisito de submission (C.2, punto 4).

---

## D. REGLAS QUE DESCARTAN

### D.1 El código preexistente NO descalifica — pero la divulgación es obligatoria

Esto es lo más importante de todo el documento para un proyecto que empieza antes de la hackathon.
F3, [LITERAL]:

> "**Are Colosseum hackathons only for new products, and who is eligible to win?**
> Colosseum hackathons are for new startups that haven't raised significant outside capital. They're not
> intended for established companies that have been building the same product for years and have already
> raised venture funding.
>
> **Eligibility criteria:**
> - **Teams may begin development before the hackathon**, but products are judged only on the work
>   completed between the competition's start and end dates.
> - If you're an entrepreneur or developer building a new product that hasn't raised significant funding,
>   you may compete and be eligible to win.
> - **Builders may use pre-existing code**, but teams must disclose all relevant past development work
>   in the submission form.
>
> If a team misrepresents its product's development history or fails to disclose relevant information,
> Colosseum retains the sole right to:
> - Disqualify the team from the competition
> - Ban individual builders from participating in future Colosseum hackathons
> - Revoke prizes if applicable
>
> *'Pre-existing code' does not refer to open-source code developed by others. We encourage founders to
> compose with existing crypto protocols.*"

**Conclusión:** empezar antes está permitido. Usar código propio previo está permitido. Usar código
open-source de terceros está permitido y se promueve explícitamente. Lo que descalifica, banea y revoca premios es
**mentir u omitir** el historial.

Track Argentina, [LITERAL] (F9): "**Disclose your starting point.** Existing projects must clearly
identify prior development, users, revenue and funding, and distinguish these from work completed during
the competition."

### D.2 Descalificaciones explícitas del PDF legal (F2)

| Sección | Regla [LITERAL] |
|---|---|
| §3(a) | Edad: "the age of majority in their country of residence or **at least 18 years of age**, whichever is older". Si no cumple, puede escribir a `hello@colosseum.com` y lo decide caso por caso |
| §3(b) | **Excluidos por sanctions:** personas residing en *Afghanistan, Belarus, Cuba, Iran, North Korea, Russia, Somalia, Syria, Crimea/Sevastopol, Donetsk, Luhansk, Zaporizhzhia y Kherson (Ucrania), Venezuela, Yemen*; individuos/entidades sancionados por OFAC; empleados, contratistas, directores y oficiales del Administrador, de los Sponsors o sus afiliadas, y sus Immediate Family. **Argentina no está en la lista** [INFERENCIA directa de la lectura] |
| §3(c) | La participación no puede violar políticas del empleador ni obligaciones contractuales con terceros |
| §3(d) | Nulo donde esté prohibido por ley |
| §4(e) | Descalificación por tampering, violar las reglas, o conducta no deportiva o disruptiva |
| §6(a) | No registrarse antes de las 11:59pm PT del 12/10 → descalificado |
| §6(c) | No dar Profile Information + consentimiento expreso → descalificado |
| §6(d) | Profile Information que no cumpla §12 → descalificado |
| §7 | "Entrant may only be a Member of **one (1) Team**. A Team may only submit **one (1) Project Submission** at a time" |
| §12 | Restricciones de contenido: nada que viole derechos de terceros / IP / privacidad; nada que desacredite al Administrador; permiso de todos los que aparezcan; sin virus/malware; nada inapropiado, obsceno, odioso, difamatorio; nada que promueva_discriminación; nada ilegal ni que viole los términos de plataformas de video de terceros |
| §13 | Ganar está condicionado a firmar los Prize Acceptance Documents y **pasar la due diligence** del Administrador y/o de los Sponsors |
| F3 (Code of Conduct) | Colosseum puede descalificar a cualquier individuo o equipo que lo viole |

F3, additional [LITERAL]: "**May I submit multiple projects? No.** Each builder can submit only one
product and be part of only one team."

### D.3 Uso de IA

**Hackathon principal de Colosseum:** [FALTA] — no encontré ninguna regla sobre IA en el PDF legal ni
en la FAQ. Lo más cercano, F3, [LITERAL]: "We have backed non-technical founders in our Accelerator
who built MVPs entirely with AI coding tools." (contexto: es una señal positiva, no una regla)

**Track Argentina — SÍ hay regla explícita, F9, [LITERAL]:**
> "**AI-assisted development is welcome.** Teams must disclose material use, explain their own
> contribution and understand the product they submit."

Y es requisito de submission (C.2 punto 4): identificar "**material use of AI**".

**Conclusión:** la IA no descalifica en la track Argentina. Ocultarla sí es riesgo.

---

## E. ¿PIDE PRODUCTO FUNCIONANDO O SOLO PITCH?

**Pide producto funcionando. Explícitamente.**

Track Argentina, [LITERAL] (F9):
> "**Ideas can enter. Working products win.**"
> "Your final submission should include a **functional product or prototype that demonstrates the core
> user experience—not just a concept, landing page or pitch deck**."
> "You may join with an idea, but **a working product is required for the final submission**."

Y en "What we're looking for" [LITERAL]: "Build, speak with potential users, test your assumptions and
improve the product. Bring evidence appropriate to your stage: user feedback, active testers, pilots,
customer commitments, usage or revenue."

Hackathon principal, F2 §8(a) y (d) [LITERAL]: el criterio de evaluación #1 es
"**Functionality: How well does this Project Submission work?**" y el #4 es
"**UX: How well does this Project Submission utilize blockchain to create great UX for downstream users?**"
No se puede ganar un hackathon de Functionality y UX con un concepto.

**Implicación directa para un proyecto que todavía no compila** [INFERENCIA mía, no está escrito]:
el riesgo no es "que no tenga premio", es que con la fecha actual (2/10/2026) quedan **10 días**
(deadline 12/10 23:59 PDT) y el entregable exige, como mínimo, un producto o prototipo funcional +
video de demo + repo. Un concepto sin código no cumple el requisito #1 de C.2 ni el criterio (a)
de §8.

**Lo que la fuente NO exige y es fácil de asumir por error:** [FALTA] no se encontró que el código
tenga que estar en mainnet o devnet. La track Argentina pide "a deployed link **or accessible test
environment**", o sea que un entorno de test accesible cumple. [LITERAL de F9]

---

## F. REGISTRO

### F.1 Colosseum (obligatorio para todos) — F2 + F3

- **F2 §6(a)** [LITERAL]: "each Member must visit and register on the colosseum.com platform before
  11:59pm PT on October 12, 2026 and provide the requested information. After 11:59pm PT on October 12,
  2026, the individual registration form will be disabled and any Member who does not provide the
  requested information to Colosseum's reasonable satisfaction before then will be disqualified."
- **F2 §6(b)** [LITERAL]: "Each Team member must visit colosseum.com to register for the Contest and
  the **team leader** must upload the Project Submission before the end of the Entry Period."
- **F3** [LITERAL]: "If you are part of a team, **every team member must create an account**, and the
  team leader must add them during the product-submission process. The product-submission portal is
  available from the platform dashboard after you join the competition. To be eligible for prizes and
  Accelerator consideration, team leaders must complete the submission before the deadline."
- **F3** [LITERAL]: "You may submit a product as a **solo founder**."
- **Límite de equipos** — F3 [LITERAL]: "Only one product submission is allowed per team—and therefore
  one per individual—during each hackathon."
- **F1** [LITERAL]: el link de alta es https://colosseum.com/arena/hackathon/register?entry=worldsfair
  (redirige a creación de cuenta, ver F5).
- **Superteam Argentina** usa https://arena.colosseum.org/ como link de alta [F10].

**Cantidad máxima de integrantes:** [FALTA] — no está en el PDF legal, ni en la FAQ, ni en el listing.

### F.2 Track Argentina — 4 pasos, en orden — F10 [LITERAL]

1. **Registrate en el hub de Luma** — https://luma.com/3qmbyb6h (de ahí llega la agenda y las novedades)
2. **Registrate en Colosseum** — "Cada integrante del equipo crea su propia cuenta" — https://arena.colosseum.org/
3. **Anotá tu proyecto en el formulario** — https://forms.gle/Ej7sGChMBdW1p2WJ9
   "Lo carga **una sola persona por equipo** y después se puede actualizar. Nos sirve para acompañarte;
   **no reemplaza el registro ni la entrega en Colosseum**."
4. **Entregá en el track de Earn** — https://superteam.fun/earn/listing/colosseum-crypto-worlds-fair-hackathon-superteam-argentina-track

### F.3 Quién puede entrar a la track Argentina — F9 [LITERAL]

> "The track is open to **solo founders residing in Argentina** and **teams with at least one cofounder
> residing in Argentina**. You do not need to be based in Buenos Aires."

> "**Build on Solana.** Your submission must include a meaningful, functional Solana integration.
> Multichain products are welcome when Solana is part of the working product."

F9 también declara: "**Solo para builders en Argentina**" → el listing es regional:
"This listing is only open for people in [Argentina](https://superteam.fun/earn/regions/argentina)".

Contacto para preguntas: https://t.me/NicoFernandez17 [F9]

---

## G. LA TRACK ARGENTINA

### G.1 Qué es

**No es una hackathon separada.** Es un **sidetrack** sobre la hackathon Crypto World's Fair,
hospedado en Superteam Earn. [LITERAL F9: el listing lleva el badge
"CRYPTO WORLD'S FAIR TRACK — Submit to the side tracks of the latest Solana Global Hackathon"]

**Ojo con una contradicción de marketing:** F8 (Superteam Earn) la describe como
"the side tracks of the **latest Solana Global Hackathon**", pero F12 (blog de Colosseum, 3/9/2026,
[LITERAL]) dice que Crypto World's Fair es "the **first Colosseum competition open to all builders
across blockchain ecosystems**", y F3 [LITERAL] dice "Colosseum hackathons are open to builders across
**all** blockchain ecosystems". El copy de Earn quedó viejo o es un error. La hackathon no es solo de Solana.

**Y no confundir con las tracks de Colosseum.** F1 lista 8 tracks de ecosistema — Solana, Ethereum,
Hyperliquid, Base, Tempo, Arbitrum, Zcash, Robinhood Chain. **Argentina NO está entre ellas.** La
track Argentina es un sidetrack de Superteam, con su propio jurado y su propio premio, administered
por Superteam Argentina. [INFERENCIA: la separación sale de que Argentina no aparece en el listado de
tracks de Colosseum y sí aparece como listing en Superteam Earn con sponsor "Superteam Argentina"]

### G.2 Premio propio

**Total: 10.000 (la moneda está en disputa — ver abajo).** F9 [LITERAL]:

- 1.º puesto: **3.000**
- 2.º puesto: **2.000**
- 3.º puesto: **1.500**
- 4.º puesto: **1.000** (la página lo escribe "4rd Place", typo)
- 5.º puesto: **500**
- 4 bonos de **500** cada uno, adicionales a los cinco puestos:
  - **University Award** — 500
  - **Best Demo Day Pitch** — 500
  - **Best User Experience** — 500
  - **Most Traction** — 500

**Contradicción de moneda:**
- La tabla de premios de F9 muestra el token **USDG** (con link a CoinGecko GDN_USDG) y dice "10k Total Prizes" / "10k USDG".
- El encabezado de la sección de premios de F9 [LITERAL] dice "**Prize pool — 10,000 USDC**".
- F10 (superteam.ar) [LITERAL] dice "**10.000 USD** en premios" y "10.000 USD en 9 premios".

→ **USDG / USDC / USD.** [FALTA: no resolví cuál es el token real. Los tres aparecen en fuentes oficiales.]
Nota: USDG es un stablecoin de Global Dollar, distinto de USDC. [INFERENCIA]

### G.3 Requisitos: ¿difieren de la hackathon principal?

**Sí, son estrictamente más exigentes.** F9 [LITERAL]:

> "**Meet the official hackathon requirements.** Projects must comply with the applicable Crypto World's
> Fair rules, including registration, prior work, funding and submission requirements."

Diferencias concretas vs. Colosseum:

| | Colosseum principal | Track Argentina |
|---|---|---|
| Producto funcional | Exigido implícitamente (§8a "Functionality") | **Explícitamente exigido**, "not just a concept, landing page or pitch deck" |
| Build on Solana | No (cualquier chain o multichain) | **Sí**, "meaningful, functional Solana integration" |
| Residencia | Cualquiera (salvo lista de sanciones) | **Argentina** (1 cofounders radicado) |
| Pitch deck | No | **Sí**, para shortlisted teams |
| Demo Day | No mencionado | **Sí**, para shortlisted teams |
| Registro de punto de partida | "disclose all relevant past development work" | Registro formal al unirse + **changelog semanal** |
| Evidencia de validación | "demand validation" | **"verifiable evidence"** de feedback/testing/pilotos/ingresos |
| Divulgación de IA | [FALTA] | **Requerida**, "material use of AI" |
| Anti-fabricación | No explícita en el PDF | **Explícita**: "Fabricated users, metrics, revenue, partnerships or transactions may result in disqualification" |
| Auditoría / riesgos | No explícitos | **Requerido** para smart contracts y productos financieros |
| Ownership | "Entrants retain any intellectual property rights" (§9) | **Explícito**: "Teams retain ownership... non-exclusive permission to showcase... without transferring project ownership or authorizing publication of private code" |

### G.4 ¿Hay que entregar en DOS lugares?

**SÍ. Obligatorio.** [LITERAL F9]:
> "**Submit on both platforms.** Submit your project to Crypto World's Fair on Colosseum **and** to this
> Argentina track on Superteam Earn, meeting each platform's requirements and deadline."

[LITERAL F10]: "Para competir por los 10.000 USD, el proyecto también se entrega en Earn: **son dos
entregas, una en cada plataforma**." Y: "**Entregá en ambas plataformas para participar del track.**"

Y en "Participación notes" [LITERAL]: "Participation is subject to this listing, the applicable
Superteam Earn Terms and Privacy Policy, **and** the official Crypto World's Fair rules."

**Los requisitos NO son los mismos en los dos lados.** La entrega de Colosseum pide
video de presentación de 2–3 min + video de demo de ≤3 min + repo + GTM (C.1). La entrega de Earn pide
producto deployado/entorno testeable + overview técnico + validación + disclosures + roadmap (C.2).
Son listas distintas: hay que armar material para las dos. [INFERENCIA: comparando C.1 y C.2]

### G.5 Mentoría y soporte — F9 [LITERAL]

- "The **top ten shortlisted teams** will be offered an intensive mentorship week, **subject to mentor
  availability**, to strengthen their products and prepare for their final presentations."
- Soporte: "product and technical office hours, group workshops, resources and feedback on product
  positioning, demos and pitches."
- "Selected projects may also receive relevant ecosystem introductions and visibility through Superteam
  Argentina's channels."
- "Participation in the program does not guarantee a prize, investment, partnership or admission to
  another program."

Canales: https://luma.com/superteamar · https://t.me/superteamar · https://x.com/superteamar

Criterios de selección para la Mentorship Top Talent (F10, [LITERAL]) — ojo, estos son criterios de
**mentoría**, no de premio: "Compromiso · Ejecución · Entendimiento del problema · Avance del producto ·
Rol de Solana".

### G.6 Estructura temporal del programa Argentina (F10)

Cohorte **28/9 → 12/10/2026**. 5 puestos + 4 bonus. 9 premios. Online y en 7 ciudades. 4 etapas.
(LITERAL)

---

## H. PREMIOS DEL HACKATHON PRINCIPAL (contexto)

F1, [LITERAL]: "$840,000 in prizes and $2.5 million in seed funding".

F2 §14 [LITERAL], todo pagado en **Phantom CASH** (stablecoin):

| Premio | Monto | Cantidad de ganadores |
|---|---|---|
| Grand Champion | $30.000 | 1 |
| Public Goods Award | $5.000 | 1 |
| University Award | $5.000 | 1 |
| Standout teams | $15.000 c/u | 20 → $300.000 |
| Solana track | $100.000 | 10 |
| Tempo track | $100.000 | 10 |
| Hyperliquid track | $100.000 | 10 (Hypercore o HyperEVM) |
| Zcash track | $100.000 | 10 |
| Ethereum L1 track | $25.000 | 5 |
| Base track | $25.000 | 5 |
| Arbitrum track | $25.000 | 5 |
| Robinhood Chain track | $25.000 | 5 |

[Suma verificada: 30+5+5+300+400+100 = **$840.000**. Coincide con el headline de F1. [INFERENCIA aritmética]]

F1, [LITERAL]: los premios de track "are awarded **in addition to** the awards above".
F2 §14: "new awards may be added in the future".
F2 §15(b): "All prizes ... will be provided to the **Team Leader**. Each winning team may be required
to set up a wallet address, as directed by Administrator".
F2 §15(c): "The prizes are **non-transferable** and no substitution is permitted".

Aceleradora (F1, [LITERAL]): "All Hackathon winners will be interviewed and considered for Colosseum's
accelerator program. Accepted teams will receive: **$250,000 Pre-seed funding**, Network, Mentorship,
and 'Join us in San Francisco — For 12 weeks'."
→ El headline de "$2.5 million in seed funding" **no** está desglosado en la página. [INFERENCIA:
$250.000 × 10 equipos aceptados. El número 10 no está escrito en ninguna fuente que leí — FALTA]
F2 §13: ganar está condicionado a due diligence.

---

## FALTA — lo que NO pude confirmar

Cada ítem dice por qué no lo encontré.

1. **Fecha del Demo Day finalista del hackathon principal de Colosseum.** No existe en F1, F2, F3, F4.
   F2 no menciona Demo Day en ningún punto. F3 solo dice que el grupo final tiene una **entrevista Zoom
   de 15 minutos**, sin fecha.
2. **Fecha, lugar y formato del Demo Day para los shortlisted de la track Argentina.** F9 [LITERAL]:
   "Presentation details will be shared with selected teams" — o sea, no se publica.
3. **Si existe un Build Station del hackathon principal de Colosseum, y dónde/cuándo.** F3 solo
   remite a `solana.com/events`.
4. **Cantidad máxima de integrantes por equipo.** No está en F2, F3 ni F9.
5. **Si el código tiene que estar en mainnet, devnet o testnet.** Ninguna fuente oficial lo dice.
   Lo más cercano: F9 pide "a deployed link **or accessible test environment**".
6. **Reglas de IA del hackathon principal.** No hay ninguna mención en F2 ni en F3. Solo la track
   Argentina tiene política de IA, y es de permitir + divulgación.
7. **Ponderación / pesos de los criterios de evaluación.** Ni F2 §8 ni F3 dan porcentajes ni pesos.
8. **Criterios de evaluación específicos y publicados de la track Argentina.** F9 no publica una rúbrica.
   Los únicos criterios escritos (F10) son los de selección para la Mentorship, no los de premio.
9. **Las 6 respuestas del FAQ de F8** ("How are Sidetracks different from the main tracks?", "Do I
   need to submit separately to Sidetracks?", "When will Sidetrack winners be announced?", "Can I
   submit my project to multiple Sidetracks?", "What are the evaluation criteria for Sidetracks?",
   "Where can I find developer resources?"). **El contenido está detrás de un accordion client-side y no
   está en el HTML.** Lo intenté por 3 vías: markdown, rawHtml, y el endpoint tRPC (404). En
   particular **"¿puedo submitear a múltiples Sidetracks?" quedó sin responder.**
10. **Si un mismo proyecto puede ganarse el premio de Colosseum y el de la track Argentina.** FALTA.
    F2 §14 dice que los premios de track son "in addition to", pero no dice si hay tope ni si hay
    conflicto con el premio del Accelerator.
11. **Moneda real del premio de la track Argentina** (USDG vs USDC vs USD). Ver G.2.
12. **Si el deadline de la track Argentina en Earn es 12/10 23:59 ART o 13/10 03:59 ART.** Fuentes
    oficiales en contradicción. Ver A.5.
13. **Campos exactos del formulario de submission de Colosseum.** F5 (arena/hackathon) redirige a
    login. Lo único verificado es la lista del FAQ (F3, C.1), que puede estar desactualizada respecto
    del formulario real.
14. **Calendario del Accelerator en San Francisco** (las "12 semanas"). F1 no da fecha de inicio. FALTA.
15. **Contenido del formulario de Google Forms de Superteam Argentina** (paso 3 de F10). No lo abrí;
    es un Google Form que probablemente pida login. No verificado.
16. **Events en https://luma.com/superteamar.** F13 devuelve la página vacía (los eventos se cargan por
    JS). Las fechas de la Build Station que reporto salen de F10 y de los links de Luma individuales
    que figuraban en los resultados de búsqueda, no de F13 directamente.

---

## Contradicciones entre fuentes — resumen ejecutivo

| Tema | Fuente A | Fuente B | Cómo lo trato |
|---|---|---|---|
| Fecha de ganadores (principal) | F2 PDF: 5 de diciembre 2026 | F3 FAQ: "roughly one month after the deadline" (≈nov) | Reporto ambas. El PDF legal es el contractual, pero contradice la landing |
| Fecha de ganadores (Argentina) | F9 texto: 27/10/2026 | F9 dato interno + F10: 28/10/2026 | "antes del 28/10" |
| Deadline del track en Earn | F10: 12/10 23:59 ART | F9 campo interno: 13/10 06:59 UTC (= 13/10 03:59 ART) | Asumir el global de Colosseum |
| Inicio del concurso | F2 PDF: 6:00am PT | F9 campo `startDate`: 15:00 UTC = 8:00am PDT | Reporto el del PDF legal |
| Moneda del premio Argentina | F9 token: USDG | F9 texto: USDC; F10: USD | Sin resolver |
| Alcance de la hackathon | F8: "latest **Solana** Global Hackathon" | F3 + F12: abierta a **todas** las blockchains | El copy de Earn es erróneo o viejo |
| Total de premios | F1: $840.000 | (suma de F2 §14 = $840.000) | Consistente |