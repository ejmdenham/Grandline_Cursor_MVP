import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { color, motion, radius, type, withAlpha } from '../../theme/tokens';
import { CourseTicks } from '../ui/CourseTicks';
import { formatDistanceKm, formatElapsed } from '../../theme/format';

export interface InRaceContentProps {
  distanceToNextMeters: number | null;
  splitMs: number;
  gateName: string;
  lastCompletedMessage: string | null;
  completedCount: number;
  currentTargetIndex: number;
  totalCheckpoints: number;
}

export function InRaceContent({
  distanceToNextMeters,
  splitMs,
  gateName,
  lastCompletedMessage,
  completedCount,
  currentTargetIndex,
  totalCheckpoints,
}: InRaceContentProps) {
  const flash = useSharedValue(0);
  const flashFill = withAlpha(color.mark, 0.16);

  useEffect(() => {
    if (!lastCompletedMessage) return;
    flash.value = 1;
    flash.value = withTiming(0, { duration: motion.success });
  }, [lastCompletedMessage, flash]);

  const wellStyle = useAnimatedStyle(() => ({
    backgroundColor: flash.value > 0.5 ? flashFill : color.sand,
  }));

  const distanceText =
    distanceToNextMeters == null
      ? '—'
      : distanceToNextMeters === 0
        ? 'Finish'
        : formatDistanceKm(distanceToNextMeters);

  return (
    <View style={styles.container}>
      <View style={styles.triad}>
        <View style={styles.cell}>
          <Text style={styles.time}>{distanceText}</Text>
          <Text style={styles.caption}>Distance</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.time}>{formatElapsed(splitMs)}</Text>
          <Text style={styles.caption}>Split</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.gate} numberOfLines={1}>
            {gateName}
          </Text>
          <Text style={styles.caption}>Next</Text>
        </View>
      </View>
      <CourseTicks
        total={totalCheckpoints}
        completedCount={completedCount}
        currentTargetIndex={currentTargetIndex}
      />
      {lastCompletedMessage ? (
        <Animated.View style={[styles.well, wellStyle]}>
          <Text style={styles.wellText}>{lastCompletedMessage}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  triad: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  time: {
    ...type.time,
    fontSize: 28,
    lineHeight: 32,
    color: color.ink,
  },
  gate: {
    ...type.action,
    color: color.ink,
    marginTop: 6,
  },
  caption: {
    ...type.caption,
    color: color.stone,
    marginTop: 2,
  },
  well: {
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: color.mark,
  },
  wellText: {
    ...type.caption,
    color: color.mark,
    textAlign: 'center',
  },
});
