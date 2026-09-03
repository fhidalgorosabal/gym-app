import { Lang } from '../services/language.service';

/**
 * Traducciones de términos técnicos del catálogo de ejercicios:
 * target (músculo principal), equipment (equipamiento) y secondary_muscles.
 *
 * Los datos del JSON vienen en inglés; la clave del mapa es el valor en inglés
 * (en minúsculas) y el valor es la traducción. Si un término no está en el mapa,
 * se devuelve el original en inglés (fallback).
 *
 * NOTA: los nombres de ejercicios (`name`) NO se traducen aquí — se resuelven vía `name_i18n`
 * en el JSON (ver `.kiro/wiki.md`, secciones 5 y 9).
 */

const es: Record<string, string> = {
  // target
  abductors: 'abductores',
  abs: 'abdominales',
  adductors: 'aductores',
  biceps: 'bíceps',
  calves: 'pantorrillas',
  'cardiovascular system': 'sistema cardiovascular',
  delts: 'deltoides',
  forearms: 'antebrazos',
  glutes: 'glúteos',
  hamstrings: 'isquiotibiales',
  lats: 'dorsales',
  'levator scapulae': 'elevador de la escápula',
  pectorals: 'pectorales',
  quads: 'cuádriceps',
  'serratus anterior': 'serrato anterior',
  spine: 'columna',
  traps: 'trapecios',
  triceps: 'tríceps',
  'upper back': 'espalda alta',
  // equipment
  assisted: 'asistido',
  band: 'banda',
  barbell: 'barra',
  'body weight': 'peso corporal',
  'bosu ball': 'pelota bosu',
  cable: 'polea',
  dumbbell: 'mancuerna',
  'elliptical machine': 'elíptica',
  'ez barbell': 'barra EZ',
  hammer: 'martillo',
  kettlebell: 'pesa rusa',
  'leverage machine': 'máquina de palanca',
  'medicine ball': 'balón medicinal',
  'olympic barbell': 'barra olímpica',
  'resistance band': 'banda de resistencia',
  roller: 'rodillo',
  rope: 'cuerda',
  'skierg machine': 'máquina skierg',
  'sled machine': 'máquina de trineo',
  'smith machine': 'máquina smith',
  'stability ball': 'pelota de estabilidad',
  'stationary bike': 'bicicleta estática',
  'stepmill machine': 'escaladora',
  tire: 'neumático',
  'trap bar': 'barra trap',
  'upper body ergometer': 'ergómetro de brazos',
  weighted: 'con peso',
  'wheel roller': 'rueda abdominal',
  // secondary_muscles adicionales
  abdominals: 'abdominales',
  'ankle stabilizers': 'estabilizadores del tobillo',
  ankles: 'tobillos',
  back: 'espalda',
  brachialis: 'braquial',
  chest: 'pecho',
  core: 'core',
  deltoids: 'deltoides',
  feet: 'pies',
  'grip muscles': 'músculos de agarre',
  groin: 'ingle',
  hands: 'manos',
  'hip flexors': 'flexores de cadera',
  'inner thighs': 'muslos internos',
  'latissimus dorsi': 'dorsal ancho',
  'lower abs': 'abdominales inferiores',
  'lower back': 'espalda baja',
  obliques: 'oblicuos',
  quadriceps: 'cuádriceps',
  'rear deltoids': 'deltoides posteriores',
  rhomboids: 'romboides',
  'rotator cuff': 'manguito rotador',
  shins: 'espinillas',
  shoulders: 'hombros',
  soleus: 'sóleo',
  sternocleidomastoid: 'esternocleidomastoideo',
  trapezius: 'trapecio',
  'upper chest': 'pecho superior',
  'wrist extensors': 'extensores de muñeca',
  'wrist flexors': 'flexores de muñeca',
  wrists: 'muñecas'
};

const ptBR: Record<string, string> = {
  // target
  abductors: 'abdutores',
  abs: 'abdominais',
  adductors: 'adutores',
  biceps: 'bíceps',
  calves: 'panturrilhas',
  'cardiovascular system': 'sistema cardiovascular',
  delts: 'deltoides',
  forearms: 'antebraços',
  glutes: 'glúteos',
  hamstrings: 'isquiotibiais',
  lats: 'dorsais',
  'levator scapulae': 'levantador da escápula',
  pectorals: 'peitorais',
  quads: 'quadríceps',
  'serratus anterior': 'serrátil anterior',
  spine: 'coluna',
  traps: 'trapézios',
  triceps: 'tríceps',
  'upper back': 'costas superiores',
  // equipment
  assisted: 'assistido',
  band: 'faixa',
  barbell: 'barra',
  'body weight': 'peso corporal',
  'bosu ball': 'bola bosu',
  cable: 'cabo',
  dumbbell: 'halter',
  'elliptical machine': 'elíptico',
  'ez barbell': 'barra EZ',
  hammer: 'martelo',
  kettlebell: 'kettlebell',
  'leverage machine': 'máquina de alavanca',
  'medicine ball': 'bola medicinal',
  'olympic barbell': 'barra olímpica',
  'resistance band': 'faixa de resistência',
  roller: 'rolo',
  rope: 'corda',
  'skierg machine': 'máquina skierg',
  'sled machine': 'máquina de trenó',
  'smith machine': 'máquina smith',
  'stability ball': 'bola de estabilidade',
  'stationary bike': 'bicicleta ergométrica',
  'stepmill machine': 'escada ergométrica',
  tire: 'pneu',
  'trap bar': 'barra trap',
  'upper body ergometer': 'ergômetro de braços',
  weighted: 'com peso',
  'wheel roller': 'roda abdominal',
  // secondary_muscles adicionales
  abdominals: 'abdominais',
  'ankle stabilizers': 'estabilizadores do tornozelo',
  ankles: 'tornozelos',
  back: 'costas',
  brachialis: 'braquial',
  chest: 'peito',
  core: 'core',
  deltoids: 'deltoides',
  feet: 'pés',
  'grip muscles': 'músculos de preensão',
  groin: 'virilha',
  hands: 'mãos',
  'hip flexors': 'flexores do quadril',
  'inner thighs': 'coxas internas',
  'latissimus dorsi': 'grande dorsal',
  'lower abs': 'abdominais inferiores',
  'lower back': 'lombar',
  obliques: 'oblíquos',
  quadriceps: 'quadríceps',
  'rear deltoids': 'deltoides posteriores',
  rhomboids: 'romboides',
  'rotator cuff': 'manguito rotador',
  shins: 'canelas',
  shoulders: 'ombros',
  soleus: 'sóleo',
  sternocleidomastoid: 'esternocleidomastoideo',
  trapezius: 'trapézio',
  'upper chest': 'peito superior',
  'wrist extensors': 'extensores do punho',
  'wrist flexors': 'flexores do punho',
  wrists: 'punhos'
};

/** Traducciones por idioma. `en` es identidad (el dato ya está en inglés). */
const DICT: Record<Lang, Record<string, string>> = {
  es,
  en: {},
  'pt-BR': ptBR
};

/**
 * Traduce un término del catálogo (target, equipment o músculo) al idioma dado.
 * Devuelve el término original si no hay traducción.
 */
export function translateTerm(term: string, lang: Lang): string {
  if (!term) return term;
  if (lang === 'en') return term;
  const key = term.toLowerCase().trim();
  return DICT[lang][key] ?? term;
}
