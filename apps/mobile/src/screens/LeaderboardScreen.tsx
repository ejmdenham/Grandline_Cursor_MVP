import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { MainDrawerParamList } from '../navigation/types';
import { useRace } from '../contexts/RaceContext';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard } from '../services/leaderboard';
import type { LeaderboardResult, LeaderboardEntry } from '../types/leaderboard';
import { InstrumentPage } from '../components/ui/InstrumentPage';
import { color, radius, type } from '../theme/tokens';
import { formatElapsed } from '../theme/format';

type Props = DrawerScreenProps<MainDrawerParamList, 'Leaderboard'>;

function statusLabel(entry: LeaderboardEntry): string {
  switch (entry.status) {
    case 'finished':
      return entry.finishTimeMs != null ? formatElapsed(entry.finishTimeMs) : 'Finished';
    case 'in_progress':
      return 'Live';
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
  const rank = entry.placement ?? index + 1;
  return (
    <View style={[styles.row, isCurrentUser && styles.rowYou]}>
      {isCurrentUser ? <View style={styles.youBar} /> : null}
      <Text style={styles.rank}>{rank}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {entry.name}
        {isCurrentUser ? ' · You' : ''}
      </Text>
      <Text
        style={[
          styles.time,
          entry.status === 'dnf' && styles.dnf,
          entry.status === 'finished' && styles.finishedTime,
        ]}
      >
        {statusLabel(entry)}
      </Text>
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
        setResult(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [raceId]);

  if (!raceId) {
    return (
      <InstrumentPage title="Leaderboard" meta="No race selected">
        <Text style={styles.empty}>Finish a race or open this from the sheet.</Text>
      </InstrumentPage>
    );
  }

  if (loading) {
    return (
      <InstrumentPage title="Leaderboard">
        <View style={styles.center}>
          <ActivityIndicator size="large" color={color.ember} />
          <Text style={styles.empty}>Loading leaderboard…</Text>
        </View>
      </InstrumentPage>
    );
  }

  if (error && !result) {
    return (
      <InstrumentPage title="Leaderboard" meta="Could not load">
        <Text style={styles.error}>{error}</Text>
      </InstrumentPage>
    );
  }

  const data = result!;

  return (
    <InstrumentPage title={data.raceName} meta="Leaderboard">
      <FlatList
        data={data.entries}
        keyExtractor={(item, index) => item.userId ?? `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <LeaderboardRow
            entry={item}
            index={index}
            isCurrentUser={currentUserId != null && item.userId === currentUserId}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No results yet. Start the race to appear.</Text>}
      />
    </InstrumentPage>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: color.dusk,
    backgroundColor: color.paper,
    borderRadius: radius.md,
    marginBottom: 8,
    overflow: 'hidden',
  },
  rowYou: {
    backgroundColor: color.sand,
  },
  youBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: color.ember,
  },
  rank: {
    ...type.action,
    color: color.dusk,
    width: 28,
  },
  name: {
    ...type.action,
    color: color.ink,
    flex: 1,
  },
  time: {
    ...type.action,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  finishedTime: {
    color: color.ink,
  },
  dnf: {
    color: color.flare,
  },
  empty: {
    ...type.body,
    color: color.stone,
    textAlign: 'center',
    marginTop: 24,
  },
  error: {
    ...type.body,
    color: color.flare,
    marginTop: 16,
  },
});
