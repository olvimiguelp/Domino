export type Language = 'en' | 'es';

export type StringKeys =
  | 'appName'
  | 'newGame'
  | 'history'
  | 'targetScore'
  | 'player'
  | 'players'
  | 'addPlayer'
  | 'removePlayer'
  | 'startGame'
  | 'currentGame'
  | 'currentScores'
  | 'addRoundScore'
  | 'addPoints'
  | 'undo'
  | 'endGame'
  | 'winner'
  | 'gameHistory'
  | 'noGames'
  | 'date'
  | 'score'
  | 'gameCompleted'
  | 'settings'
  | 'language'
  | 'resetScores'
  | 'resetScoresConfirm'
  | 'reset'
  | 'cancel'
  | 'noScores'
  | 'enterScore'
  | 'error'
  | 'resetError';

export const Strings: Record<Language, Record<StringKeys, string>> = {
  en: {
    appName: 'Domino Score Tracker',
    newGame: 'New Game',
    history: 'History',
    targetScore: 'Target Score',
    player: 'Player',
    players: 'Players',
    addPlayer: 'Add Player',
    removePlayer: 'Remove Player',
    startGame: 'Start Game',
    currentGame: 'Current Game',
    currentScores: 'Current Scores',
    addRoundScore: 'Add Round Score',
    addPoints: 'Add Points',
    undo: 'Undo Last',
    endGame: 'End Game',
    winner: 'Winner',
    gameHistory: 'Game History',
    noGames: 'No games played yet',
    date: 'Date',
    score: 'Score',
    gameCompleted: 'Game Completed',
    settings: 'Settings',
    language: 'Language',
    resetScores: 'Reset Scores',
    resetScoresConfirm: 'Are you sure you want to reset all scores? This action cannot be undone.',
    reset: 'Reset',
    cancel: 'Cancel',
    noScores: 'No scores entered',
    enterScore: 'Please enter a score for at least one player.',
    error: 'Error',
    resetError: 'An error occurred while resetting scores.',
  },
  es: {
    appName: 'Contador de Puntos Dominó',
    newGame: 'Nuevo Juego',
    history: 'Historial',
    targetScore: 'Puntuación Objetivo',
    player: 'Jugador',
    players: 'Jugadores',
    addPlayer: 'Agregar Jugador',
    removePlayer: 'Eliminar Jugador',
    startGame: 'Comenzar Juego',
    currentGame: 'Juego Actual',
    currentScores: 'Puntuaciones Actuales',
    addRoundScore: 'Agregar Puntos de Ronda',
    addPoints: 'Agregar Puntos',
    undo: 'Deshacer Último',
    endGame: 'Finalizar Juego',
    winner: 'Ganador',
    gameHistory: 'Historial de Juegos',
    noGames: 'Aún no hay juegos jugados',
    date: 'Fecha',
    score: 'Puntuación',
    gameCompleted: 'Juego Completado',
    settings: 'Ajustes',
    language: 'Idioma',
    resetScores: 'Reiniciar Puntos',
    resetScoresConfirm: '¿Estás seguro de que quieres reiniciar todos los puntos? Esta acción no se puede deshacer.',
    reset: 'Reiniciar',
    cancel: 'Cancelar',
    noScores: 'No se ingresaron puntuaciones',
    enterScore: 'Por favor, ingresa una puntuación para al menos un jugador.',
    error: 'Error',
    resetError: 'Ocurrió un error al reiniciar las puntuaciones.',
  },
};