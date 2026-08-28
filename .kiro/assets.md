# Assets Disponibles

## Resumen

| Recurso | Cantidad | Tamaño | Ubicación |
|---------|----------|--------|-----------|
| Ejercicios (JSON) | 1324 | 4.86 MB | `public/data/exercises.json` |
| Schema JSON | 1 | — | `public/data/exercises.schema.json` |
| Imágenes (JPG 180x180) | 1324 | 8.5 MB | `public/images/` |
| GIFs animados (180x180) | 1324 | 122.8 MB | `public/videos/` |

## Datos de Ejercicios

Cada ejercicio en `exercises.json` tiene la siguiente estructura:

```json
{
  "id": "0001",
  "name": "3/4 sit-up",
  "category": "waist",
  "body_part": "waist",
  "equipment": "body weight",
  "instructions": {
    "en": "...",
    "es": "...",
    "pt-BR": "..."
  },
  "instruction_steps": {
    "en": ["paso 1", "paso 2", "..."],
    "es": ["paso 1", "paso 2", "..."],
    "pt-BR": ["paso 1", "paso 2", "..."]
  },
  "muscle_group": "abs",
  "secondary_muscles": ["hip flexors", "lower back"],
  "target": "abs",
  "media_id": "2gPfomN",
  "image": "images/0001-2gPfomN.jpg",
  "gif_url": "videos/0001-2gPfomN.gif",
  "attribution": "...",
  "created_at": "2025-07-30T..."
}
```

## Traducciones

Las traducciones están **100% completas** para los 3 idiomas:

| Idioma | Código | Estado |
|--------|--------|--------|
| Inglés | `en` | ✅ Completo (original) |
| Español | `es` | ✅ Completo |
| Portugués brasileño | `pt-BR` | ✅ Completo |

Campos traducidos:
- `instructions` — texto completo de instrucciones
- `instruction_steps` — instrucciones divididas en array paso a paso

**Nota:** Los nombres de ejercicios (`name`), categorías, equipamiento y músculos están solo en inglés. Si se necesita i18n de la UI, habrá que mapearlos.

## Categorías de Ejercicios (body_part)

| Categoría | Descripción |
|-----------|-------------|
| back | Espalda |
| cardio | Cardiovascular |
| chest | Pecho |
| lower arms | Antebrazos |
| lower legs | Pantorrillas |
| neck | Cuello |
| shoulders | Hombros |
| upper arms | Brazos (bíceps/tríceps) |
| upper legs | Piernas (cuádriceps/isquiotibiales/glúteos) |
| waist | Abdomen/Core |

## Imágenes

- **Formato:** JPG
- **Tamaño:** 180x180 px (thumbnails)
- **Naming:** `{id}-{media_id}.jpg` (ej: `0001-2gPfomN.jpg`)
- **Referencia desde JSON:** campo `image` con path relativo (`images/0001-2gPfomN.jpg`)

## GIFs Animados

- **Formato:** GIF animado
- **Tamaño:** 180x180 px
- **Naming:** `{id}-{media_id}.gif` (ej: `0001-2gPfomN.gif`)
- **Referencia desde JSON:** campo `gif_url` con path relativo (`videos/0001-2gPfomN.gif`)
- **Peso total:** ~123 MB — considerar lazy loading y carga bajo demanda

## Consideraciones para la Implementación

1. **GIFs son pesados** (123 MB total) — cargar solo el GIF del ejercicio visible, no todos a la vez
2. **exercises.json es grande** (4.86 MB) — considerar:
   - Carga inicial del JSON completo y filtrado en memoria
   - O dividir en chunks por categoría si el tiempo de carga es problemático
3. **Paths relativos** — las referencias `image` y `gif_url` ya son relativas a `public/`, listos para usar como URLs
4. **Schema de validación** — usar `exercises.schema.json` para validar si se modifican datos
