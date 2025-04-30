export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface Round {
  id: string;
  timestamp: number;
  scores: Record<string, number>;
}

export interface Game {
  id: string;
  dateStarted: number;
  dateEnded: number | null;
  targetScore: number;
  players: Player[];
  rounds: Round[];
  winner: string | null;
  isActive: boolean;
}

export interface GameContextType {
  activeGame: Game | null;
  games: Game[];
  createGame: (targetScore: number, players: Player[]) => void;
  addRound: (scores: Record<string, number>) => void;
  undoLastRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  resetAllGames: () => void;
  getCurrentScores: () => Record<string, number>;
  getWinner: () => string | null;
  hasReachedTargetScore: () => boolean;
  isLoading: boolean;
}