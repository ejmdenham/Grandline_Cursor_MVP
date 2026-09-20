import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRace } from '../../contexts/RaceContext';
import type { Race } from '../../types/race';
import { Button } from '../ui/Button';
import { CourseTicks } from '../ui/CourseTicks';
import { color, type } from '../../theme/tokens';
import {
  formatDistanceKm,
  formatOpensIn,
  modeMeta,
} from '../../theme/format';
import { courseLengthMeters } from '../../services/checkpointDetection';

export function PreRaceContent({ race }: { race: Race }) {
  const { startRace } = useRace();
  const [opens, setOpens] = useState(formatOpensIn(race.start_window));
  const gates = race.checkpoints?.length ?? 0;
  const length = formatDistanceKm(courseLengthMeters(race.checkpoints ?? []));
  const modes = modeMeta(race.amot);
  const meta = [gates ? `${gates} gates` : null, length, modes].filter(Boolean).join(' · ');

  useEffect(() => {
    const tick = () => setOpens(formatOpensIn(race.start_window));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [race.start_window]);

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{race.name}</Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      {opens ? <Text style={styles.opens}>{opens}</Text> : null}
      <CourseTicks total={gates} completedCount={0} currentTargetIndex={0} />
      <Button label="Start race" kind="ember" onPress={startRace} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
  },
  title: {
    ...type.title,
    color: color.ink,
  },
  meta: {
    ...type.caption,
    color: color.stone,
  },
  opens: {
    ...type.action,
    color: color.ink,
  },
});
