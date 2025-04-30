import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      setIsLoading(true);
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
      await resetScores();
    } finally {
      setIsLoading(false);
    }
  };

  const saveScores = async (data: ScoreData) => {
    try {
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving scores:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
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
    if (Platform.OS !== 'web') {
      await saveScores(newScoreData);
    }
  };

  const resetScores = async () => {
    const newScoreData: ScoreData = {
      currentScores: {},
      highScores: {},
      lastResetTimestamp: Date.now(),
      expirationDate: Date.now() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    };

    // Update state immediately
    setScoreData(newScoreData);

    // Save to storage if on mobile
    if (Platform.OS !== 'web') {
      try {
        await AsyncStorage.removeItem(SCORE_STORAGE_KEY);
        await saveScores(newScoreData);
      } catch (error) {
        console.error('Error resetting scores:', error);
      }
    }
  };

  return (
    <ScoreContext.Provider value={{
      currentScores: scoreData.currentScores,
      highScores: scoreData.highScores,
      updateScore,
      resetScores,
      isLoading,
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