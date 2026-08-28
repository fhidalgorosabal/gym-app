export type BodyPart =
  | 'back'
  | 'cardio'
  | 'chest'
  | 'lower arms'
  | 'lower legs'
  | 'neck'
  | 'shoulders'
  | 'upper arms'
  | 'upper legs'
  | 'waist';

export type Equipment =
  | 'assisted'
  | 'band'
  | 'barbell'
  | 'body weight'
  | 'bosu ball'
  | 'cable'
  | 'dumbbell'
  | 'elliptical machine'
  | 'ez barbell'
  | 'hammer'
  | 'kettlebell'
  | 'leverage machine'
  | 'medicine ball'
  | 'olympic barbell'
  | 'resistance band'
  | 'roller'
  | 'rope'
  | 'skierg machine'
  | 'sled machine'
  | 'smith machine'
  | 'stability ball'
  | 'stationary bike'
  | 'stepmill machine'
  | 'tire'
  | 'trap bar'
  | 'upper body ergometer'
  | 'weighted'
  | 'wheel roller';

export interface LanguageMap {
  en: string;
  es: string;
  'pt-BR': string;
}

export interface LanguageStepsMap {
  en: string[];
  es: string[];
  'pt-BR': string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  body_part: BodyPart;
  equipment: string;
  instructions: LanguageMap;
  instruction_steps: LanguageStepsMap;
  muscle_group: string;
  secondary_muscles: string[];
  target: string;
  media_id: string;
  image: string;
  gif_url: string;
  attribution: string;
  created_at: string;
}

/** Labels en español para las categorías body_part */
export const BODY_PART_LABELS: Record<BodyPart, string> = {
  back: 'Espalda',
  cardio: 'Cardio',
  chest: 'Pecho',
  'lower arms': 'Antebrazos',
  'lower legs': 'Pantorrillas',
  neck: 'Cuello',
  shoulders: 'Hombros',
  'upper arms': 'Brazos',
  'upper legs': 'Piernas',
  waist: 'Abdomen'
};

/** Todas las categorías disponibles */
export const BODY_PARTS: BodyPart[] = [
  'back',
  'cardio',
  'chest',
  'lower arms',
  'lower legs',
  'neck',
  'shoulders',
  'upper arms',
  'upper legs',
  'waist'
];
