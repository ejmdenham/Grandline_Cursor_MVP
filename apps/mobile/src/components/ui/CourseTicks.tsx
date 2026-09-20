import React from 'react';
import { StyleSheet, View } from 'react-native';
import { color } from '../../theme/tokens';
import { tickStates } from '../../theme/format';

export function CourseTicks({
  total,
  completedCount,
  currentTargetIndex,
}: {
  total: number;
  completedCount: number;
  currentTargetIndex: number;
}) {
  if (total <= 0) return null;
  const states = tickStates(total, completedCount, currentTargetIndex);
  return (
    <View style={styles.row}>
      {states.map((state, index) => (
        <View
          key={index}
          style={[
            styles.tick,
            state === 'done' && styles.done,
            state === 'now' && styles.now,
            state === 'open' && styles.open,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  done: {
    backgroundColor: color.mark,
  },
  now: {
    backgroundColor: color.ember,
  },
  open: {
    backgroundColor: color.dusk,
  },
});
