import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, StringKeys, Strings } from '@/constants/Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: StringKeys) => string;
  isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'domino-tracker-language';

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setIsLoading(true);
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    try {
      if (Platform.OS !== 'web') {
        // Only save to AsyncStorage on mobile platforms
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      }
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: StringKeys): string => {
    return Strings[language][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};