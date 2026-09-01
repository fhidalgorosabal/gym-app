# Plan — Mejora manual de los nombres de ejercicios

> ✅ **COMPLETADO (2026-09-01).** Los 1324/1324 nombres quedaron revisados a mano en es/pt-BR
> e **incrustados en `public/data/exercises.json`** (`name_i18n`). El andamiaje de generación
> (`scripts/name-overrides.json`, `scripts/generate-name-i18n.py`, `scripts/lote.py`) se
> **eliminó** tras terminar, para no dejar archivos sin uso. Este documento se conserva como
> **registro histórico**: la guía de estilo y las decisiones siguen siendo la referencia si algún
> día se reeditan nombres. Los comandos `python3 scripts/...` de abajo ya no existen; para
> reeditar un nombre puntual, editar `name_i18n` del ejercicio directamente en el JSON.

Revisión **manual asistida** de los nombres de los 1324 ejercicios (`name_i18n`), para que
identifiquen bien cada ejercicio en **es** y **pt-BR**. Sustituye la calidad media de la
Vía 2 (sustitución palabra-por-palabra) por nombres correctos, con buen orden y concordancia.

> Complementa a `plan-traduccion-datos.md`. Este plan es la **Etapa E** (pulido de nombres).

---

## Por qué manual y por qué en lotes

La Vía 2 traduce palabra por palabra manteniendo el orden inglés → nombres antinaturales:
- `alternate lateral pulldown` → "Alterno lateral jalón" (correcto: *"Jalón lateral alternado"*)
- `ankle circles` → "Tobillo círculos" (correcto: *"Círculos de tobillo"*)
- `3/4 sit-up` → "3/4 abdominal" (correcto: *"Abdominal a 3/4"*)

El español necesita **reordenar** (sustantivo primero) y **añadir preposiciones/concordancia**,
cosa que una sustitución 1:1 nunca hará bien. Se corrige **a mano**, revisando cada ejercicio.

**Ritmo:** lotes de **5 ejercicios similares** por sesión. Se avanza poco a poco (varios días).
Los ejercicios se agrupan por grupo muscular y comparten estructura → revisarlos juntos es
rápido y consistente (una decisión de estilo sirve para los 5).

---

## Cómo funciona técnicamente (para no perder el trabajo)

Se introduce un archivo de **overrides** con las correcciones manuales. Prioridad de resolución
del nombre para cada ejercicio:

```
override manual  >  (fallback) generación automática Vía 2  >  inglés
```

- Archivo nuevo: **`scripts/name-overrides.json`** — mapa `id → { es, "pt-BR" }`.
- El generador (`generate-name-i18n.py`) se ajusta para que, al escribir `name_i18n`,
  **respete el override si existe** ese `id`; si no, usa la traducción automática actual.
- Así, re-correr el script **nunca pisa** lo ya revisado. El trabajo es incremental y seguro.

> Tarea previa (una sola vez, ver Etapa 0): añadir el soporte de overrides al script.
> Hasta entonces, el plan puede ejecutarse igual anotando las correcciones en el override;
> se aplican en cuanto el script las soporte.

---

## Orden de ataque (por grupo muscular)

De mayor a menor cantidad. Cada grupo se parte en lotes de **10** (último lote puede ser < 10).

> Nota: los lotes 1–11 de waist se hicieron con tamaño 5 (55 ejercicios). Desde entonces el
> tamaño de lote es **10** (`scripts/lote.py`, configurable con `BATCH=`). Esos 55 equivalen
> a los lotes 1–5 (de 10) + primera mitad del lote 6 de waist.

| # | body_part (grupo) | Ejercicios | Lotes de 10 | Estado |
|---|-------------------|-----------:|-----------:|--------|
| 1 | waist (abdomen/cintura) | 169 | 17 | ✅ completo |
| 2 | chest (pecho) | 163 | 17 | ✅ completo |
| 3 | back (espalda) | 203 | 21 | ✅ completo |
| 4 | shoulders (hombros) | 143 | 15 | ✅ completo |
| 5 | upper arms (brazos) | 292 | 30 | ✅ completo |
| 6 | lower arms (antebrazos) | 37 | 4 | ✅ completo |
| 7 | upper legs (piernas) | 227 | 23 | ✅ completo |
| 8 | lower legs (pantorrillas) | 59 | 6 | ✅ completo |
| 9 | cardio | 29 | 3 | ✅ completo |
| 10 | neck (cuello) | 2 | 1 | ✅ completo |
| | **TOTAL** | **1324** | **~137** | **✅ 1324/1324** |

> Se empieza por **waist** por ser un grupo mediano y con nombres representativos (buen piloto).
> El orden es sugerido; se puede reordenar según prioridad de uso real.

---

## Procedimiento por lote (10 ejercicios)

Repetir en cada sesión. Un lote = 10 ejercicios del grupo activo, en orden del JSON.

1. **Listar el lote.** Mostrar los ejercicios con: `id`, `name` (en), `name_i18n` actual
   (es / pt-BR), y contexto útil (`target`, `equipment`, `body_part`). Comando de apoyo:
   ```bash
   python3 scripts/lote.py waist 6     # grupo + número de lote (1-based)
   ```

2. **Analizar juntos los 5.** Como son similares, acordar el criterio de estilo del subgrupo
   (p. ej. cómo nombrar "sit-up", "crunch", el equipamiento, etc.). Ver la sección
   **Guía de estilo** más abajo.

3. **Proponer el nombre corregido** de cada uno en es y pt-BR. Revisión humana obligatoria:
   el usuario confirma o ajusta cada uno.

4. **Guardar en `scripts/name-overrides.json`** las 5 entradas confirmadas (`id → {es, pt-BR}`).

5. **Regenerar y verificar:**
   ```bash
   python3 scripts/generate-name-i18n.py     # aplica overrides + fallback
   npm run build                              # que compile
   ```
   Opcional en móvil: `npx cap sync android`.

6. **Marcar el lote** como hecho en la tabla de progreso de este archivo (abajo).

**Regla de oro:** no avanzar al siguiente lote hasta que los 5 del actual estén confirmados y
guardados. Poco a poco, sin prisa. Mejor 5 perfectos que 50 mediocres.

---

## Guía de estilo (acordar y respetar)

Convenciones para que todos los lotes queden coherentes. Se irá ampliando con cada grupo.

- **Orden:** sustantivo (ejercicio) primero, luego modificadores.
  `Jalón lateral alternado`, no "Alterno lateral jalón".
- **Preposiciones:** usar "de", "con", "en" donde el español lo pide.
  `Círculos de tobillo`, `Curl con mancuerna`, `Fondo en paralelas`.
- **Equipamiento:** `con mancuerna(s)`, `con barra`, `en polea`, `en máquina`, `con pesa rusa`.
- **Concordancia:** género y número correctos (`elevación lateral`, `elevaciones laterales`).
- **Términos que se mantienen:** `curl`, `press`, `crunch`, `burpee`, `plank`→plancha,
  `deadlift`→peso muerto, `row`→remo, marcas/nombres propios (Arnold, Zottman, Bulgarian…).
- **Nombres fitness reconocidos se mantienen tal cual:** `v-up`, `sit-up`→abdominal,
  `russian twist`→giro ruso, etc. (decisión del usuario: no forzar traducción descriptiva
  cuando el término fitness es de uso común).
- **Términos de calistenia se mantienen tal cual** (nombres internacionales sin traducción de
  uso común): `planche`, `front lever`, `back lever`, `maltese`, `human flag`→bandera humana,
  `dead bug`, `curl-up`, `l-sit`, `landmine`, `v-sit`.
- **Fracciones/ángulos:** `3/4 sit-up` → *"Abdominal a 3/4"*; `45° side bend` → *"Flexión lateral a 45°"*.
- **Género del sujeto:** el sufijo "(male)/(female)" del dataset → **por defecto se omite**;
  PERO cuando existe la **pareja male+female del mismo ejercicio** (dos entradas), se mantiene
  el marcador traducido "(hombre)/(mujer)" en es y "(homem)/(mulher)" en pt-BR para que no
  queden dos nombres idénticos. Si solo hay uno de los dos, se omite.
- **pt-BR:** mismas reglas con vocabulario propio (`agachamento`, `supino`, `rosca`, `remada`,
  `flexão`, `prancha`, `levantamento terra`…).
- **Pecho (chest):** `bench press` → es *"press de banca"*, pt-BR *"supino"*; `chest dip` →
  *"fondo de pecho"* / *"mergulho de peito"*; `chest press` → *"press de pecho"* / *"supino de peito"*.
- **Espalda (back):** `pulldown` → *"jalón"* / *"puxada"*; `pull-up` → *"dominada"* / *"barra"*;
  `chin-up` → *"dominada supina"* / *"barra supinada"*; `row` → *"remo"* / *"remada"*;
  `shrug` → *"encogimiento"* / *"encolhimento"*; `deadlift` → *"peso muerto"* / *"levantamento terra"*.
- **Hombros (shoulders):** `shoulder press` / `overhead press` → es *"press de hombros"* /
  *"press sobre la cabeza"*, pt-BR *"desenvolvimento"*; `military press` → *"press militar"* /
  *"desenvolvimento militar"*; `raise` → *"elevación"* / *"elevação"*; `thruster` se mantiene.
- **Brazos (upper arms):** `curl` → es *"curl"*, pt-BR *"rosca"*; `triceps extension` →
  *"extensión de tríceps"* / *"extensão de tríceps"*; `triceps dip` → *"fondo de tríceps"* /
  *"mergulho de tríceps"*; `skull crusher`/`skull press` → *"press francés"* / *"tríceps testa"*;
  `jm press`, `arm blaster` se mantienen.
- **Piernas (upper legs):** `squat` → *"sentadilla"* / *"agachamento"*; `split squat` →
  *"sentadilla búlgara"*; `lunge` → *"zancada"* / *"afundo"*; `deadlift` → *"peso muerto"* /
  *"levantamento terra"*; `stiff leg deadlift` → *"peso muerto rumano/piernas rectas"*;
  `step-up` → *"subida al step"* / *"subida no step"*; `pull through` se mantiene.
  `leg curl` → es *"curl femoral"* / pt-BR *"flexora"*; `leg extension` → *"extensión de piernas"* /
  *"cadeira extensora"*; `sumo deadlift` → *"peso muerto sumo"* / *"levantamento terra sumô"*.
- **Pantorrillas (lower legs):** `calf raise` → es *"elevación de talones"* / pt-BR
  *"elevação de panturrilha"*.

---

## Etapa 0 — Infraestructura (una sola vez, antes del lote 1) ✅ COMPLETA

- [x] Crear `scripts/name-overrides.json` vacío (`{}`).
- [x] Modificar `generate-name-i18n.py`: al asignar `name_i18n`, si el `id` está en overrides,
      usar `{en: name, es: override.es, "pt-BR": override["pt-BR"]}`; si no, el flujo actual.
- [x] `scripts/lote.py`: imprime los 5 ejercicios de `<grupo> <n>` con su contexto + plantilla
      lista para pegar en `name-overrides.json`. También `--grupos` lista grupos y nº de lotes.
- [x] Arreglar el bug de `--report` (ya no cuenta como “sin traducir” palabras ya traducidas).
- [x] Verificado: `python3 scripts/generate-name-i18n.py && npm run build` → build OK.

---

## Progreso por lotes

Marcar cada lote al confirmarlo. (Se listan solo los grupos; se añaden filas conforme se avanza.)

### 1 — waist (17 lotes de 10) — ✅ COMPLETO (169/169)
**Todos los ejercicios de waist tienen override manual revisado.**

- [x] Lotes 1–5 (de 10) · ejercicios 1–50 · ids: 0001,0002,0003,0006,2355, 2333,3204,0011,0010,0012, 0013,0014,1714,1758,0969, 0971,0972,0979,0981,0985, 1002,0992,1011,1005,1007, 1014,1015,0071,0084,0083, 0094,0096,2799,2800,0103, 0112,3544,0138,2466,0870, 0174,0175,0873,0211,0212, 2399,0222,0221,0223,0226 ✅
- [x] Lote 6 (parcial, ejercicios 51–55) · ids 0874,0230,0242,0243,0862 ✅
- [x] Lote 6 (resto, ejercicios 56–60) · ids 2963,0260,1468,0262,0267 ✅ → **lote 6 completo**
- [x] Lote 7 (ejercicios 61–70) · ids 0271,0272,0274,3016,0276,0277,0282,0407,0443,3303 ✅
- [x] Lote 8 (ejercicios 71–80) · ids 0456,0457,2429,3301,3296,0464,3315,3299,0467,0469 ✅
- [x] Lote 9 (ejercicios 81–90) · ids 3202,1764,0472,1761,0473,0474,0475,0476,0484,1471 ✅
- [x] Lote 10 (ejercicios 91–100) · ids 3698,0491,0495,0507,0508,0517,0524,0530,0532,0554 ✅
- [x] Lote 11 (ejercicios 101–110) · ids 3640,3239,3419,0562,3300,0570,0583,1452,0595,3760 ✅
- [x] Lote 12 (ejercicios 111–120) · ids 0600,1688,2312,0620,0865,0634,1495,0635,0640,0641 ✅
- [x] Lote 13 (ejercicios 121–130) · ids 3147,1687,3119,3665,3203,1707,0650,0664,3201,0872 ✅
- [x] Lote 14 (ejercicios 131–140) · ids 3663,2204,2206,0687,0689,0691,3699,0705,0709,3213 ✅
- [x] Lote 15 (ejercicios 141–150) · ids 0735,3679,1496,0756,0777,2329,2297,0796,3314,3298 ✅
- [x] Lote 16 (ejercicios 151–160) · ids 0805,0807,0871,2802,2801,3420,0826,0832,3670,2135 ✅
- [x] Lote 17 (ejercicios 161–169, últimos 9) · ids 0866,0840,0846,0845,2371,0849,0850,0857,0858 ✅ → **waist 169/169 completo**

### 2 — chest (9 lotes de 20) — ✅ COMPLETO (163/163)
> Desde aquí el tamaño de lote es **20** (`scripts/lote.py`, `BATCH=20`).
- [x] Lote 1 (ejercicios 1–20) · ids 3294,0009,1716,2364,1254,0989,0025,0033,1255,0036,0040,0045,0047,0050,1256,1257,0122,1258,1259,0151 ✅
- [x] Lote 2 (ejercicios 21–40) · ids 0155,0158,1260,1261,0169,0171,0170,0179,0185,0188,1262,1263,1264,1265,1266,0191,1267,1268,2144,0227 ✅
- [x] Lote 3 (ejercicios 41–60) · ids 1269,1270,1271,0251,1430,2462,1272,3216,1273,0258,0279,1274,1275,0288,0289,0301,0302,0303,1276,0307 ✅
- [x] Lote 4 (ejercicios 61–80) · ids 0308,1277,3545,0314,0316,0319,1278,0321,1279,1280,1281,1282,0324,1283,0328,0331,0340,0343,0342,1284 ✅
- [x] Lote 5 (ejercicios 81–100) · ids 1285,1286,1287,1288,1289,1290,1291,1622,1292,1293,0375,1294,1295,1624,0433,1167,1296,0458,3327,2139 ✅
- [x] Lote 6 (ejercicios 101–120) · ids 3234,0492,0493,3785,0494,3011,1297,0500,0519,0531,1298,0545,3211,3288,0577,0576,1300,1299,1479,0596 ✅
- [x] Lote 7 (ejercicios 121–140) · ids 3758,1301,1302,1303,1304,1305,1312,3217,1306,1689,1307,0662,0653,0655,0656,0659,0658,0663,3145,0666 ✅
- [x] Lote 8 (ejercicios 141–160) · ids 3124,2203,2209,3021,0699,0725,0748,0753,0754,0757,0758,0759,1626,0764,1308,1309,0803,0806,1310,3313 ✅
- [x] Lote 9 (ejercicios 161–163, últimos 3) · ids 0856,1311,2363 ✅ → **chest 163/163 completo**

### 3 — back (11 lotes de 20) — ✅ COMPLETO (203/203)
- [x] Lote 1 (ejercicios 1–20) · ids 0007,3293,0015,0017,1431,1432,1314,3297,1405,0970,0974,3117,3116,0983,0988,0990,1018,1010,1013,1316 ✅
- [x] Lote 2 (ejercicios 21–40) · ids 0027,0034,0037,0049,0064,3017,0073,0022,0118,1317,0095,3019,3168,3167,3156,3158,3162,3161,3166,3165 ✅
- [x] Lote 3 (ejercicios 41–60) · ids 0150,0153,0159,0160,0167,1318,0172,2330,0177,2616,0180,0184,0189,3563,0193,1319,0198,0197,0199,0205 ✅
- [x] Lote 4 (ejercicios 61–80) · ids 0208,1320,1321,1322,1323,0213,0214,0861,0218,0220,1717,0234,0236,0238,0237,0239,2464,0244,0245,1324 ✅
- [x] Lote 5 (ejercicios 81–100) · ids 1325,0248,1326,0253,1327,0293,0305,0304,0327,0329,3541,1328,0292,1329,1330,1331,2327,0406,3664,1772 ✅
- [x] Lote 6 (ejercicios 101–120) · ids 3292,1332,1333,1334,1335,1336,1338,1339,1341,1342,1343,3010,1344,3295,0466,0489,0488,0499,2300,2298 ✅
- [x] Lote 7 (ejercicios 121–140) · ids 0497,0498,0521,0522,0541,0548,1345,0558,1346,3418,0571,0572,0573,0574,3200,0579,0580,1439,0581,0588 ✅
- [x] Lote 8 (ejercicios 141–160) · ids 0589,1356,1347,2285,2736,1348,1349,1350,0604,0606,1351,1313,0609,1352,1353,1354,0627,0631,1401,1355 ✅
- [x] Lote 9 (ejercicios 161–180) · ids 0638,1773,0651,0652,0670,3144,0673,0674,0678,2208,2207,0680,3012,0688,0690,1763,1358,0720,3304,0746 ✅
- [x] Lote 10 (ejercicios 181–200) · ids 1359,0761,1360,1361,0767,1362,1363,3669,0794,1364,0808,0818,3231,1365,1366,2987,0835,3286,3312,3290 ✅
- [x] Lote 11 (ejercicios 201–203, últimos 3) · ids 0841,1429,1367 ✅ → **back 203/203 completo**

### 4 — shoulders (8 lotes de 20) — ✅ COMPLETO (143/143)
- [x] Lote 1 (ejercicios 1–20) · ids 0977,0978,0993,0997,1022,1012,1017,0041,0067,0075,0076,0086,0087,0091,0100,0105,1456,0107,1457,3305 ✅
- [x] Lote 2 (ejercicios 21–40) · ids 0120,0119,0121,0123,0128,0148,0154,0161,0162,0164,3697,0178,0192,0202,0203,0215,0216,0219,0225,0233 ✅
- [x] Lote 3 (ejercicios 41–60) · ids 0235,0240,0246,0286,2137,0287,0290,0299,2136,0310,0309,0311,0323,0325,0326,3542,0332,0334,0335,0863 ✅
- [x] Lote 4 (ejercicios 61–80) · ids 2470,0341,0345,0348,0355,0356,0359,0361,0360,0363,1700,0376,2292,0377,0378,0380,0379,0383,0386,2397 ✅
- [x] Lote 5 (ejercicios 81–100) · ids 0387,0388,3546,2317,0392,0396,0395,0405,0404,0408,3548,0414,0415,2143,0419,0424,0426,0427,0437,1765 ✅
- [x] Lote 6 (ejercicios 101–120) · ids 0864,0438,0445,0520,0523,0527,0528,0529,0537,0538,0539,0540,0542,0543,0546,1438,0547,0550,0552,0553 ✅
- [x] Lote 7 (ejercicios 121–140) · ids 3237,2271,0584,0587,0590,0602,0601,0603,0869,2318,0669,3122,0747,0762,0765,0766,0772,0774,0775,0788 ✅
- [x] Lote 8 (ejercicios 141–143, últimos 3) · ids 0834,3641,0844 ✅ → **shoulders 143/143 completo**

### 5 — upper arms (15 lotes de 20) — ✅ COMPLETO (292/292)
- [x] Lote 1 (ejercicios 1–20) · ids 0018,0019,0968,0975,0976,0986,0998,0023,2407,0030,0031,0035,0038,1719,0048,0052,1720,0055,0056,0057 ✅
- [x] Lote 2 (ejercicios 21–40) · ids 0059,0061,0060,0065,1751,0070,0072,2187,0080,1721,0081,1718,0089,0092,0106,2414,0109,0110,1629,0113 ✅
- [x] Lote 3 (ejercicios 41–60) · ids 0129,1399,1770,0139,0140,0137,1771,1769,0149,1630,1631,0152,0868,1632,0165,1722,0173,0860,0176,1634 ✅
- [x] Lote 4 (ejercicios 61–80) · ids 0182,0186,0190,1633,1635,1723,1636,1637,0194,0195,1638,0201,0200,0204,0206,2406,1413,0209,0207,1639 ✅
- [x] Lote 5 (ejercicios 81–100) · ids 1724,1725,1726,1640,1641,1642,1643,1644,0229,0231,0232,1727,0241,2405,1645,1728,0259,2398,0283,0285 ✅
- [x] Lote 6 (ejercicios 101–120) · ids 2403,1646,1647,1648,1649,1650,1651,1652,1653,0294,2401,1654,1655,1656,1731,0296,0297,0298,1657,1617 ✅
- [x] Lote 7 (ejercicios 121–140) · ids 0306,1732,0313,1659,0312,2402,1664,0315,0318,0317,0320,1618,0322,1619,1620,0330,1733,0333,1734,1660 ✅
- [x] Lote 8 (ejercicios 141–160) · ids 1658,0337,1729,0338,0344,0346,1735,1661,0350,0351,1662,0352,0353,1736,1663,1621,0354,1665,1666,1414 ✅
- [x] Lote 9 (ejercicios 161–180) · ids 1667,1668,1669,1670,1671,0362,1672,0365,0366,1623,0370,0372,1673,0373,0374,1674,0382,0384,1675,1676 ✅
- [x] Lote 10 (ejercicios 181–200) · ids 0389,1730,1737,1677,0390,3547,0391,1678,0393,0394,0397,1679,0398,0402,0403,1738,2188,3560,1739,1740 ✅
- [x] Lote 11 (ejercicios 201–220) · ids 1741,0416,0418,2321,0420,0421,0422,1680,0423,0425,0428,0429,0430,2293,1684,0436,1742,1743,5201,0439 ✅
- [x] Lote 12 (ejercicios 221–240) · ids 2294,2189,3287,1744,1745,1746,1747,1748,1682,1749,1627,0446,0447,0448,2186,0449,0450,0451,0452,1458 ✅
- [x] Lote 13 (ejercicios 241–260) · ids 0453,0454,1628,2404,2432,2741,3302,0471,3289,0490,0525,0526,0575,1615,0591,0592,1614,1616,1451,0607 ✅
- [x] Lote 14 (ejercicios 261–280) · ids 1701,1750,2328,0636,0637,0639,0643,0660,1467,3123,0672,0677,0717,2142,0751,1683,1625,1752,3291,1753 ✅
- [x] Lote 15 (ejercicios 281–292, últimos 12) · ids 0814,0812,0813,0815,0816,0817,0830,0847,0853,1754,1755,1767 ✅ → **upper arms 292/292 completo**

### 6 — lower arms (2 lotes de 20) — ✅ COMPLETO (37/37)
- [x] Lote 1 (ejercicios 1–20) · ids 0994,1016,1411,1412,0079,0082,0104,0126,0125,0210,0224,0247,1437,0347,2705,0349,2706,0358,1415,0364 ✅
- [x] Lote 2 (ejercicios 21–37, últimos 17) · ids 1441,0367,0368,0369,0385,0399,0401,0455,0518,2288,1421,0721,1426,0771,0854,1428,0859 ✅ → **lower arms 37/37 completo**

### 7 — upper legs (12 lotes de 20) — ✅ COMPLETO (227/227)
- [x] Lote 1 (ejercicios 1–20) · ids 1512,3214,1709,1710,0016,1713,1712,1473,0020,0980,1408,0984,0987,0991,0996,1001,1004,1003,1008,1009 ✅
- [x] Lote 2 (ejercicios 21–40) · ids 1023,0024,0026,0028,0029,0032,0039,0042,0043,1461,1462,1545,1409,3562,0044,0046,1436,0051,0053,1410 ✅
- [x] Lote 3 (ejercicios 41–60) · ids 1435,0054,0058,0063,0066,0068,0069,0074,0078,0077,0085,0090,0098,0097,1756,0099,0101,2810,0102,2798 ✅
- [x] Lote 4 (ejercicios 61–80) · ids 0114,0115,0116,0117,0124,0127,3212,0130,3639,3543,1494,3235,0157,0168,0196,0228,1548,3769,0291,0295 ✅
- [x] Lote 5 (ejercicios 81–100) · ids 3635,0300,1760,0336,0339,3888,0371,0381,1459,1757,2805,0410,0411,0413,0431,2796,2812,0432,0434,2808 ✅
- [x] Lote 6 (ejercicios 101–120) · ids 2803,1559,1416,1417,1560,2133,0459,1472,3470,3194,3561,3523,3193,1511,3218,3215,1418,1564,0496,2400 ✅
- [x] Lote 7 (ejercicios 121–140) · ids 1419,0514,0513,0533,0534,0535,0536,0544,0549,0551,0555,1420,1576,2287,0578,2286,2611,0582,0585,0586 ✅
- [x] Lote 8 (ejercicios 141–160) · ids 3195,0593,3759,0597,0598,0599,3013,3582,0613,0624,0628,1476,0642,1422,3662,3132,0648,0661,3533,3552 ✅
- [x] Lote 9 (ejercicios 161–180) · ids 0668,1582,3236,3007,3006,0675,1423,2571,2205,2202,1585,1424,2567,1587,0697,1766,0696,1774,0710,3667 ✅
- [x] Lote 10 (ejercicios 181–200) · ids 1775,3645,0730,1759,1489,1425,0739,1464,1463,0740,0741,0743,0744,0749,0750,0752,1433,3281,0755,0760 ✅
- [x] Lote 11 (ejercicios 201–220) · ids 1434,0768,0769,0770,3142,0776,0778,2368,0786,1705,1685,1686,1599,0795,1427,0809,3433,2459,0811,1466 ✅
- [x] Lote 12 (ejercicios 221–227, últimos 7) · ids 1460,3643,3644,0851,0852,3642,1604 ✅ → **upper legs 227/227 completo**

### 8 — lower legs (3 lotes de 20) — ✅ COMPLETO (59/59)
- [x] Lote 1 (ejercicios 1–20) · ids 1368,1708,0999,1000,1369,1370,0088,1371,1372,0108,0111,1373,1374,1375,1376,1407,1377,1378,0257,0284 ✅
- [x] Lote 2 (ejercicios 21–40) · ids 1379,0400,1380,1381,0409,0417,1382,3241,3240,1383,1384,2289,1253,2315,2335,0594,1385,0605,1386,1387 ✅
- [x] Lote 3 (ejercicios 41–59, últimos 19) · ids 1388,1389,1390,0727,0738,1391,0742,2334,1392,1393,0763,1394,1395,0773,1396,1490,1397,1398,0833 ✅ → **lower legs 59/59 completo**

### 9 — cardio (2 lotes de 20) — ✅ COMPLETO (29/29)
- [x] Lote 1 (ejercicios 1–20) · ids 3220,3672,3360,1160,2331,1201,3221,3636,0501,3224,2612,0630,3638,0685,0684,3219,3222,3656,3361,3671 ✅
- [x] Lote 2 (ejercicios 21–29, últimos 9) · ids 3223,2138,0798,3318,2141,3655,3666,2311,3637 ✅ → **cardio 29/29 completo**

### 10 — neck (1 lote) — ✅ COMPLETO (2/2)
- [x] Lote 1 · ids 1403,0716 ✅ → **neck 2/2 completo**

*(Las secciones de los demás grupos se agregan cuando les toque, para no inflar el archivo.)*

---

## Notas

- El JSON final queda **100% offline** (sin dependencia de servicios de traducción).
- Los overrides son la fuente de verdad de la revisión manual; versionar en git.
- Si algún día se quiere acelerar, se puede pre-rellenar overrides con un LLM y luego solo
  **revisar**, pero el ritmo acordado es manual, **10 por vez** (antes 5), para máxima calidad.
