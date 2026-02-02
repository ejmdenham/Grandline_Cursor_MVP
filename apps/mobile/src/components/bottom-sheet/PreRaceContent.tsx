import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRace } from '../../contexts/RaceContext';
import type { Race } from '../../types/race';

function formatCountdown(startWindow: string): string {
  try {
    const start = new Date(startWindow).getTime();
    const now = Date.now();
    const diff = start - now;
    if (diff <= 0) return 'Ready to start';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days}d ${hours % 24}h`;
    }
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    if (minutes > 0) return `Starts in ${minutes}m`;
    return 'Starts in < 1m';
  } catch {
    return 'Start window set';
  }
}

function ModeBadges({ amot }: { amot: string[] }) {
  const labels: Record<string, string> = { run: 'Run', bike: 'Bike' };
  return (
    <View style={styles.modeRow}>
      {amot.map((mode) => (
        <View key={mode} style={styles.modeBadge}>
          <Text style={styles.modeText}>{labels[mode] ?? mode}</Text>
        </View>
      ))}
    </View>
  );
}

export function PreRaceContent({ race }: { race: Race }) {
  const { setRaceState } = useRace();
  const [countdown, setCountdown] = useState(formatCountdown(race.start_window));

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(formatCountdown(race.start_window));
    }, 60_000);
    return () => clearInterval(t);
  }, [race.start_window]);

  const onStartRace = () => {
    setRaceState('in-race');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{race.name}</Text>
      {race.checkpoints?.length ? (
        <Text style={styles.subtitle}>
          {race.checkpoints.length} checkpoint{race.checkpoints.length !== 1 ? 's' : ''}
        </Text>
      ) : null}
      <ModeBadges amot={race.amot ?? []} />
      <View style={styles.countdown}>
        <Text style={styles.countdownText}>{countdown}</Text>
      </View>
      <TouchableOpacity style={styles.cta} onPress={onStartRace}>
        <Text style={styles.ctaText}>Start Race</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1967d2',
  },
  countdown: {
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cta: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
