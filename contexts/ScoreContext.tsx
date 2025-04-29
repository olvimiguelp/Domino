import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScoreData {
  currentScores: Record<string, number>;
  highScores: Record<string, number>;
  lastResetTimestamp: number;
  expirationDate: number;
}

interface ScoreContextType {
  currentScores: Record<string, number>;
  highScores: Record<string, number>;
  updateScore: (playerId: string, score: number) => Promise<void>;
  resetScores: () => Promise<void>;
}

const SCORE_STORAGE_KEY = 'domino-tracker-scores';
const EXPIRATION_DAYS = 5;

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scoreData, setScoreData] = useState<ScoreData>({
    currentScores: {},
    highScores: {},
    lastResetTimestamp: Date.now(),
    expirationDate: Date.now() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
  });

  // Load scores from storage on mount
  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const storedData = await AsyncStorage.getItem(SCORE_STORAGE_KEY);
      
      if (storedData) {
        const parsedData: ScoreData = JSON.parse(storedData);
        
        // Check if data has expired
        if (Date.now() > parsedData.expirationDate) {
          await resetScores();
        } else {
          setScoreData(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading scores:', error);
      // Handle storage errors by resetting to defaults
      await resetScores();
    }
  };

  const saveScores = async (data: ScoreData) => {
    try {
      await AsyncStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving scores:', error);
      // Handle storage full or other errors
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Clear old data if storage is full
        await AsyncStorage.clear();
        await AsyncStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(data));
      }
    }
  };

  const updateScore = async (playerId: string, score: number) => {
    const newScoreData = {
      ...scoreData,
      currentScores: {
        ...scoreData.currentScores,
        [playerId]: score,
      },
      highScores: {
        ...scoreData.highScores,
        [playerId]: Math.max(score, scoreData.highScores[playerId] || 0),
      },
    };

    setScoreData(newScoreData);
    await saveScores(newScoreData);
  };

  const resetScores = async () => {
    const newScoreData: ScoreData = {
      currentScores: {},
      highScores: {},
      lastResetTimestamp: Date.now(),
      expirationDate: Date.now() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    };

    setScoreData(newScoreData);
    await saveScores(newScoreData);
  };

  return (
    <ScoreContext.Provider value={{
      currentScores: scoreData.currentScores,
      highScores: scoreData.highScores,
      updateScore,
      resetScores,
    }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScores = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScores must be used within a ScoreProvider');
  }
  return context;
};