import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Game, Player, Round, GameContextType } from '@/types';
import { Colors } from '@/constants/Colors';
import { Platform } from 'react-native';

const GameContext = createContext<GameContextType | undefined>(undefined);

const GAMES_STORAGE_KEY = 'domino-tracker-games';

export const GameContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load games from AsyncStorage on mount
  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
        if (storedGames) {
          const parsedGames: Game[] = JSON.parse(storedGames);
          setGames(parsedGames);
          
          // Find active game if any
          const active = parsedGames.find(game => game.isActive);
          if (active) {
            setActiveGame(active);
          }
        }
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  // Save games to AsyncStorage whenever they change
  useEffect(() => {
    const saveGames = async () => {
      try {
        if (Platform.OS !== 'web') {
          // Only save to AsyncStorage on mobile platforms
          await AsyncStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
        }
      } catch (error) {
        console.error('Failed to save games:', error);
      }
    };

    if (games.length > 0) {
      saveGames();
    }
  }, [games]);

  // Create a new game
  const createGame = (targetScore: number, players: Player[]) => {
    // If there's an active game, end it first
    if (activeGame) {
      endGame();
    }

    const newGame: Game = {
      id: uuidv4(),
      dateStarted: Date.now(),
      dateEnded: null,
      targetScore,
      players: players.map((player, index) => ({
        ...player,
        color: Colors.player[index % Colors.player.length],
      })),
      rounds: [],
      winner: null,
      isActive: true,
    };

    setActiveGame(newGame);
    setGames(prevGames => [newGame, ...prevGames]);
  };

  // Add a round to the active game
  const addRound = (scores: Record<string, number>) => {
    if (!activeGame) return;

    const newRound: Round = {
      id: uuidv4(),
      timestamp: Date.now(),
      scores,
    };

    const updatedGame = {
      ...activeGame,
      rounds: [...activeGame.rounds, newRound],
    };

    // Check if any player has reached the target score
    const currentScores = getCurrentScoresForGame(updatedGame);
    const winningPlayer = Object.entries(currentScores).find(
      ([_, score]) => score >= updatedGame.targetScore
    );

    if (winningPlayer) {
      updatedGame.winner = winningPlayer[0];
      updatedGame.isActive = false;
      updatedGame.dateEnded = Date.now();
    }

    setActiveGame(updatedGame);
    setGames(prevGames => 
      prevGames.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
  };

  // Undo the last round of the active game
  const undoLastRound = () => {
    if (!activeGame || activeGame.rounds.length === 0) return;

    const updatedGame = {
      ...activeGame,
      rounds: activeGame.rounds.slice(0, -1),
      winner: null,
      isActive: true,
      dateEnded: null,
    };

    setActiveGame(updatedGame);
    setGames(prevGames => 
      prevGames.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
  };

  // End the active game
  const endGame = () => {
    if (!activeGame) return;

    const updatedGame = {
      ...activeGame,
      isActive: false,
      dateEnded: Date.now(),
    };

    setActiveGame(null);
    setGames(prevGames => 
      prevGames.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
  };

  // Reset all games
  const resetAllGames = async () => {
    try {
      await AsyncStorage.removeItem(GAMES_STORAGE_KEY);
      setGames([]);
      setActiveGame(null);
    } catch (error) {
      console.error('Failed to reset games:', error);
      throw new Error('Failed to reset games');
    }
  };

  // Reset the active game
  const resetGame = () => {
    setActiveGame(null);
  };

  // Calculate current scores for a game
  const getCurrentScoresForGame = (game: Game): Record<string, number> => {
    const scores: Record<string, number> = {};
    
    // Initialize scores for all players
    game.players.forEach(player => {
      scores[player.id] = 0;
    });

    // Sum up scores from all rounds
    game.rounds.forEach(round => {
      Object.entries(round.scores).forEach(([playerId, points]) => {
        scores[playerId] = (scores[playerId] || 0) + points;
      });
    });

    return scores;
  };

  // Get current scores for the active game
  const getCurrentScores = (): Record<string, number> => {
    if (!activeGame) return {};
    return getCurrentScoresForGame(activeGame);
  };

  // Check if any player has reached the target score
  const hasReachedTargetScore = (): boolean => {
    if (!activeGame) return false;
    
    const currentScores = getCurrentScores();
    return Object.values(currentScores).some(score => score >= activeGame.targetScore);
  };

  // Get the winner of the active game
  const getWinner = (): string | null => {
    if (!activeGame) return null;
    return activeGame.winner;
  };

  return (
    <GameContext.Provider value={{
      activeGame,
      games,
      createGame,
      addRound,
      undoLastRound,
      endGame,
      resetGame,
      resetAllGames,
      getCurrentScores,
      getWinner,
      hasReachedTargetScore,
      isLoading,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameContextProvider');
  }
  return context;
};