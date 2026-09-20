import React from 'react';
import { StyleSheet, View } from 'react-native';
import { color } from '../../theme/tokens';
import { PressableScale } from './PressableScale';

export function MenuWell({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} accessibilityLabel="Open menu" style={styles.well}>
      <View style={styles.stroke} />
      <View style={styles.stroke} />
      <View style={styles.stroke} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  well: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color.sand,
    borderWidth: 1.5,
    borderColor: color.dusk,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3.5,
  },
  stroke: {
    width: 18,
    height: 1.5,
    backgroundColor: color.ink,
    borderRadius: 1,
  },
});
