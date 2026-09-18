import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { MainDrawerParamList } from '../../navigation/types';

export interface PostRaceContentProps {
  /** Finish time in milliseconds */
  finishTimeMs: number;
  /** 1-based placement when available from API; otherwise undefined */
  placement?: number;
  raceName: string;
  raceId: string;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function PostRaceContent({
  finishTimeMs,
  placement,
  raceName,
  raceId,
}: PostRaceContentProps) {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList, 'Leaderboard'>>();

  const onViewLeaderboard = () => {
    navigation.navigate('Leaderboard', { raceId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{raceName}</Text>
      <Text style={styles.finishLabel}>Finish time</Text>
      <Text style={styles.finishTime}>{formatTime(finishTimeMs)}</Text>
      {placement != null ? (
        <Text style={styles.placement}>Place: {placement}</Text>
      ) : null}
      <TouchableOpacity style={styles.cta} onPress={onViewLeaderboard}>
        <Text style={styles.ctaText}>View Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  finishLabel: {
    fontSize: 14,
    color: '#666',
  },
  finishTime: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066cc',
  },
  placement: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cta: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
