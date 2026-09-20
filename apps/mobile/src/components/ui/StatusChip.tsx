import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { color, motion, opacity, radius, type } from '../../theme/tokens';

export type InstrumentStatus = 'waiting' | 'live' | 'done';

const copy: Record<InstrumentStatus, { label: string; tint: string }> = {
  waiting: { label: 'WAITING', tint: color.stone },
  live: { label: 'LIVE', tint: color.ember },
  done: { label: 'DONE', tint: color.mark },
};

export function StatusChip({
  status,
  pulse = false,
}: {
  status: InstrumentStatus;
  pulse?: boolean;
}) {
  const spec = copy[status];
  const dim = useSharedValue(1);

  useEffect(() => {
    if (status === 'live' && pulse) {
      dim.value = withRepeat(
        withSequence(
          withTiming(opacity.livePulseDim, {
            duration: motion.livePulse / 2,
            easing: Easing.linear,
          }),
          withTiming(1, { duration: motion.livePulse / 2, easing: Easing.linear })
        ),
        -1,
        false
      );
    } else {
      dim.value = 1;
    }
  }, [status, pulse, dim]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: dim.value }));

  return (
    <View style={styles.chip}>
      <Animated.View style={[styles.dot, { backgroundColor: spec.tint }, dotStyle]} />
      <Text style={[styles.label, { color: spec.tint }]}>{spec.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: color.sand,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...type.overline,
  },
});
