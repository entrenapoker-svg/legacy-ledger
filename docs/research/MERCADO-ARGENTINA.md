# Mercado argentino: tenedores, CEDEARs y tokenización de valores negociables

**Fecha de corte:** 2 de octubre de 2026
**Regla de este documento:** todo dato lleva fuente primaria con URL y fecha. Lo que no pude verificar contra una fuente primaria está marcado `FALTA`. Las fuentes secundarias (medios, blogs) están etiquetadas como tales.

---

## 1. Resumen ejecutivo — las 4 cifras defendibles

| Dato | Cifra | Fuente primaria | Fecha |
|---|---|---|---|
| Personas con cuenta comitente en el mercado de capitales | **12,3 millones** = 55% de la población económicamente activa | BYMA, informe 9 años | 02/07/2026 |
| Cuentas totales abiertas (no personas) | **24,6 millones** (+35% interanual) | BYMA, informe 9 años | 02/07/2026 |
| CEDEARs negociables listados por BYMA | **446 filas / 445 códigos únicos** | BYMA, listado oficial | 16/09/2026 |
| Comitentes con posición en CEDEARs | **más de 1 millón** (878 mil cuentas operaron en el último año) | BYMA, informe 9 años | 02/07/2026 |

Dato de contexto demográfico (primaria, INDEC Censo 2022 definitivos): la población de **65 años y más es el 11,9%** del total, y la **población económicamente activa es de 23.051.957 personas** (63,6% de los de 14 años y más).

Corrección importante: en versiones previas de este trabajo circuló "65+ = 15,9%". **Es incorrecto.** INDEC Censo 2022 da 11,9%. El 15,9% corresponde a otra serie del mismo documento y no a la población de 65 años y más.

---

## 2. La base de inversores ya existe y está medida

BYMA publicó el 02/07/2026 un informe con motivo de su noveno aniversario, con datos al **31 de mayo de 2026**. Es la mejor fuente primaria disponible sobre tenencia en el mercado de capitales argentino.

Fuente: https://www.byma.com.ar/newsroom/1-de-cada-2-personas-poblacion-economicamente-activa-tiene-cuenta-en-el-mercado-de-capitales

- **12,3 millones de personas** con cuenta comitente abierta en Caja de Valores. Equivale al **55% de la población económicamente activa** y a casi el **30% de la población total** del país.
- **24,6 millones de cuentas** al cierre de mayo de 2026, con crecimiento interanual del 35%.
- **1.087.847** cuentas operativas en promedio mensual (1 de cada 21 personas de la PEA invirtió todos los meses).
- **836.000** operaciones en promedio diario; en mayo de 2026 fue 5,6% más que el mismo mes del año anterior.
- Récord histórico de **1.628.916 operaciones en una sola jornada** en 2026.
- Volumen de órdenes: de 7,6 millones diarias en 2024 a 11,8 millones en 2025 y **más de 17,5 millones en 2026**.
- **ADTV (volumen diario promedio) de USD MEP 12.261 millones** al cierre de mayo de 2026, +1.866% contra el ADTV de 2018.
  - Renta fija: USD MEP 7.079 millones diarios (desde USD MEP 530,7 millones en 2018, +1.234%).
  - Renta variable: USD MEP 219,3 millones diarios (desde USD MEP 30,9 millones en 2017, +611%).
- **Composición geográfica:** el 47% de las cuentas estaba en el interior del país al cierre de mayo de 2026, frente al 41% en 2023. Córdoba, Santa Fe y Mendoza explican el crecimiento; el resto del interior representa el 25,5% de la base.
- **Composición de género:** las mujeres representan el 40% de la base de inversores y casi 1 de cada 2 cuentas nuevas. Participación femenina en cuentas nuevas: 37,6% (2023) → 39,3% (2024) → 43,6% (2025). Desde 2023 se abrieron 7,6 millones de cuentas por mujeres contra 10,8 millones por varones.
- **Financiamiento:** entre enero y junio de 2026 las ON concentraron cerca del 46% del financiamiento del mercado; los Pagarés, 24%; los Cheques de Pago Diferido, 21%.

### Por qué esto importa para un pitch

El mercado no tiene que ser creado desde cero: hay 12,3 millones de personas ya incorporadas al circuito, con crecimiento reciente y composición federal. El problema a resolver no es la apertura de la cuenta sino **la custodia y la custodia de ese patrimonio**.

---

## 3. CEDEARs: el instrumento más elegido

### 3.1 Cantidad y composición (listado oficial BYMA, 16/09/2026)

Fuente primaria: https://cdn.prod.website-files.com/6697a441a50c6b926e1972e0/6ab2a2889b5ecd166f88f930_2026-09-16-BYMA-CEDEARs.pdf

El PDF oficial "CEDEARs Negociables en BYMA", actualizado al 16/09/2026, fue leído y cruzado completo. Resultado:

- **446 filas de instrumento.**
- **445 códigos BYMA únicos.**
- Distribución por mercado del subyacente:

| Mercado | Cantidad |
|---|---|
| NYSE (excluye Arca y American) | 252 |
| NASDAQ (todas sus variantes: GS, GM, CM) | 117 |
| NYSE Arca | 35 |
| B3 (Brasil) | 19 |
| LSE (Largest Stock Exchange) | 6 |
| Frankfurt | 6 |
| CBOE | 4 |
| OTC US | 4 |
| OTC | 3 |
| NYSE American | 1 |
| XETRA | 1 |
| BOVESPA | 1 |
| New York | 1 |

**Advertencia sobre el dato fuente:** el PDF contiene al menos una inconsistencia interna. El código `XLU` aparece dos veces — una vez como "Utilities Select Sector SPDR Fund" (NYSE Arca, 15:1) y otra vez como "First Trust NASDAQ Cybersecurity" (NASDAQ, 10:1), que claramente es un error de tipeo en el original (el CEDEAR de ciberseguridad figura aparte bajo `CIBR`). También hay un ratio escrito como `10:01`. Por eso el conteo honesto es "446 filas, 445 códigos distintos" y no un número redondo único. `FALTA`: cantidad oficial de CEDEARs habilitadas según la CNV.

### 3.2 Quién los tiene

Mismo informe BYMA del 02/07/2026:

- **Más de 878 mil cuentas operaron CEDEARs durante el último año.**
- **Más de 1 millón de comitentes mantienen posiciones** en el instrumento.
- **Más de 4 de cada 10 operaciones en CEDEARs** se concentraron en empresas del sector tecnológico. Le siguen servicios financieros (19,8%), energía (13,2%) y materiales (10,0%).

Esto es un dato fuerte para el pitch: el comportamiento del inversor CEDEAR argentino ya es tech-heavy, con sesgo minorista y operatoria frecuente.

### 3.3 Novedades del listado

BYMA incorporationó **13 nuevos CEDEARs de acciones** emitidos por Banco Comafi, publicado el 02/09/2026.
Fuente: https://www.byma.com.ar/newsroom/nuevos-cedears-se-incorporan-a-byma

Como referencia de ritmo de ampliación, BYMA habilitó **19 nuevos CEDEARs** (14 de acciones + 5 de ETF) el 15/05/2025, también de Banco Comafi.
Fuente: https://www.byma.com.ar/newsroom/19-nuevos-cedears-habilitados-en-byma

`FALTA`: el volumen negociado en CEDEARs del primer semestre 2026 que se difundió como "USD 16.295 millones, +104% interanual". No logré localizar la página BYMA que lo respalda. Si se necesita, debe conseguirse del informe de resultados 2T 2026 o de BYMADATA.

### 3.4 No existe un CEDEAR tokenizado

No se encontró ninguna emisión de un CEDEAR representado digitalmente. Todas las RG habilitan el CEDEAR *como categoría tokenizable*, pero no hay evidencia de que se haya emitido uno. Esto es un hueco de mercado, no un dato faltante: la autorización existe (ver punto 5) y la emisión no.

---

## 4. Tokenización real en Argentina: un caso, con letra chica

### 4.1 Existe un bono soberano tokenizado

**wAL30rd**, token del bono soberano argentino **AL30** (vencimiento 2030), respaldado **1:1** por el bono real, operable 24/7.

Confirmado contra fuente primaria y abogado de la transacción:

- **Marval** (estudio que asesoró legalmente a Ripio en la operación), publicado el **02/10/2025**:
  https://www.marval.com/novedad/marval-asesora-en-la-primera-tokenizacion-de-un-bono-soberano-argentino-5172
- **Ripio Launchpad** (comunicación de la empresa), **18/09/2025**:
  https://launchpad.ripio.com/novedades/ripio-tokeniza-por-primera-vez-un-bono-soberano-en-blockchain
- **Nota de prensa de Ripio** fechada en Buenos Aires el 15/09/2025 (reproducida por Colombia Fintech, 19/09/2025):
  https://colombiafintech.co/2025/09/19/ripio-tokeniza-el-primer-bono-soberano-argentino

Características confirmadas por Marval y Ripio:

- Emisión bajo la **RG 1081 de la CNV**.
- El token **no es un valor negociable autónomo** y **no altera el instrumento tokenizado**, que sigue depositado de forma tradicional. El acceso al valor negociable queda en la forma tradicional; el token es la capa digital.
- Los holders **reciben la liquidación de intereses en la stablecoin USDT** dentro la app.
- Es **redimible por el bono original a través de un ALyC**.
- Se puede transferir entre **PSAV autorizados**.
- Ripio (Moonbird SRL) está inscripta como PSAV bajo las Resoluciones 994/2024 y 1058/2025, **Registro N° 36**.

Distribuidor secundario que lo ofrece al público: IOL Cripto powered by Ripio, con pago de cupón acreditado en cuenta.
Fuente secundaria/comercial: https://iolinversiones.com/criptomonedas/wal30rd — declara: "El token wAL30RD es una representación digital del Bono Soberano AL30, de conformidad con lo establecido en la RG 1081 CNV, sus modificatorias y complementarias."

Cobertura de prensa (secundaria, a favor): Forbes Argentina 19/12/2025; iProfesional 31/10/2025 (lanza de wARS y menciona wAL30rd); El Economista 15/09/2025.

**Conclusión:** la tokenización de valores negociables en Argentina no es teórica. Hay un instrumento real, con reseller regulado, cupón pagado y redemption. La tesis no es "si la tokenización funciona"; es que **sólo hay un activo tokenizado, y es un bono del Estado**.

### 4.2 Infraestructura de registro: BYMA Token Registry

BYMA ofrece **BYMA Token Registry**, servicio de **Registro de Titularidad de Activos Tokenizados**, a través de **BYMA Digital Assets**, entidad registrada como PSAV y especializada en activos digitales.

Fuente: https://www.byma.com.ar/ (sección "Servicios para activos digitales")

Esto es importante: el exchange más grande del país no se quedó mirando. Tiene producto de registro de titularidad tokenizada. `FALTA`: documentación pública de BYMA Token Registry — condiciones, costo, si ya tiene registros emitidos.

### 4.3 El marco regulatorio, norma por norma

Todas las RG son de la CNV, publicadas en el Boletín Oficial.

| Norma | Fecha | Qué hizo |
|---|---|---|
| **Ley 27.739** | 2024 | Art. 4° bis: incorpora los **Proveedores de Servicios de Activos Virtuales (PSAV)** al régimen de la Ley de Lavado de Activos. Es la base legal del registro de PSAV. |
| **RG 1069** | 13/06/2025 | Primera etapa: representación digital de **algunos** valores negociables con oferta pública. |
| **RG 1081** | 21/08/2025 | Segunda etapa: **amplía** los valores negociables tokenizables. Sandbox hasta el 21/08/2026. Fue el marco del wAL30rd. |
| **RG 1087** | oct/2025 | Admite tokenizar valores negociables emitidos bajo **Regímenes de Autorización Automática**. |
| **RG 1125** | 2025 | Esquemas de colocación de **financiamiento colectivo**, con participación de inversores no calificados bajo límites verificables. |
| **RG 1142 / 1143** | 2026 | Incorporan **CEVA ETP** y **FCIA ETF** como instrumentos, también representables digitalmente. |
| **RG 1145 / 1146 / 1148** | 2026 | Extienden los Regímenes de Oferta Pública con Autorización Automática a **acciones, ON, fideicomisos financieros y FCI cerrados**, y crean el Régimen de Autorización Automática de **Mediano Impacto Ampliado**. |
| **RG 1137** | 2026 | Consulta pública del proyecto que después fue la RG 1150. |
| **RG 1150** | sanción 10/06/2026, B.O. 11/06/2026, N° 35928 p. 72 | **Norma vigente.** Amplía el universo tokenizable y **prorroga el sandbox hasta el 31/12/2027**. |

Fuente primaria de la RG 1150 (texto íntegro):
https://www.argentina.gob.ar/normativa/nacional/norma-426586/texto

### 4.4 Qué permite hoy la RG 1150 (texto verbatim, art. 1)

La tokenización es admisible para:

- **a) acciones** (incluidas con doble listado)
- **b) obligaciones negociables**
- **c) CEDEARS**
- **d) valores representativos de deuda o certificados de participación de fideicomisos financieros** con oferta pública
- **e) cuotapartes de fondos comunes de inversión cerrados** con oferta pública
- **f) cuotapartes de FCIA ETF**
- **g) CEVA ETP**

Más: los valores negociables emitidos bajo Regímenes de Oferta Pública con **Autorización Automática** (acciones, ON, VRD/FF y cuotapartes de FCI cerrados), **excepto los regímenes aplicables a los FCIA**.

### 4.5 Las cinco trabas que importan en un pitch

Están en el texto de la RG 1150 y conviene no esconderlas:

1. **Depósito obligatorio en el ADCVN** (art. 5.b): los valores negociables deben estar depositados a nombre de uno o más titulares registrales en Caja de Valores, en cuenta individualmente identificada por cuenta de terceros. No hay tokenización "al vacío".
2. **Máximo de CINCO (5) PSAV** por emisión (art. 5.e). No se puede abrir una[id] de liquidez ilimitada.
3. **Prohibición de transferir o negociar fuera de los PSAV intervinientes y prohibición de protocolos DeFi** (art. 5.f). Los contratos inteligentes deben impedirlo. Esto cierra la puerta a componer con DeFi.
4. **Certificado de tenencia bajo demanda** (art. 28): el inversor puede pedirle al PSAV el certificado emitido por el ADCVN, con efectos de valor anotado en cuenta. **Este artículo es el que hace posible hablar de herencia**: existe un documento de tenencia respaldado por el custodio central.
5. **No se tokenizan SVS ni valores vinculados a sostenibilidad** (art. 1), ni deuda pública extranjera salvo soberanos de MERCOSUR y Chile.

Además, el sandbox **vence el 31/12/2027**: después de esa fecha no se pueden emitir nuevas representaciones digitales bajo este régimen, salvo prórroga que la CNV evaluará. Las autorizaciones ya otorgadas que no se usen en 2 años se expulsan de pleno derecho.

### 4.6 Lo que no se encontró

- **Ningún CEDEAR tokenizado emitido.** Verificado por ausencia, no por fuente que lo diga.
- **Ninguna acción tokenizada emitida.**
- **Fideicomiso financiero tokenizado de Landtoken**: no pude confirmar con fuente primaria. `FALTA`.
- **tokeniAr**: es una plataforma comercial; no es evidencia de emisión. No seinvestigó en profundidad.

---

## 5. Fiscalidad: el régimen que simplificó y el que todavía no resuelve la herencia

### 5.1 Declaración jurada simplificada de Ganancias

- **Ley 27.799** (Régimen Penal Tributario), **Cap. III, Título II — "Régimen de Declaración Jurada Simplificada"**, **art. 38**. Aplicable a **personas humanas y sucesiones indivisas residentes en el país** que opten por la modalidad simplificada.
  Requisito principal: ingresos totales gravados, exentos y/o no gravados de **hasta $1.000.000.000** (mil millones de pesos), y condición temporal verificable.
  Efecto: aceptada y pagada en término la declaración precargada por ARCA, hay **efecto liberatorio** del período y **presunción de exactitud sin admitir prueba en contrario** para períodos no prescriptos, salvo que ARCA detecte discrepancia significativa.
  Fuente primaria: https://servicios.infoleg.gob.ar/infolegInternet/anexos/420000-424999/422008/norma.htm
  Publicada en BO el **02/01/2026** (N° 10/26): https://www.boletinoficial.gob.ar/detalleAviso/primera/337029/20260102

- **Decreto 93/2026** (P.E.N.), sancionado **08/02/2026**, publicado **09/02/2026**. Aprueba la reglamentación del Cap. III del Título II de la Ley 27.799.
  https://servicios.infoleg.gob.ar/infolegInternet/anexos/420000-424999/423013/norma.htm

- **ARCA Resolución General 5820/2026**, **09/02/2026**: procedimiento de adhesión, ratificación anual, desistimiento y exclusión.
  La adhesión se hace por clave fiscal "Sistema Registral", opción "Ganancias PH Simplificada". Se puede adherir para períodos iniciados desde el **1/1/2025**. El sistema emite constancia de inscripción con código de caracterización **639-Ganancias Simplificado Ley 27799**.
  https://www.arca.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/simplificada/adhesion.asp

- **CNV RG 1108/2026**: adecúa la normativa de la CNV a la Ley 27.799 y al Decreto 93/2026. Permite a los adherents del régimen aplicar fondos y activos en el mercado de capitales o con PSAVs: depósitos en cuentas de ALyC/agentes/PSAV; transferencias de valores negociables desde y hacia subcuentas comitentes; **y transferencias de Activos Virtuales desde y hacia cuentas en PSAV inscriptos en la CNV**, siempre que las jurisdicciones de origen no estén en el listado de jurisdicciones no cooperantes (Anexo Decreto 862/2019) ni sean de Alto Riesgo para el GAFI.
  https://www.argentina.gob.ar/noticias/reglamentacion-del-regimen-de-inocencia-fiscal-en-el-mercado-de-capitales-y-en-el-ambito-de

### 5.2 El punto ciego: herencias de criptoactivos

**No existe, a la fecha de este documento, una norma argentina específica sobre sucesión testamentaria de criptoactivos.** No se localizó ninguna ley, resolución de la CNV, resolución de ARCA/UIF ni fallo judicial de referencia que resuelva laInspector heredar o liquidar criptoactivos o tokens.

Lo que sí existe y es aprovechable:

1. **Sucesiones indivisas están expresamente contempladas** en el art. 38 de la Ley 27.799 y en el régimen del Decreto 93/2026 / RG 5820. Es el único punto de apoyo legal explícito que encontré para el(strategy) de "herederos de clase media alta".
2. **Las sucesiones indivisas son contribuyentes del Impuesto a las Ganancias** (Ley 27.430, texto ordenado 1997 y mod.), artículo 1 y artículo 33. El artículo 19° regula cómo se establecen las ganancias netas de fuente argentina de personas humanas y sucesiones indivisas residentes; el artículo 90 y ss. regulan el tratamiento de diferencias de precio en emisiones o adquisiciones a precios distintos del valor nominal residual para personas humanas y sucesiones indivisas, con imputación conforme a los incisos c) y d) del artículo 2° sin número.
   Fuente primaria: https://www.boletinoficial.gob.ar/pdf/aviso/primera/176831/20220520
3. **El certificado de tenencia de la RG 1150 (art. 28)** es la pieza que permite transferir un activo tokenizado a un heredero sin inventar: es un documento emitido por el ADCVN, endosado por el titular registral, con efectos de valor anotado en cuenta o escritural. Cualquier propuesta de sucesión sobre estos activos debe apoyarse en ese certificado, no en el token.

`FALTA`: criterio de ARCA y de la CNV sobre (**a**) cómo se declara criptoactivos heredados, (**b**) cómo se valuía a fecha de muerte, (**c**) qué pasa con el proceso de tokens caídos en una wallet propia, sin custodio identificado. No hay respuesta pública localizada.

---

## 6. Mercado cripto en Argentina

Fuente primaria de industria: Chainalysis.

- **Índice Global de Adopción de Criptomonedas 2026**, publicado el **23/09/2026**:
  https://www.chainalysis.com/blog/2026-global-crypto-adoption-index
- **América Latina 2026**:
  https://www.chainalysis.com/blog/latin-america-crypto-adoption-2026/

Lo verificado:

- En la tabla estática del top 20 global del informe de 2026, **Argentina no aparece**. La lista termina con Türkiye en el puesto 20. **El puesto exacto de Argentina no es recuperable de la versión estática** porque el ranking se expone en un mapa interactivo que no se renderiza en el texto.
- El informe para América Latina reporta para Argentina **US$88.500 millones de actividad**, **segundo lugar regional**, con un **crecimiento de 15,3%**, en una ventana de 12 meses terminada el **30/06/2026**.
- La metodología del índice 2026 cambió respecto de 2025. Cualquier comparación con un ranking previo de Argentina no es válida sin ajuste. `FALTA`: el puesto exacto y la metodología de ese año.

`FALTA`: **cantidad de holders o usuarios de cripto en Argentina.** No existe cifra primaria. Cualquier número que circule en un pitch (incluidos los "1,2 millones de holders") no tiene respaldo en fuente oficial localizada. No usar.

`FALTA`: **total de actividad cripto global en volumen de dólares.** No verificado contra la fuente primaria en esta ronda.

---

## 7. Demografía y ahorro — datos primarios INDEC

Fuente: Censo Nacional de Población, Hogares y Viviendas 2022, resultados definitivos (publicados por INDEC).

- **Población total:** 46.377.949 habitantes (resultados definitivos del Censo 2022).
- **Población de 65 años y más: 11,9%** del total. Es el crecimiento del grupo más grande de la historia demográfica argentina: era 2,3% en 1914, 7,0% en 1970.
- **Grupos de edad (2022):** 0-14 años 22,0%; 15-64 años 66,1%; 65 años y más 11,9%.
- **Edad mediana de la población: 31 años.** Bajó desde 39,6 (1991), 33,2 (2001), 31 (2010) — la serie del documento es 1991: 39,6 / 2001: 33,2 / 2010: 31,0 / 2022: 31 años, con 65,1 en 1980 y 50,5 en 1970.
- **Índice de envejecimiento:** 53 personas de 65 y más por cada 100 de entre 0 y 14 años.
- **Índice de sobreenvejecimiento:** 10,4 personas de 85 años y más por cada 100 de 65 y más (era 5,0 en 1970).
- **Índice de feminidad de la población de 65 años y más:** en el grupo de 85 años y más había **228 mujeres por cada 100 varones**. En el total de 65+ la proporción es 131 mujeres por cada 100 varones.
- **Población económicamente activa:** 23.051.957 personas (63,6% de la población de 14 años y más). Población no económicamente activa: 13.207.419 (36,4%).

Fuentes primarias:
- https://www.indec.gob.ar/ftp/cuadros/poblacion/censo2022_indicadores_demograficos.pdf
- https://www.indec.gob.ar/ftp/cuadros/poblacion/dosier_personas_mayores_2024.pdf
- https://www.indec.gob.ar/ftp/cuadros/poblacion/censo2022_caracteristicas_economicas.pdf
- Cuadros en .xlsx: https://censo.gob.ar/index.php/datos_definitivos_total_pais (página de publicación: 03/06/2026 para los cuadros por gobierno local)

**Para el pitch:** el 11,9% de 65 y más, con edad mediana de 31 años y 1 de cada 2 personas de la PEA ya en el mercado de capitales, define un mercado de sucesión grande, con activos en CEDEARs, y una brecha de custodia real.

`FALTA`: tenencia de acciones por grupo etario y "cultura de ahorro" con metodología explícita. El Censo 2022 pregunta por condición de actividad y PORQUE, no por tenencia de activos. No hay fuente primaria directa.

---

## 8. FALTA — verificar antes del pitch

Lista consolidada de lo que **no** está verificado con fuente primaria y **no** debe afirmarse:

1. **Cantidad de holders / usuarios de cripto en Argentina.** Sin fuente primaria. No usar ningún número.
2. **Puesto exacto de Argentina en el Chainalysis 2026.** Solo se puede afirmar que quedó fuera del top 20 global.
3. **Total de actividad cripto global en USD.** No verificado.
4. **Volumen negociado en CEDEARs 1S2026 ("USD 16.295 millones, +104%")** y cualquier porcentaje de CEDEARs sobre el volumen total del mercado. No localicé la página BYMA que lo respalda.
5. **Cantidad oficial de CEDEARs habilitadas según la CNV.** El conteo propio da 446 filas / 445 códigos sobre un PDF con errores internos.
6. **Fideicomiso financiero tokenizado de Landtoken** (diciembre 2025). Sin fuente primaria localizada.
7. **Existencia de algún CEDEAR o acción tokenizada emitida.** No encontrada; la autorización regulatoria existe pero no hallé evidencia de emisión.
8. **Criterio fiscal y judicial sobre sucesión de criptoactivos.** No hay norma específica localizada.
9. **Cantidad de PSAV inscriptos en la CNV.** El registro es dinámico y la extracción automatizada devolvió totales inconsistentes. El único dato duro recuperado: Ripio (Moonbird SRL) figura con Registro N° 36.
10. **Documentación de BYMA Token Registry.** Si existe producto en producción, condiciones y costo.
11. **Evaluación de FATF específica sobre Argentina.** Sólo se localizó el informe general de junio de 2025, que no trae evaluación país.
12. **Cifras de tenencia de CEDEARs por edad o perfil.** BYMA publica sector y cantidad de cuentas, no edad.

---

## 9. Índice de fuentes

### Primarias — normativa
| Fuente | URL | Fecha |
|---|---|---|
| RG 1150/2026 CNV (texto íntegro) | https://www.argentina.gob.ar/normativa/nacional/norma-426586/texto | sanción 10/06/2026, B.O. 11/06/2026 |
| RG 1108/2026 CNV (nota oficial) | https://www.argentina.gob.ar/noticias/reglamentacion-del-regimen-de-inocencia-fiscal-en-el-mercado-de-capitales-y-en-el-ambito-de | 19/02/2026 |
| RG 1081/2025 CNV (BO) | https://www.boletinoficial.gob.ar/detalleAviso/primera/330173/20250821 | 21/08/2025 |
| Ampliación del régimen de tokenización (Presidencia) | https://www.argentina.gob.ar/noticias/ampliacion-del-regimen-de-tokenizacion-valores-negociables-con-oferta-publica-automatica-y | 2026 |
| Ley 27.799 (InfoLEG) | https://servicios.infoleg.gob.ar/infolegInternet/anexos/420000-424999/422008/norma.htm | B.O. 02/01/2026 |
| Decreto 93/2026 (InfoLEG) | https://servicios.infoleg.gob.ar/infolegInternet/anexos/420000-424999/423013/norma.htm | 08/02/2026, B.O. 09/02/2026 |
| ARCA, adhesión al régimen simplificado | https://www.arca.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/simplificada/adhesion.asp | vigente 2026 |
| Ley de Ganancias 27.430 (BO) | https://www.boletinoficial.gob.ar/pdf/aviso/primera/176831/20220520 | 2018 (texto ordenado) |

### Primarias — mercado
| Fuente | URL | Fecha |
|---|---|---|
| BYMA, informe 9 años (base de inversores) | https://www.byma.com.ar/newsroom/1-de-cada-2-personas-poblacion-economicamente-activa-tiene-cuenta-en-el-mercado-de-capitales | 02/07/2026 |
| BYMA, listado oficial de CEDEARs (PDF) | https://cdn.prod.website-files.com/6697a441a50c6b926e1972e0/6ab2a2889b5ecd166f88f930_2026-09-16-BYMA-CEDEARs.pdf | 16/09/2026 |
| BYMA, 13 nuevos CEDEARs | https://www.byma.com.ar/newsroom/nuevos-cedears-se-incorporan-a-byma | 02/09/2026 |
| BYMA, 19 nuevos CEDEARs | https://www.byma.com.ar/newsroom/19-nuevos-cedears-habilitados-en-byma | 15/05/2025 |
| BYMA, sitio (BYMA Token Registry) | https://www.byma.com.ar/ | vigente |

### Primarias — tokenización
| Fuente | URL | Fecha |
|---|---|---|
| Marval, asesoría en la tokenización del AL30 | https://www.marval.com/novedad/marval-asesora-en-la-primera-tokenizacion-de-un-bono-soberano-argentino-5172 | 02/10/2025 |
| Ripio Launchpad, tokenización del AL30 | https://launchpad.ripio.com/novedades/ripio-tokeniza-por-primera-vez-un-bono-soberano-en-blockchain | 18/09/2025 |
| Ripio, nota de prensa (vía Colombia Fintech) | https://colombiafintech.co/2025/09/19/ripio-tokeniza-el-primer-bono-soberano-argentino | 15/09/2025 (publicado 19/09/2025) |

### Primarias — industria y estadística
| Fuente | URL | Fecha |
|---|---|---|
| Chainalysis, índice global 2026 | https://www.chainalysis.com/blog/2026-global-crypto-adoption-index | 23/09/2026 |
| Chainalysis, América Latina 2026 | https://www.chainalysis.com/blog/latin-america-crypto-adoption-2026 | 2026 (datos a 30/06/2026) |
| INDEC, indicadores demográficos Censo 2022 | https://www.indec.gob.ar/ftp/cuadros/poblacion/censo2022_indicadores_demograficos.pdf | definitivos 2023 |
| INDEC, dosier personas mayores 2024 | https://www.indec.gob.ar/ftp/cuadros/poblacion/dosier_personas_mayores_2024.pdf | 2024 |
| INDEC, características económicas Censo 2022 | https://www.indec.gob.ar/ftp/cuadros/poblacion/censo2022_caracteristicas_economicas.pdf | 15/02/2024 |
| INDEC, cuadros en xlsx | https://censo.gob.ar/index.php/datos_definitivos_total_pais | 03/06/2026 |

### Secundarias — a favor, no primary
| Fuente | URL | Fecha | Nota |
|---|---|---|---|
| Forbes Argentina | https://www.forbesargentina.com/brandvoice/ripio-bono-soberano-argentino-tokenizado-revolucion-acerca-cripto-mercado-financiero-tradicional-n83620 | 19/12/2025 | Brand voice (Ripio). Repetir cifra "24 millones de usuarios" desde acá no es válido. |
| iProfesional | https://www.iprofesional.com/tecnologia/440867-ripio-lanza-wars-stablecoin-de-peso-argentino-para-pagos-digitales | 31/10/2025 | cifras de usuarios no verificadas |
| El Economista | https://eleconomista.com.ar/economia/revolucion-mercado-bono-mas-popular-ahora-compra-como-cripto-n88556 | 15/09/2025 |.Nota periodística |
| IOL Cripto (comercial) | https://iolinversiones.com/criptecoinversiones/wal30rd | vigente | Documento legal del producto; útil para el disclaimer |

---

## 10. Las tres conclusiones que sobreviven al filtro

1. **El mercado ya está.`** 12,3 millones de personas (55% de la PEA) tienen cuenta comitente; más de 1 millón tienen posición en CEDEARs. No hace falta crear el inversor.
2. **La tokenización tiene un solo precedente real, y es del Estado.** `wAL30rd` existe, está respaldado 1:1 por AL30, paga cupón en USDT, se transfiere entre PSAV y se redime por ALyC. El marco lo permite para CEDEARs, ON, acciones y FCI cerrados — y no hay emisión de ninguna de esas categorías.
3. **La letra chica es la opportunity y el riesgo a la vez.** Depósito obligatorio en ADCVN, máximo 5 PSAV, prohibición de DeFi, sandbox que vence 31/12/2027. Cualquier propuesta que prometa liquidez componiendo con DeFi choca contra el artículo 5.f de la RG 1150.

### Qué decide el pitch

La brecha no es de activo: es de **titularidad, custodia y herencia** sobre activos que ya están en manos de más de un millón de argentinos. La RG 1150 acaba de crear el certificado de tenencia (art. 28) que hace posible hablar de heredar sin inventar. Lo que no existe todavía es el criterio fiscal y judicial para declarar y liquidar criptoactivos heredados: ahí está el `FALTA` más grande del trabajo, y probablemente el espacio del proyecto.
