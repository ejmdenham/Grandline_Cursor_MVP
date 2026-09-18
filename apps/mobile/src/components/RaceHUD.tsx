import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export interface RaceHUDProps {
  raceName: string;
  elapsedMs: number;
  currentCheckpointIndex: number;
  totalCheckpoints: number;
  insets: { top: number };
}

export function RaceHUD({
  raceName,
  elapsedMs,
  currentCheckpointIndex,
  totalCheckpoints,
  insets,
}: RaceHUDProps) {
  return (
    <View style={[styles.overlay, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
      <View style={styles.content}>
        <Text style={styles.raceName} numberOfLines={1}>
          {raceName}
        </Text>
        <Text style={styles.elapsed}>{formatElapsed(elapsedMs)}</Text>
        <Text style={styles.progress}>
          Checkpoint {currentCheckpointIndex} / {totalCheckpoints}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  content: {
    gap: 4,
  },
  raceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  elapsed: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
});
