import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Player } from '@/types';
import { Trophy, X } from 'lucide-react-native';
import Button from './Button';
import { useRouter } from 'expo-router';
import { useGame } from '@/contexts/GameContext';

interface GameCompletionModalProps {
  visible: boolean;
  winner: Player | null | undefined;
  onClose: () => void;
}

export default function GameCompletionModal({ visible, winner, onClose }: GameCompletionModalProps) {
  const { t } = useLocalization();
  const router = useRouter();
  const { resetGame } = useGame();

  const handleNewGame = () => {
    resetGame();
    router.replace('/');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.neutral[600]} />
          </Pressable>
          
          <View style={styles.content}>
            <View style={styles.trophyContainer}>
              <Trophy size={64} color={Colors.secondary.main} />
            </View>
            
            <Text style={styles.completedText}>{t('gameCompleted')}</Text>
            
            {winner && (
              <>
                <Text style={styles.winnerTitle}>{t('winner')}</Text>
                <View 
                  style={[
                    styles.winnerBadge, 
                    { backgroundColor: winner.color }
                  ]}
                >
                  <Text style={styles.winnerName}>{winner.name}</Text>
                </View>
              </>
            )}
            
            <Button
              title={t('newGame')}
              onPress={handleNewGame}
              style={styles.newGameButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    width: '80%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: Layout.spacing.s,
    right: Layout.spacing.s,
    zIndex: 1,
    padding: Layout.spacing.xs,
  },
  content: {
    padding: Layout.spacing.xl,
    alignItems: 'center',
  },
  trophyContainer: {
    marginBottom: Layout.spacing.m,
  },
  completedText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary.dark,
    marginBottom: Layout.spacing.m,
    textAlign: 'center',
  },
  winnerTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.xs,
  },
  winnerBadge: {
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.l,
  },
  winnerName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.white,
  },
  newGameButton: {
    minWidth: 200,
  },
});