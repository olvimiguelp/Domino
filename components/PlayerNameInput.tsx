import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Player } from '@/types';
import { useLocalization } from '@/contexts/LocalizationContext';

interface PlayerNameInputProps {
  player: Player;
  index: number;
  onChange: (id: string, name: string) => void;
}

export default function PlayerNameInput({ player, index, onChange }: PlayerNameInputProps) {
  const { t } = useLocalization();
  
  return (
    <View style={styles.container}>
      <View style={[styles.colorIndicator, { backgroundColor: player.color }]} />
      <TextInput
        style={styles.input}
        value={player.name}
        onChangeText={(text) => onChange(player.id, text)}
        placeholder={`${t('player')} ${index + 1}`}
        maxLength={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Layout.spacing.s,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.s,
    padding: Layout.spacing.s,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});