# Plan — Traducción de los Datos del Catálogo

Traducir los campos del catálogo de ejercicios (`exercises.json`) que hoy están solo en inglés.
Complementa a `plan-idiomas.md` (que cubre la UI y las instrucciones).

## Estado de cada campo

| Campo | Idiomas | Estado |
|-------|---------|--------|
| `instructions` | en, es, pt-BR | ✅ ya traducido en el JSON |
| `instruction_steps` | en, es, pt-BR | ✅ ya traducido en el JSON |
| `target` (músculo principal) | solo en | ✅ **traducido vía diccionario** (`i18n/exercise-terms.ts`) |
| `equipment` (equipamiento) | solo en | ✅ **traducido vía diccionario** |
| `secondary_muscles` (partes involucradas) | solo en | ✅ **traducido vía diccionario** |
| `name` (nombre del ejercicio) | solo en | ⬜ pendiente (este plan) |
| `muscle_group` | solo en | ⬜ opcional (no se muestra en UI actualmente) |

**Total de nombres únicos a traducir:** ~1324.

---

## Etapa A — Términos técnicos (COMPLETADA)

Traducción de `target`, `equipment` y `secondary_muscles` con un diccionario de 78 términos.

- [x] Extraer valores únicos (19 target + 28 equipment + 40 músculos)
- [x] Crear `i18n/exercise-terms.ts` con traducciones es/pt-BR (en = identidad)
- [x] Helper `LanguageService.term(value)`
- [x] Aplicar en Exercise-Selector (equipment · target) y Exercise-Preview (target, equipment, músculos)
- [x] Verificar cobertura 100% (0 términos sin traducir)

**Resultado:** todo lo mostrado en el selector/preview está traducido, salvo el `name`.

---

## Etapa B — Preparar la infraestructura para nombres traducidos

**Objetivo:** que el modelo y la UI soporten `name` multiidioma, sin traducir aún.

- [ ] Decidir formato en el JSON. Opción recomendada: campo nuevo `name_i18n: { en, es, 'pt-BR' }`
      manteniendo `name` (en) por compatibilidad.
- [ ] Actualizar `Exercise` (modelo) con `name_i18n?`
- [ ] Helper `LanguageService.exerciseName(exercise)`:
      devuelve `name_i18n[lang]` si existe, si no `name` (fallback a inglés)
- [ ] Usar el helper en: Selector (lista), Preview (título), Setup-Day (lista), Routine (acordeón)
- [ ] Verificar que sin traducciones aún, todo sigue mostrando el inglés (sin romper)

**Resultado:** la app lee nombres traducidos si existen; mientras, usa inglés.

---

## Etapa C — Generar las traducciones de nombres

**Objetivo:** poblar `name_i18n` para los ~1324 ejercicios. Elegir UNA vía:

### Vía 1 — Traducción automática (rápida, calidad media)
- [ ] Script que recorra `exercises.json` y traduzca cada `name` con un servicio
      (LibreTranslate, DeepL, Google Translate API, o un modelo local)
- [ ] Generar `name_i18n` para es y pt-BR
- [ ] Revisión manual de términos raros (nombres idiomáticos, marcas)

### Vía 2 — Diccionario de palabras (semi-automática)
- [ ] Los nombres se componen de pocas palabras repetidas (pull up, sit-up, squat,
      dumbbell, barbell, etc.). Construir un glosario de ~150-200 términos
- [ ] Script que traduzca por sustitución de palabras + reglas
- [ ] Cubre la mayoría; revisar el resto a mano

### Vía 3 — Manual (máxima calidad, mucho trabajo)
- [ ] Traducir los 1324 a mano o con ayuda, revisando uno por uno

**Recomendación:** Vía 1 para un primer pase, luego pulir con Vía 2 los términos frecuentes.

---

## Etapa D — Integrar y validar

- [ ] Reemplazar/actualizar `exercises.json` con el campo `name_i18n`
- [ ] Validar que el JSON sigue cumpliendo el schema (`exercises.schema.json`) — actualizar schema si hace falta
- [ ] Verificar tamaño del JSON (impacto en carga; hoy se carga entero)
- [ ] Probar la app en los 3 idiomas: nombres traducidos en selector, preview, setup y rutina

**Resultado:** catálogo completamente localizado en es/en/pt-BR.

---

## Decisión de diseño — Nombre guardado en la rutina

Al agregar un ejercicio a una rutina se **copia el nombre en el idioma que el usuario
tenga seleccionado en ese momento**, y así permanece guardado. Si está en español, se
guarda en español; si está en inglés, en inglés.

- No se resuelve el nombre por `exercise_id` al mostrar.
- Una rutina guardada NO cambia de idioma después (es el comportamiento deseado).
- El helper `exerciseName()` se usa solo en el **selector/preview** (catálogo), que sí
  reacciona al idioma. En Setup-Day y Routine se muestra el `name` guardado tal cual.

## Archivos afectados (futuro)

| Archivo | Cambio |
|---------|--------|
| `public/data/exercises.json` | añadir `name_i18n` |
| `public/data/exercises.schema.json` | reflejar el nuevo campo |
| `models/exercise.model.ts` | `name_i18n?` en `Exercise` |
| `services/language.service.ts` | `exerciseName(exercise)` |
| Selector / Preview | usar `exerciseName()` |
| `routine.service.ts` (`addExercise`) | guardar el `name` ya resuelto al idioma actual |
