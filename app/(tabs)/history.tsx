import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useGame } from '@/contexts/GameContext';
import GameHistoryItem from '@/components/GameHistoryItem';
import { CalendarDays } from 'lucide-react-native';

export default function HistoryScreen() {
  const { t } = useLocalization();
  const { games } = useGame();

  // Sort games by date (most recent first)
  const sortedGames = [...games].sort((a, b) => b.dateStarted - a.dateStarted);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('gameHistory')}</Text>
      </View>
      
      {sortedGames.length > 0 ? (
        <FlatList
          data={sortedGames}
          renderItem={({ item }) => <GameHistoryItem game={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <CalendarDays size={64} color={Colors.neutral[400]} />
          <Text style={styles.emptyText}>{t('noGames')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[300],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary.dark,
  },
  listContent: {
    padding: Layout.spacing.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: Layout.spacing.m,
    textAlign: 'center',
  },
});