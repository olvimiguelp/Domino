import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Game } from '@/types';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react-native';

interface GameHistoryItemProps {
  game: Game;
}

export default function GameHistoryItem({ game }: GameHistoryItemProps) {
  const { t } = useLocalization();
  const [expanded, setExpanded] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getWinner = () => {
    if (!game.winner) return null;
    return game.players.find(player => player.id === game.winner);
  };

  const calculateFinalScores = () => {
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

  const finalScores = calculateFinalScores();
  const winner = getWinner();

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View>
          <Text style={styles.date}>{formatDate(game.dateStarted)}</Text>
          <Text style={styles.playerCount}>
            {game.players.length} {t('players')} • {t('targetScore')}: {game.targetScore}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {winner && (
            <View style={styles.winnerBadge}>
              <Trophy size={12} color={Colors.white} />
              <Text style={styles.winnerText}>{winner.name}</Text>
            </View>
          )}
          {expanded ? 
            <ChevronUp size={20} color={Colors.neutral[600]} /> : 
            <ChevronDown size={20} color={Colors.neutral[600]} />
          }
        </View>
      </Pressable>
      
      {expanded && (
        <View style={styles.details}>
          <Text style={styles.detailsTitle}>{t('currentScores')}</Text>
          
          {game.players.map(player => (
            <View key={player.id} style={styles.scoreRow}>
              <View style={[styles.playerIndicator, { backgroundColor: player.color }]} />
              <Text style={styles.playerName}>{player.name}</Text>
              <Text 
                style={[
                  styles.playerScore,
                  player.id === game.winner && styles.winnerScore
                ]}
              >
                {finalScores[player.id] || 0}
              </Text>
            </View>
          ))}
          
          <Text style={styles.roundsText}>
            {game.rounds.length} {game.rounds.length === 1 ? 'round' : 'rounds'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.m,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Layout.spacing.m,
  },
  date: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  playerCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success.main,
    borderRadius: Layout.borderRadius.pill,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 4,
    marginRight: Layout.spacing.s,
  },
  winnerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.white,
    marginLeft: 4,
  },
  details: {
    padding: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  detailsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: Layout.spacing.s,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  playerIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Layout.spacing.xs,
  },
  playerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    flex: 1,
  },
  playerScore: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  winnerScore: {
    color: Colors.success.main,
  },
  roundsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: Layout.spacing.s,
    textAlign: 'right',
  },
});