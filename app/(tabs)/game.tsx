import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useGame } from '@/contexts/GameContext';
import ScoreDisplay from '@/components/ScoreDisplay';
import Button from '@/components/Button';
import NumberPad from '@/components/NumberPad';
import GameCompletionModal from '@/components/GameCompletionModal';
import { Trophy, RotateCcw, ArrowRight, Languages, RefreshCw } from 'lucide-react-native';

export default function GameScreen() {
  const { t, language, setLanguage } = useLocalization();
  const router = useRouter();
  const { activeGame, getCurrentScores, addRound, undoLastRound, hasReachedTargetScore, getWinner, resetGame, createGame } = useGame();
  
  const [roundScores, setRoundScores] = useState<Record<string, string>>({});
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we have an active game before attempting navigation
    if (activeGame === null || activeGame === undefined) {
      router.replace('/');
      return;
    }

    // Initialize round scores with empty strings
    const initialScores: Record<string, string> = {};
    activeGame.players.forEach(player => {
      initialScores[player.id] = '';
    });
    setRoundScores(initialScores);

    // Check if game has been won
    if (hasReachedTargetScore()) {
      setShowWinnerModal(true);
    }
  }, [activeGame, router, hasReachedTargetScore]);

  const handleScoreChange = (playerId: string, value: string) => {
    setRoundScores(prev => ({
      ...prev,
      [playerId]: value,
    }));
    setActivePlayer(playerId);
  };

  const handleNumberPadInput = (value: string) => {
    if (!activePlayer) return;

    if (value === 'backspace') {
      setRoundScores(prev => ({
        ...prev,
        [activePlayer]: prev[activePlayer].slice(0, -1),
      }));
    } else if (value === 'clear') {
      setRoundScores(prev => ({
        ...prev,
        [activePlayer]: '',
      }));
    } else {
      setRoundScores(prev => ({
        ...prev,
        [activePlayer]: (prev[activePlayer] || '') + value,
      }));
    }
  };

  const handleAddRound = () => {
    if (!activeGame) return;

    // Convert string scores to numbers
    const scores: Record<string, number> = {};
    let hasScores = false;

    for (const [playerId, scoreStr] of Object.entries(roundScores)) {
      const score = parseInt(scoreStr);
      if (!isNaN(score) && score > 0) {
        scores[playerId] = score;
        hasScores = true;
      } else {
        scores[playerId] = 0;
      }
    }

    if (!hasScores) {
      Alert.alert('No Scores', 'Please enter at least one score greater than zero.');
      return;
    }

    // Add the round
    addRound(scores);

    // Reset round scores
    const resetScores: Record<string, string> = {};
    activeGame.players.forEach(player => {
      resetScores[player.id] = '';
    });
    setRoundScores(resetScores);

    // Check if game has been won
    if (hasReachedTargetScore()) {
      setShowWinnerModal(true);
    }
  };

  const handleUndo = () => {
    undoLastRound();
    setShowWinnerModal(false);
  };

  const handleNewGame = () => {
    resetGame();
    router.replace('/');
  };

  const handleResetScores = () => {
    if (!activeGame) return;
    // Create a new game with same players and target score but no rounds
    createGame(activeGame.targetScore, activeGame.players);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleScoreInputFocus = (playerId: string) => {
    setActivePlayer(playerId);
  };

  if (!activeGame) {
    return null;
  }

  const currentScores = getCurrentScores();
  const winner = getWinner();
  const winnerPlayer = winner ? activeGame.players.find(p => p.id === winner) : null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Button
            title={language === 'en' ? 'ES' : 'EN'}
            onPress={toggleLanguage}
            icon={<Languages size={18} color={Colors.primary.main} />}
            variant="outline"
            style={styles.headerButton}
          />
          <Button
            title={t('resetScores')}
            onPress={handleResetScores}
            icon={<RefreshCw size={18} color={Colors.error.main} />}
            variant="danger"
            style={styles.headerButton}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('currentScores')}</Text>
            <Text style={styles.targetScoreText}>
              {t('targetScore')}: {activeGame.targetScore}
            </Text>
          </View>
          
          <View style={styles.scoresContainer}>
            {activeGame.players.map((player) => (
              <ScoreDisplay
                key={player.id}
                player={player}
                score={currentScores[player.id] || 0}
                isLeader={
                  Object.entries(currentScores).reduce(
                    (leaderId, [id, score]) => 
                      score > (currentScores[leaderId] || 0) ? id : leaderId,
                    activeGame.players[0].id
                  ) === player.id
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('addRoundScore')}</Text>
          
          <View style={styles.roundScoresContainer}>
            {activeGame.players.map((player) => (
              <View key={player.id} style={styles.roundScoreRow}>
                <View style={[styles.playerIndicator, { backgroundColor: player.color }]} />
                <Text style={styles.playerNameText}>{player.name}</Text>
                <TextInput
                  style={[
                    styles.roundScoreInput,
                    activePlayer === player.id && styles.activeInput
                  ]}
                  value={roundScores[player.id] || ''}
                  onChangeText={(value) => handleScoreChange(player.id, value)}
                  keyboardType="numeric"
                  maxLength={3}
                  onFocus={() => handleScoreInputFocus(player.id)}
                  placeholder="0"
                />
              </View>
            ))}
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              title={t('undo')}
              onPress={handleUndo}
              variant="outline"
              icon={<RotateCcw size={18} color={Colors.primary.main} />}
              style={{ flex: 1, marginRight: Layout.spacing.s }}
              disabled={activeGame.rounds.length === 0}
            />
            <Button
              title={t('addPoints')}
              onPress={handleAddRound}
              icon={<ArrowRight size={18} color={Colors.white} />}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <Button
          title={t('newGame')}
          onPress={handleNewGame}
          style={styles.newGameButton}
        />
      </ScrollView>

      {Platform.OS !== 'web' && (
        <NumberPad 
          onPress={handleNumberPadInput} 
          activePlayer={activePlayer}
          playerColors={activeGame.players.reduce((colors, player) => {
            colors[player.id] = player.color;
            return colors;
          }, {} as Record<string, string>)}
        />
      )}

      {showWinnerModal && (
        <GameCompletionModal
          visible={showWinnerModal}
          winner={winnerPlayer}
          onClose={() => setShowWinnerModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.m,
    paddingBottom: Platform.OS !== 'web' ? 100 : Layout.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.m,
  },
  headerButton: {
    minWidth: 120,
  },
  section: {
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
  sectionHeader: {
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
  targetScoreText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  scoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roundScoresContainer: {
    marginBottom: Layout.spacing.m,
  },
  roundScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  playerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Layout.spacing.s,
  },
  playerNameText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[700],
    flex: 1,
  },
  roundScoreInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.s,
    padding: Layout.spacing.s,
    width: 80,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  activeInput: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '10',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newGameButton: {
    marginTop: Layout.spacing.m,
  },
});