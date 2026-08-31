#!/usr/bin/env python3
"""
Genera el campo `name_i18n` (en/es/pt-BR) para cada ejercicio de exercises.json,
traduciendo los nombres por sustitución de palabras usando un glosario de gym.

Vía 2 del plan-traduccion-datos.md.

Uso:
  python3 scripts/generate-name-i18n.py            # genera y sobreescribe exercises.json
  python3 scripts/generate-name-i18n.py --dry-run  # muestra ejemplos sin escribir
  python3 scripts/generate-name-i18n.py --report   # reporta palabras sin traducir
"""
import json
import re
import sys
from pathlib import Path

JSON_PATH = Path(__file__).resolve().parent.parent / 'public' / 'data' / 'exercises.json'

# Glosario: palabra en inglés (minúscula) -> (es, pt-BR)
# Términos de gimnasio; el orden de palabras se mantiene (aceptable en nombres de ejercicios).
GLOSSARY = {
    # equipamiento
    'dumbbell': ('con mancuerna', 'com halter'),
    'dumbbells': ('con mancuernas', 'com halteres'),
    'barbell': ('con barra', 'com barra'),
    'cable': ('en polea', 'no cabo'),
    'kettlebell': ('con pesa rusa', 'com kettlebell'),
    'band': ('con banda', 'com faixa'),
    'ball': ('con pelota', 'com bola'),
    'lever': ('en máquina', 'na máquina'),
    'machine': ('máquina', 'máquina'),
    'smith': ('smith', 'smith'),
    'ez': ('EZ', 'EZ'),
    'bar': ('barra', 'barra'),
    'bars': ('barras', 'barras'),
    'rope': ('con cuerda', 'com corda'),
    'sled': ('en trineo', 'no trenó'),
    'medicine': ('medicinal', 'medicinal'),
    'stability': ('de estabilidad', 'de estabilidade'),
    'bosu': ('bosu', 'bosu'),
    'roller': ('rodillo', 'rolo'),
    'wheel': ('rueda', 'roda'),
    'towel': ('con toalla', 'com toalha'),
    'bench': ('en banco', 'no banco'),
    'floor': ('en el suelo', 'no chão'),
    'wall': ('en la pared', 'na parede'),
    'chair': ('en silla', 'na cadeira'),
    'bike': ('bicicleta', 'bicicleta'),
    'trainer': ('entrenador', 'treinador'),
    'pulley': ('polea', 'polia'),
    'attachment': ('accesorio', 'acessório'),
    'resistance': ('de resistencia', 'de resistência'),
    'weighted': ('con peso', 'com peso'),
    'bodyweight': ('con peso corporal', 'com peso corporal'),
    'assisted': ('asistido', 'assistido'),
    'suspended': ('suspendido', 'suspenso'),
    'fixed': ('fijo', 'fixo'),
    'cage': ('jaula', 'gaiola'),

    # movimientos / ejercicios
    'curl': ('curl', 'rosca'),
    'curls': ('curls', 'roscas'),
    'press': ('press', 'supino'),
    'raise': ('elevación', 'elevação'),
    'raises': ('elevaciones', 'elevações'),
    'raised': ('elevado', 'elevado'),
    'row': ('remo', 'remada'),
    'squat': ('sentadilla', 'agachamento'),
    'squatting': ('en sentadilla', 'agachando'),
    'extension': ('extensión', 'extensão'),
    'extended': ('extendido', 'estendido'),
    'fly': ('apertura', 'crucifixo'),
    'crunch': ('crunch', 'abdominal'),
    'pull': ('jalón', 'puxada'),
    'pulldown': ('jalón', 'puxada'),
    'pullover': ('pullover', 'pullover'),
    'pushdown': ('empuje hacia abajo', 'empurrar para baixo'),
    'push': ('empuje', 'flexão'),
    'dip': ('fondo', 'mergulho'),
    'dips': ('fondos', 'mergulhos'),
    'twist': ('giro', 'giro'),
    'twisting': ('con giro', 'com giro'),
    'twisted': ('girado', 'girado'),
    'lunge': ('zancada', 'afundo'),
    'deadlift': ('peso muerto', 'levantamento terra'),
    'shrug': ('encogimiento', 'encolhimento'),
    'bridge': ('puente', 'ponte'),
    'cross': ('cruzado', 'cruzado'),
    'crossovers': ('cruces', 'cruzamentos'),
    'chin': ('dominada supina', 'barra supinada'),
    'clean': ('cargada', 'arranco'),
    'kickback': ('patada', 'coice'),
    'kick': ('patada', 'chute'),
    'shrugs': ('encogimientos', 'encolhimentos'),
    'plank': ('plancha', 'prancha'),
    'planche': ('plancha', 'prancha'),
    'stretch': ('estiramiento', 'alongamento'),
    'jump': ('salto', 'salto'),
    'jumps': ('saltos', 'saltos'),
    'run': ('carrera', 'corrida'),
    'walk': ('caminata', 'caminhada'),
    'walking': ('caminando', 'caminhando'),
    'step': ('paso', 'passo'),
    'split': ('dividido', 'dividido'),
    'snatch': ('arranque', 'arranco'),
    'jerk': ('envión', 'arremesso'),
    'swing': ('balanceo', 'balanço'),
    'throw': ('lanzamiento', 'lançamento'),
    'lift': ('levantamiento', 'levantamento'),
    'bend': ('flexión', 'flexão'),
    'reach': ('alcance', 'alcance'),
    'rotation': ('rotación', 'rotação'),
    'rotational': ('rotacional', 'rotacional'),
    'adduction': ('aducción', 'adução'),
    'abduction': ('abducción', 'abdução'),
    'hyperextension': ('hiperextensión', 'hiperextensão'),
    'sit': ('abdominal', 'abdominal'),
    'situp': ('abdominal', 'abdominal'),
    'muscle': ('muscular', 'muscular'),
    'burpee': ('burpee', 'burpee'),
    'thruster': ('thruster', 'thruster'),
    'windmill': ('molino', 'moinho'),
    'crawl': ('gateo', 'rastejo'),

    # posiciones / modificadores
    'seated': ('sentado', 'sentado'),
    'sitted': ('sentado', 'sentado'),
    'supine': ('supino', 'supino'),
    'standing': ('de pie', 'em pé'),
    'lying': ('acostado', 'deitado'),
    'kneeling': ('arrodillado', 'ajoelhado'),
    'prone': ('boca abajo', 'de bruços'),
    'hanging': ('colgado', 'suspenso'),
    'hang': ('colgado', 'suspenso'),
    'incline': ('inclinado', 'inclinado'),
    'decline': ('declinado', 'declinado'),
    'flat': ('plano', 'plano'),
    'reverse': ('inverso', 'inverso'),
    'revers': ('inverso', 'inverso'),
    'inverse': ('inverso', 'inverso'),
    'inverted': ('invertido', 'invertido'),
    'alternate': ('alterno', 'alternado'),
    'alternating': ('alternando', 'alternando'),
    'single': ('a una', 'unilateral'),
    'double': ('doble', 'duplo'),
    'wide': ('abierto', 'aberto'),
    'narrow': ('cerrado', 'fechado'),
    'close': ('cerrado', 'fechado'),
    'neutral': ('neutro', 'neutro'),
    'straight': ('recto', 'reto'),
    'bent': ('flexionado', 'flexionado'),
    'front': ('frontal', 'frontal'),
    'rear': ('posterior', 'posterior'),
    'lateral': ('lateral', 'lateral'),
    'side': ('lateral', 'lateral'),
    'overhead': ('sobre la cabeza', 'acima da cabeça'),
    'behind': ('detrás', 'atrás'),
    'over': ('sobre', 'sobre'),
    'underhand': ('supino', 'supinado'),
    'high': ('alto', 'alto'),
    'low': ('bajo', 'baixo'),
    'upper': ('superior', 'superior'),
    'lower': ('inferior', 'inferior'),
    'upright': ('vertical', 'vertical'),
    'vertical': ('vertical', 'vertical'),
    'horizontal': ('horizontal', 'horizontal'),
    'full': ('completo', 'completo'),
    'half': ('medio', 'meio'),
    'wide-grip': ('agarre abierto', 'pegada aberta'),
    'grip': ('agarre', 'pegada'),
    'palms': ('palmas', 'palmas'),
    'palm': ('palma', 'palma'),
    'neutral-grip': ('agarre neutro', 'pegada neutra'),
    'stiff': ('rígido', 'rígido'),
    'good': ('buenos', 'bom'),
    'morning': ('días', 'dia'),
    'military': ('militar', 'militar'),
    'russian': ('ruso', 'russo'),
    'romanian': ('rumano', 'romeno'),
    'bulgarian': ('búlgaro', 'búlgaro'),
    'sumo': ('sumo', 'sumô'),
    'hack': ('hack', 'hack'),
    'zercher': ('zercher', 'zercher'),
    'zottman': ('zottman', 'zottman'),
    'arnold': ('arnold', 'arnold'),
    'french': ('francés', 'francês'),
    'spider': ('araña', 'aranha'),
    'preacher': ('predicador', 'scott'),
    'concentration': ('concentrado', 'concentração'),
    'hammer': ('martillo', 'martelo'),
    'donkey': ('burro', 'burro'),
    'frog': ('rana', 'rã'),
    'stork': ('cigüeña', 'cegonha'),
    'cuban': ('cubano', 'cubano'),
    'pike': ('pica', 'pique'),
    'tuck': ('recogido', 'recolhido'),
    'pose': ('postura', 'pose'),
    'plyo': ('pliométrico', 'pliométrico'),

    # partes del cuerpo
    'arm': ('brazo', 'braço'),
    'arms': ('brazos', 'braços'),
    'leg': ('pierna', 'perna'),
    'legs': ('piernas', 'pernas'),
    'chest': ('pecho', 'peito'),
    'back': ('espalda', 'costas'),
    'shoulder': ('hombro', 'ombro'),
    'shoulders': ('hombros', 'ombros'),
    'triceps': ('tríceps', 'tríceps'),
    'tricep': ('tríceps', 'tríceps'),
    'biceps': ('bíceps', 'bíceps'),
    'bicep': ('bíceps', 'bíceps'),
    'calf': ('pantorrilla', 'panturrilha'),
    'calves': ('pantorrillas', 'panturrilhas'),
    'wrist': ('muñeca', 'punho'),
    'hip': ('cadera', 'quadril'),
    'glute': ('glúteo', 'glúteo'),
    'glutes': ('glúteos', 'glúteos'),
    'hamstring': ('isquiotibial', 'isquiotibial'),
    'quads': ('cuádriceps', 'quadríceps'),
    'neck': ('cuello', 'pescoço'),
    'knee': ('rodilla', 'joelho'),
    'knees': ('rodillas', 'joelhos'),
    'toe': ('punta del pie', 'ponta do pé'),
    'heel': ('talón', 'calcanhar'),
    'head': ('cabeza', 'cabeça'),
    'hand': ('mano', 'mão'),
    'hands': ('manos', 'mãos'),
    'elbow': ('codo', 'cotovelo'),
    'finger': ('dedo', 'dedo'),
    'ankle': ('tobillo', 'tornozelo'),
    'oblique': ('oblicuo', 'oblíquo'),
    'lat': ('dorsal', 'dorsal'),
    'delt': ('deltoides', 'deltoide'),
    'scapula': ('escápula', 'escápula'),
    'body': ('cuerpo', 'corpo'),
    'feet': ('pies', 'pés'),
    'foot': ('pie', 'pé'),

    # conectores / numerales
    'one': ('a un', 'a um'),
    'two': ('a dos', 'a dois'),
    'single-arm': ('a un brazo', 'um braço'),
    'up': ('arriba', 'para cima'),
    'ups': ('arriba', 'para cima'),
    'down': ('abajo', 'para baixo'),
    'on': ('en', 'em'),
    'with': ('con', 'com'),
    'and': ('y', 'e'),
    'to': ('a', 'a'),
    'the': ('el', 'o'),
    'in': ('en', 'em'),
    'of': ('de', 'de'),
    'from': ('desde', 'de'),
    'against': ('contra', 'contra'),
    'through': ('a través', 'através'),
    'between': ('entre', 'entre'),
    'around': ('alrededor', 'ao redor'),
    'forward': ('hacia adelante', 'para frente'),
    'inner': ('interno', 'interno'),
    'outer': ('externo', 'externo'),
    'internal': ('interno', 'interno'),
    'external': ('externo', 'externo'),
    'exercise': ('ejercicio', 'exercício'),
    'stance': ('postura', 'postura'),
    'motion': ('movimiento', 'movimento'),
    'range': ('rango', 'amplitude'),
    'balance': ('equilibrio', 'equilíbrio'),
    'support': ('apoyo', 'apoio'),
    'parallel': ('paralelo', 'paralelo'),
    'circles': ('círculos', 'círculos'),
    'circular': ('circular', 'circular'),
    'archer': ('arquero', 'arqueiro'),
    'spinal': ('espinal', 'espinhal'),
    'pelvic': ('pélvico', 'pélvico'),
    'tilt': ('inclinación', 'inclinação'),
    'flexor': ('flexor', 'flexor'),
    'flexion': ('flexión', 'flexão'),
    'drop': ('caída', 'queda'),
    'drag': ('arrastre', 'arrasto'),
    'touch': ('toque', 'toque'),
    'touchers': ('toques', 'toques'),
    'air': ('al aire', 'no ar'),
    'wide': ('abierto', 'aberto'),
    'skull': ('rompecráneos', 'testa'),

    # lote adicional (baja frecuencia pero comunes)
    'tap': ('toque', 'toque'),
    'jack': ('jack', 'jack'),
    'self': ('auto', 'auto'),
    'box': ('caja', 'caixa'),
    'mountain': ('escalador', 'escalador'),
    'climber': ('escalador', 'escalador'),
    'flip': ('volteo', 'giro'),
    'goblet': ('goblet', 'goblet'),
    'iron': ('cruz de hierro', 'cruz de ferro'),
    'face': ('a la cara', 'para o rosto'),
    'deltoid': ('deltoides', 'deltoide'),
    'pronation': ('pronación', 'pronação'),
    'supination': ('supinación', 'supinação'),
    'off': ('fuera', 'fora'),
    'hug': ('abrazo', 'abraço'),
    'kicks': ('patadas', 'chutes'),
    'march': ('marcha', 'marcha'),
    'clasped': ('entrelazadas', 'entrelaçadas'),
    'handstand': ('pino', 'parada de mãos'),
    'inchworm': ('oruga', 'lagarta'),
    'squeeze': ('apretón', 'aperto'),
    'isometric': ('isométrico', 'isométrico'),
    'pass': ('pase', 'passe'),
    'pistol': ('pistola', 'pistola'),
    'landmine': ('landmine', 'landmine'),
    'point': ('punto', 'ponto'),
    'slam': ('golpe', 'batida'),
    'modified': ('modificado', 'modificado'),
    'olympic': ('olímpico', 'olímpico'),
    'posterior': ('posterior', 'posterior'),
    'anterior': ('anterior', 'anterior'),
    'power': ('potencia', 'potência'),
    'hyper': ('hiper', 'hiper'),
    'sissy': ('sissy', 'sissy'),
    'ski': ('esquí', 'esqui'),
    'spine': ('columna', 'coluna'),
    'squats': ('sentadillas', 'agachamentos'),
    'stationary': ('estático', 'estático'),
    'straddle': ('a horcajadas', 'escanchado'),
    'three': ('tres', 'três'),
    'quarter': ('cuarto', 'quarto'),
    'gluteus': ('glúteo', 'glúteo'),
    'rocking': ('balanceo', 'balanço'),
    'rocky': ('rocky', 'rocky'),
    'sumo': ('sumo', 'sumô'),
    'goblet': ('goblet', 'goblet'),
    'russian': ('ruso', 'russo'),
    'towel': ('con toalla', 'com toalha'),
    'wide-grip': ('agarre abierto', 'pegada aberta'),
    'toes': ('puntas', 'pontas'),
    'star': ('estrella', 'estrela'),
    'circle': ('círculo', 'círculo'),
}

# Frases compuestas: se reemplazan ANTES del tokenizado por palabras.
# Clave en minúscula (con espacios/guiones normalizados a espacio).
PHRASES = {
    'sit-up': ('abdominal', 'abdominal'),
    'sit-ups': ('abdominales', 'abdominais'),
    'push-up': ('flexión', 'flexão'),
    'push-ups': ('flexiones', 'flexões'),
    'pull-up': ('dominada', 'barra'),
    'pull-ups': ('dominadas', 'barras'),
    'push up': ('flexión', 'flexão'),
    'pull up': ('dominada', 'barra'),
    'sit up': ('abdominal', 'abdominal'),
    'chin-up': ('dominada supina', 'barra supinada'),
    'chin up': ('dominada supina', 'barra supinada'),
    'good morning': ('buenos días', 'bom dia'),
    'mountain climber': ('escalador', 'escalador'),
    'jumping jack': ('salto de tijera', 'polichinelo'),
    'wide grip': ('agarre abierto', 'pegada aberta'),
    'close grip': ('agarre cerrado', 'pegada fechada'),
    'narrow grip': ('agarre cerrado', 'pegada fechada'),
    'neutral grip': ('agarre neutro', 'pegada neutra'),
    'reverse grip': ('agarre inverso', 'pegada inversa'),
    'face pull': ('jalón a la cara', 'puxada para o rosto'),
}

# Palabras a dejar tal cual (género/marcadores)
KEEP = {'male', 'female', 'v', 'y', 't', 'jm', 'a', 'pov', 'x'}


def translate_name(name: str, idx: int):
    """Traduce un nombre por sustitución de frases y palabras. Devuelve (es, ptbr, missing_words)."""
    # 1) Frases compuestas: reemplazar por un token-marcador que ya lleva la traducción.
    #    Se busca sobre el nombre en minúscula, respetando límites de palabra.
    es_name = name
    pt_name = name
    lowered = name.lower()
    # ordenar frases de más larga a más corta para evitar solapamientos
    for phrase in sorted(PHRASES, key=len, reverse=True):
        if phrase in lowered:
            es_t, pt_t = PHRASES[phrase]
            pattern = re.compile(re.escape(phrase), re.IGNORECASE)
            es_name = pattern.sub(es_t, es_name)
            pt_name = pattern.sub(pt_t, pt_name)
            lowered = es_name.lower()  # evita re-procesar

    # 2) Tokenizar y traducir palabra por palabra (sobre las versiones ya con frases aplicadas).
    def word_sub(text: str, lang_idx: int):
        tokens = re.split(r'(\W+)', text)
        parts = []
        missing = set()
        for tok in tokens:
            low = tok.lower()
            if not tok.strip() or not re.search(r'[a-zA-Z]', tok):
                parts.append(tok)
                continue
            if low in KEEP:
                parts.append(tok)
                continue
            if low in GLOSSARY:
                parts.append(GLOSSARY[low][lang_idx])
            else:
                # Puede ser una palabra ya traducida por una frase (acento/ñ) → dejar tal cual.
                if re.search(r'[áéíóúñãõçâ]', low):
                    parts.append(tok)
                else:
                    missing.add(low)
                    parts.append(tok)
        return ''.join(parts).strip(), missing

    es, missing = word_sub(es_name, 0)
    pt, _ = word_sub(pt_name, 1)

    es = es[:1].upper() + es[1:] if es else es
    pt = pt[:1].upper() + pt[1:] if pt else pt
    return es, pt, missing


def main():
    dry = '--dry-run' in sys.argv
    report = '--report' in sys.argv

    data = json.loads(JSON_PATH.read_text())
    exs = data if isinstance(data, list) else list(data.values())

    all_missing = {}
    for i, e in enumerate(exs):
        name = e.get('name', '')
        es, pt, missing = translate_name(name, i)
        e['name_i18n'] = {'en': name, 'es': es, 'pt-BR': pt}
        for m in missing:
            all_missing[m] = all_missing.get(m, 0) + 1

    if report:
        print('Palabras sin traducir (frecuencia):')
        for w, c in sorted(all_missing.items(), key=lambda x: -x[1]):
            print(f'  {c}\t{w}')
        print(f'Total palabras sin traducir: {len(all_missing)}')
        return

    if dry:
        print('Ejemplos de traducción:')
        for e in exs[:25]:
            n = e['name_i18n']
            print(f"  EN: {n['en']}")
            print(f"  ES: {n['es']}")
            print(f"  PT: {n['pt-BR']}")
            print()
        cov = 100 * (1 - len(all_missing) / max(1, len(set(w for e in exs for w in re.findall(r'[a-zA-Z]+', e['name'].lower())))))
        print(f'Palabras únicas sin traducir: {len(all_missing)}')
        return

    JSON_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(f'OK: name_i18n generado para {len(exs)} ejercicios en {JSON_PATH}')


if __name__ == '__main__':
    main()
