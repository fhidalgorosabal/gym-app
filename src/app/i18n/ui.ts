import { Lang } from '../services/language.service';

/** Claves de traducción de los textos de la interfaz. */
export type UIKey =
  // Común
  | 'appName'
  | 'exercises'
  | 'reps'
  | 'min'
  | 'back'
  | 'done'
  // Home
  | 'home.subtitle'
  | 'home.doTodayRoutine'
  | 'home.exercisesConfigured'
  | 'home.noRoutineToday'
  | 'home.configureRoutine'
  // Setup
  | 'setup.title'
  | 'setup.subtitle'
  | 'setup.exercisesLink'
  | 'setup.activate'
  | 'setup.deactivate'
  // Setup-Day
  | 'setupDay.noExercises'
  | 'setupDay.addForThisDay'
  | 'setupDay.addExercise'
  | 'setupDay.sets'
  | 'setupDay.reps'
  | 'setupDay.unit'
  | 'setupDay.restSets'
  | 'setupDay.restExercises'
  | 'setupDay.confirmDelete'
  | 'setupDay.editExercise'
  | 'setupDay.deleteExercise'
  | 'setupDay.moveUp'
  | 'setupDay.moveDown'
  // Unidades
  | 'unit.repetitions'
  | 'unit.minutes'
  | 'unit.repetitionsShort'
  | 'unit.minutesShort'
  // Routine (ejecución)
  | 'routine.completedTitle'
  | 'routine.exercisesLabel'
  | 'routine.totalSets'
  | 'routine.totalTime'
  | 'routine.backHome'
  | 'routine.restBetweenSets'
  | 'routine.restBetweenExercises'
  | 'routine.skipRest'
  | 'routine.series'
  | 'routine.currentSet'
  | 'routine.completeSet'
  | 'routine.repetitions'
  | 'routine.minutes'
  | 'routine.finishLastSet'
  | 'routine.finishSet'
  | 'routine.exerciseCompleted'
  // Selector
  | 'selector.title'
  | 'selector.search'
  | 'selector.noResults'
  | 'selector.selectThis'
  | 'selector.instructions'
  // Menú
  | 'menu.home'
  | 'menu.setup'
  | 'menu.days'
  | 'menu.routines'
  | 'menu.config';

type Dict = Record<UIKey, string>;

const es: Dict = {
  appName: 'GymApp',
  exercises: 'ejercicios',
  reps: 'reps',
  min: 'min',
  back: 'Volver',
  done: 'Listo',

  'home.subtitle': 'Tu rutina de ejercicios personalizada',
  'home.doTodayRoutine': 'Hacer rutina de hoy',
  'home.exercisesConfigured': 'ejercicios configurados',
  'home.noRoutineToday': 'No hay rutina configurada para hoy',
  'home.configureRoutine': 'Configurar rutina',

  'setup.title': 'Configurar Rutina',
  'setup.subtitle': 'Activa los días que entrenas y configura los ejercicios de cada uno.',
  'setup.exercisesLink': 'Ejercicios',
  'setup.activate': 'Activar',
  'setup.deactivate': 'Desactivar',

  'setupDay.noExercises': 'No hay ejercicios configurados',
  'setupDay.addForThisDay': 'Agrega ejercicios para este día',
  'setupDay.addExercise': 'Agregar ejercicio',
  'setupDay.sets': 'Series',
  'setupDay.reps': 'Repeticiones',
  'setupDay.unit': 'Unidad',
  'setupDay.restSets': 'Descanso sets (seg)',
  'setupDay.restExercises': 'Descanso entre ejercicios (seg)',
  'setupDay.confirmDelete': '¿Eliminar este ejercicio de la rutina?',
  'setupDay.editExercise': 'Editar ejercicio',
  'setupDay.deleteExercise': 'Eliminar ejercicio',
  'setupDay.moveUp': 'Mover arriba',
  'setupDay.moveDown': 'Mover abajo',

  'unit.repetitions': 'Repeticiones',
  'unit.minutes': 'Minutos',
  'unit.repetitionsShort': 'reps',
  'unit.minutesShort': 'min',

  'routine.completedTitle': '¡Rutina completada!',
  'routine.exercisesLabel': 'Ejercicios',
  'routine.totalSets': 'Series totales',
  'routine.totalTime': 'Tiempo total',
  'routine.backHome': 'Volver al inicio',
  'routine.restBetweenSets': 'Descanso entre series',
  'routine.restBetweenExercises': 'Descanso entre ejercicios',
  'routine.skipRest': 'Saltar descanso',
  'routine.series': 'series',
  'routine.currentSet': 'Serie actual',
  'routine.completeSet': 'Completar serie',
  'routine.repetitions': 'repeticiones',
  'routine.minutes': 'minutos',
  'routine.finishLastSet': '¡Terminé última serie! ✓',
  'routine.finishSet': 'Terminé la serie →',
  'routine.exerciseCompleted': '¡Completado! ✓',

  'selector.title': 'Seleccionar ejercicio',
  'selector.search': 'Buscar ejercicio...',
  'selector.noResults': 'No se encontraron ejercicios',
  'selector.selectThis': 'Seleccionar este ejercicio',
  'selector.instructions': 'Instrucciones',

  'menu.home': 'Inicio',
  'menu.setup': 'Configurar rutina',
  'menu.days': 'Días',
  'menu.routines': 'Rutinas',
  'menu.config': 'Configuración'
};

const en: Dict = {
  appName: 'GymApp',
  exercises: 'exercises',
  reps: 'reps',
  min: 'min',
  back: 'Back',
  done: 'Done',

  'home.subtitle': 'Your personalized workout routine',
  'home.doTodayRoutine': "Do today's routine",
  'home.exercisesConfigured': 'exercises configured',
  'home.noRoutineToday': 'No routine configured for today',
  'home.configureRoutine': 'Configure routine',

  'setup.title': 'Configure Routine',
  'setup.subtitle': 'Enable the days you train and set up the exercises for each one.',
  'setup.exercisesLink': 'Exercises',
  'setup.activate': 'Enable',
  'setup.deactivate': 'Disable',

  'setupDay.noExercises': 'No exercises configured',
  'setupDay.addForThisDay': 'Add exercises for this day',
  'setupDay.addExercise': 'Add exercise',
  'setupDay.sets': 'Sets',
  'setupDay.reps': 'Reps',
  'setupDay.unit': 'Unit',
  'setupDay.restSets': 'Rest between sets (sec)',
  'setupDay.restExercises': 'Rest between exercises (sec)',
  'setupDay.confirmDelete': 'Remove this exercise from the routine?',
  'setupDay.editExercise': 'Edit exercise',
  'setupDay.deleteExercise': 'Delete exercise',
  'setupDay.moveUp': 'Move up',
  'setupDay.moveDown': 'Move down',

  'unit.repetitions': 'Repetitions',
  'unit.minutes': 'Minutes',
  'unit.repetitionsShort': 'reps',
  'unit.minutesShort': 'min',

  'routine.completedTitle': 'Routine completed!',
  'routine.exercisesLabel': 'Exercises',
  'routine.totalSets': 'Total sets',
  'routine.totalTime': 'Total time',
  'routine.backHome': 'Back to home',
  'routine.restBetweenSets': 'Rest between sets',
  'routine.restBetweenExercises': 'Rest between exercises',
  'routine.skipRest': 'Skip rest',
  'routine.series': 'sets',
  'routine.currentSet': 'Current set',
  'routine.completeSet': 'Complete set',
  'routine.repetitions': 'repetitions',
  'routine.minutes': 'minutes',
  'routine.finishLastSet': 'Finished last set! ✓',
  'routine.finishSet': 'Finished the set →',
  'routine.exerciseCompleted': 'Completed! ✓',

  'selector.title': 'Select exercise',
  'selector.search': 'Search exercise...',
  'selector.noResults': 'No exercises found',
  'selector.selectThis': 'Select this exercise',
  'selector.instructions': 'Instructions',

  'menu.home': 'Home',
  'menu.setup': 'Configure routine',
  'menu.days': 'Days',
  'menu.routines': 'Routines',
  'menu.config': 'Settings'
};

const ptBR: Dict = {
  appName: 'GymApp',
  exercises: 'exercícios',
  reps: 'reps',
  min: 'min',
  back: 'Voltar',
  done: 'Pronto',

  'home.subtitle': 'Sua rotina de exercícios personalizada',
  'home.doTodayRoutine': 'Fazer rotina de hoje',
  'home.exercisesConfigured': 'exercícios configurados',
  'home.noRoutineToday': 'Não há rotina configurada para hoje',
  'home.configureRoutine': 'Configurar rotina',

  'setup.title': 'Configurar Rotina',
  'setup.subtitle': 'Ative os dias em que você treina e configure os exercícios de cada um.',
  'setup.exercisesLink': 'Exercícios',
  'setup.activate': 'Ativar',
  'setup.deactivate': 'Desativar',

  'setupDay.noExercises': 'Não há exercícios configurados',
  'setupDay.addForThisDay': 'Adicione exercícios para este dia',
  'setupDay.addExercise': 'Adicionar exercício',
  'setupDay.sets': 'Séries',
  'setupDay.reps': 'Repetições',
  'setupDay.unit': 'Unidade',
  'setupDay.restSets': 'Descanso entre séries (seg)',
  'setupDay.restExercises': 'Descanso entre exercícios (seg)',
  'setupDay.confirmDelete': 'Remover este exercício da rotina?',
  'setupDay.editExercise': 'Editar exercício',
  'setupDay.deleteExercise': 'Excluir exercício',
  'setupDay.moveUp': 'Mover para cima',
  'setupDay.moveDown': 'Mover para baixo',

  'unit.repetitions': 'Repetições',
  'unit.minutes': 'Minutos',
  'unit.repetitionsShort': 'reps',
  'unit.minutesShort': 'min',

  'routine.completedTitle': 'Rotina concluída!',
  'routine.exercisesLabel': 'Exercícios',
  'routine.totalSets': 'Séries totais',
  'routine.totalTime': 'Tempo total',
  'routine.backHome': 'Voltar ao início',
  'routine.restBetweenSets': 'Descanso entre séries',
  'routine.restBetweenExercises': 'Descanso entre exercícios',
  'routine.skipRest': 'Pular descanso',
  'routine.series': 'séries',
  'routine.currentSet': 'Série atual',
  'routine.completeSet': 'Concluir série',
  'routine.repetitions': 'repetições',
  'routine.minutes': 'minutos',
  'routine.finishLastSet': 'Terminei a última série! ✓',
  'routine.finishSet': 'Terminei a série →',
  'routine.exerciseCompleted': 'Concluído! ✓',

  'selector.title': 'Selecionar exercício',
  'selector.search': 'Buscar exercício...',
  'selector.noResults': 'Nenhum exercício encontrado',
  'selector.selectThis': 'Selecionar este exercício',
  'selector.instructions': 'Instruções',

  'menu.home': 'Início',
  'menu.setup': 'Configurar rotina',
  'menu.days': 'Dias',
  'menu.routines': 'Rotinas',
  'menu.config': 'Configurações'
};

export const UI_DICT: Record<Lang, Dict> = {
  es,
  en,
  'pt-BR': ptBR
};

/** Nombres de los días de la semana por id (1=Lunes ... 7=Domingo) en cada idioma. */
export const DAY_NAMES: Record<Lang, Record<number, string>> = {
  es: { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' },
  en: { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' },
  'pt-BR': { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado', 7: 'Domingo' }
};

/** Etiquetas de las categorías (body_part) en cada idioma. */
export const BODY_PART_LABELS_I18N: Record<Lang, Record<string, string>> = {
  es: {
    back: 'Espalda', cardio: 'Cardio', chest: 'Pecho', 'lower arms': 'Antebrazos',
    'lower legs': 'Pantorrillas', neck: 'Cuello', shoulders: 'Hombros',
    'upper arms': 'Brazos', 'upper legs': 'Piernas', waist: 'Abdomen'
  },
  en: {
    back: 'Back', cardio: 'Cardio', chest: 'Chest', 'lower arms': 'Forearms',
    'lower legs': 'Calves', neck: 'Neck', shoulders: 'Shoulders',
    'upper arms': 'Arms', 'upper legs': 'Legs', waist: 'Waist'
  },
  'pt-BR': {
    back: 'Costas', cardio: 'Cardio', chest: 'Peito', 'lower arms': 'Antebraços',
    'lower legs': 'Panturrilhas', neck: 'Pescoço', shoulders: 'Ombros',
    'upper arms': 'Braços', 'upper legs': 'Pernas', waist: 'Abdômen'
  }
};
