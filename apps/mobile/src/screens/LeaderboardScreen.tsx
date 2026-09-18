import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { MainDrawerParamList } from '../navigation/types';
import { useRace } from '../contexts/RaceContext';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard } from '../services/leaderboard';
import type { LeaderboardResult, LeaderboardEntry } from '../types/leaderboard';

type Props = DrawerScreenProps<MainDrawerParamList, 'Leaderboard'>;

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function statusLabel(entry: LeaderboardEntry): string {
  switch (entry.status) {
    case 'finished':
      return entry.finishTimeMs != null ? formatTime(entry.finishTimeMs) : 'Finished';
    case 'in_progress':
      return 'In progress';
    case 'dnf':
      return 'DNF';
    default:
      return '—';
  }
}

function LeaderboardRow({
  entry,
  index,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
}) {
  return (
    <View style={[styles.row, isCurrentUser && styles.rowHighlight]}>
      <Text style={styles.rank}>{index + 1}</Text>
      <View style={styles.nameAndStatus}>
        <Text style={[styles.name, isCurrentUser && styles.nameHighlight]} numberOfLines={1}>
          {entry.name}
          {isCurrentUser ? ' (you)' : ''}
        </Text>
        <Text style={styles.status}>{statusLabel(entry)}</Text>
      </View>
    </View>
  );
}

export function LeaderboardScreen({ route }: Props) {
  const raceIdFromParams = route.params?.raceId;
  const { currentRace } = useRace();
  const { session } = useAuth();
  const currentUserId = session?.user?.id;

  const raceId = raceIdFromParams ?? currentRace?.id ?? null;

  const [result, setResult] = useState<LeaderboardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!raceId) {
      setResult(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getLeaderboard(raceId)
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        if (__DEV__) {
          setResult({
            raceId,
            raceName: currentRace?.name ?? 'Race',
            entries: [
              { name: 'You', status: 'finished', finishTimeMs: 324000, userId: currentUserId, placement: 1 },
              { name: 'Runner 2', status: 'finished', finishTimeMs: 330000, placement: 2 },
              { name: 'Runner 3', status: 'in_progress' },
              { name: 'Runner 4', status: 'dnf' },
            ],
          });
        } else {
          setResult(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [raceId, currentRace?.name, currentUserId]);

  if (!raceId) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No race selected</Text>
        <Text style={styles.emptySubtitle}>
          Finish a race or open leaderboard from the post-race screen.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading leaderboard…</Text>
      </View>
    );
  }

  if (error && !result) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.emptySubtitle}>No results yet for this race.</Text>
      </View>
    );
  }

  const data = result!;
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: Math.max(20, width * 0.05) }]}>
        <Text style={styles.title} numberOfLines={1}>{data.raceName}</Text>
        <Text style={styles.subtitle}>Leaderboard</Text>
      </View>
      <FlatList
        data={data.entries}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <LeaderboardRow
            entry={item}
            index={index}
            isCurrentUser={currentUserId != null && item.userId === currentUserId}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptySubtitle}>No results yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  rowHighlight: {
    backgroundColor: '#e8f0fe',
  },
  rank: {
    width: 32,
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  nameAndStatus: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  nameHighlight: {
    color: '#1967d2',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#c00',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
