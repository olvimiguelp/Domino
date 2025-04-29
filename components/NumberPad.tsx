import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Delete, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface NumberPadProps {
  onPress: (value: string) => void;
  activePlayer: string | null;
  playerColors: Record<string, string>;
}

export default function NumberPad({ onPress, activePlayer, playerColors }: NumberPadProps) {
  const handlePress = (value: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(value);
  };

  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'clear', '0', 'backspace'
  ];

  const activeColor = activePlayer ? playerColors[activePlayer] : Colors.primary.main;

  return (
    <View 
      style={[
        styles.container,
        { borderTopColor: activeColor }
      ]}
    >
      <View style={styles.grid}>
        {buttons.map((value) => (
          <Pressable
            key={value}
            style={({ pressed }) => [
              styles.button,
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: 
                  value === 'clear' || value === 'backspace' 
                    ? Colors.neutral[200] 
                    : Colors.white,
              }
            ]}
            onPress={() => handlePress(value)}
          >
            {value === 'backspace' ? (
              <Delete size={24} color={Colors.neutral[700]} />
            ) : value === 'clear' ? (
              <X size={24} color={Colors.neutral[700]} />
            ) : (
              <Text style={styles.buttonText}>{value}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 4,
    paddingVertical: Layout.spacing.s,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: Layout.spacing.xs,
  },
  button: {
    width: '32%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.borderRadius.s,
    margin: '0.6%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
  },
});