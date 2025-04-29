import React, { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  
  const handlePress = () => {
    if (disabled) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress();
  };
  
  const getBackgroundColor = () => {
    if (disabled) return Colors.neutral[300];
    
    switch (variant) {
      case 'primary':
        return Colors.primary.main;
      case 'outline':
        return Colors.transparent;
      case 'danger':
        return Colors.error.main;
      default:
        return Colors.primary.main;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return Colors.neutral[500];
    
    switch (variant) {
      case 'primary':
        return Colors.white;
      case 'outline':
        return Colors.primary.main;
      case 'danger':
        return Colors.white;
      default:
        return Colors.white;
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return Colors.neutral[300];
    
    switch (variant) {
      case 'primary':
        return Colors.primary.main;
      case 'outline':
        return Colors.primary.main;
      case 'danger':
        return Colors.error.main;
      default:
        return Colors.primary.main;
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: (pressed && !disabled) ? 0.8 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      {icon && icon}
      <Text 
        style={[
          styles.text, 
          { 
            color: getTextColor(),
            marginLeft: icon ? Layout.spacing.s : 0,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.s,
    borderWidth: 1,
    minHeight: 48,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
});