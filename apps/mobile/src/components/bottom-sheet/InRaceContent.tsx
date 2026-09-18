import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface InRaceContentProps {
  distanceToNextMeters: number | null;
  lastCompletedMessage: string | null;
  onCenterMap: () => void;
}

export function InRaceContent({
  distanceToNextMeters,
  lastCompletedMessage,
  onCenterMap,
}: InRaceContentProps) {
  const distanceText =
    distanceToNextMeters !== null
      ? distanceToNextMeters === 0
        ? 'Final checkpoint'
        : `${distanceToNextMeters} m to next`
      : '—';

  return (
    <View style={styles.container}>
      <Text style={styles.distance}>{distanceText}</Text>
      {lastCompletedMessage ? (
        <Text style={styles.completed}>{lastCompletedMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.cta} onPress={onCenterMap}>
        <Text style={styles.ctaText}>Center Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  distance: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  completed: {
    fontSize: 14,
    color: '#0a0',
    fontWeight: '600',
  },
  cta: {
    backgroundColor: '#666',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
