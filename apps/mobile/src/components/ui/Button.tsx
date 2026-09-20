import React from 'react';
import { ActivityIndicator, StyleSheet, Text, type ViewStyle } from 'react-native';
import { color, radius, size, type } from '../../theme/tokens';
import { PressableScale } from './PressableScale';

export type ButtonKind = 'ember' | 'quiet' | 'ghost' | 'flare';

interface ButtonProps {
  label: string;
  onPress: () => void;
  kind?: ButtonKind;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const kindStyles: Record<ButtonKind, { fill: string; label: string; border: string }> = {
  ember: { fill: color.ember, label: color.emberInk, border: color.ember },
  quiet: { fill: color.ink, label: color.emberInk, border: color.ink },
  ghost: { fill: color.paper, label: color.ink, border: color.dusk },
  flare: { fill: color.flare, label: color.emberInk, border: color.flare },
};

export function Button({
  label,
  onPress,
  kind = 'ember',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const palette = kindStyles[kind];
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: palette.fill,
          borderColor: palette.border,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.label} />
      ) : (
        <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: size.touch,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  label: {
    ...type.action,
  },
});
