import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useGame } from '@/contexts/GameContext';
import { Player } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import PlayerNameInput from '@/components/PlayerNameInput';
import Button from '@/components/Button';
import { X, Plus, Languages } from 'lucide-react-native';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function NewGameScreen() {
  const { t, language, setLanguage } = useLocalization();
  const router = useRouter();
  const { createGame, activeGame } = useGame();
  
  const [targetScore, setTargetScore] = useState('100');
  const [players, setPlayers] = useState<Player[]>([
    { id: uuidv4(), name: '', color: Colors.player[0] },
    { id: uuidv4(), name: '', color: Colors.player[1] },
  ]);

  useEffect(() => {
    // If there's an active game, redirect to it
    if (activeGame) {
      router.replace('/game');
    }
  }, [activeGame, router]);

  const handleAddPlayer = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (players.length < Layout.maxPlayers) {
      setPlayers([
        ...players, 
        { 
          id: uuidv4(), 
          name: '', 
          color: Colors.player[players.length % Colors.player.length] 
        }
      ]);
    }
  };

  const handleRemovePlayer = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (players.length > 2) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const handlePlayerNameChange = (id: string, name: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, name } : player
    ));
  };

  const handleStartGame = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Set default player names if empty
    const finalPlayers = players.map((player, index) => ({
      ...player,
      name: player.name.trim() || `${t('player')} ${index + 1}`,
    }));

    createGame(parseInt(targetScore) || 100, finalPlayers);
    router.replace('/game');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const isStartDisabled = players.some(player => !player.name.trim()) || !targetScore;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>{t('newGame')}</Text>
          <Button
            title={language === 'en' ? 'ES' : 'EN'}
            onPress={toggleLanguage}
            icon={<Languages size={18} color={Colors.primary.main} />}
            variant="outline"
            style={styles.languageButton}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('targetScore')}</Text>
          <TextInput
            style={styles.input}
            value={targetScore}
            onChangeText={setTargetScore}
            keyboardType="numeric"
            maxLength={4}
            placeholder="100"
          />
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.label}>{t('players')} ({players.length}/{Layout.maxPlayers})</Text>
          
          {players.map((player, index) => (
            <View key={player.id} style={styles.playerRow}>
              <PlayerNameInput
                player={player}
                index={index}
                onChange={handlePlayerNameChange}
              />
              {players.length > 2 && (
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemovePlayer(player.id)}
                >
                  <X size={18} color={Colors.error.main} />
                </Pressable>
              )}
            </View>
          ))}
          
          {players.length < Layout.maxPlayers && (
            <Button
              title={t('addPlayer')}
              onPress={handleAddPlayer}
              variant="outline"
              icon={<Plus size={18} color={Colors.primary.main} />}
              style={styles.addPlayerButton}
            />
          )}
        </View>
        
        <Button
          title={t('startGame')}
          onPress={handleStartGame}
          disabled={isStartDisabled}
          style={styles.startButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Layout.spacing.m,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.primary.dark,
  },
  languageButton: {
    minWidth: 100,
  },
  inputGroup: {
    marginBottom: Layout.spacing.m,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[700],
    marginBottom: Layout.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.s,
    padding: Layout.spacing.s,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  playersSection: {
    marginBottom: Layout.spacing.l,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  removeButton: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.xs,
  },
  addPlayerButton: {
    marginTop: Layout.spacing.s,
  },
  startButton: {
    marginTop: Layout.spacing.m,
  },
});