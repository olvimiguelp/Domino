import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Player } from '@/types';
import { Trophy } from 'lucide-react-native';

interface ScoreDisplayProps {
  player: Player;
  score: number;
  isLeader: boolean;
}

export default function ScoreDisplay({ player, score, isLeader }: ScoreDisplayProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [score]);

  const animatedScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ scale: animatedScale }],
          borderColor: player.color,
          backgroundColor: player.color + '10', // 10% opacity
        }
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.colorIndicator, { backgroundColor: player.color }]} />
        <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
        {isLeader && <Trophy size={16} color={Colors.secondary.main} />}
      </View>
      <Text style={styles.score}>{score}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Layout.spacing.xs,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    flex: 1,
  },
  score: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.primary.dark,
    textAlign: 'center',
  },
});