import React from 'react';
import { StyleSheet, View } from 'react-native';
import { color } from '../../theme/tokens';
import { PressableScale } from '../ui/PressableScale';

export function RecenterFab({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel="Center map"
      style={styles.fab}
    >
      <View style={styles.vertical} />
      <View style={styles.horizontal} />
      <View style={styles.core} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.dusk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical: {
    position: 'absolute',
    width: 1.5,
    height: 18,
    backgroundColor: color.ink,
    borderRadius: 1,
  },
  horizontal: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: color.ink,
    borderRadius: 1,
  },
  core: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.ember,
  },
});
