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
import { color, motion, opacity, type } from '../../theme/tokens';

export function YouMarker({ live }: { live: boolean }) {
  const ringScale = useSharedValue(1);
  const ringFade = useSharedValue(0);

  useEffect(() => {
    if (!live) {
      ringScale.value = 1;
      ringFade.value = 0;
      return;
    }
    ringScale.value = 1;
    ringFade.value = opacity.youRing;
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: motion.livePulse, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
    ringFade.value = withRepeat(
      withSequence(
        withTiming(0, { duration: motion.livePulse, easing: Easing.out(Easing.quad) }),
        withTiming(opacity.youRing, { duration: 0 })
      ),
      -1,
      false
    );
  }, [live, ringFade, ringScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringFade.value,
  }));

  return (
    <View style={styles.youWrap} pointerEvents="none">
      {live ? <Animated.View style={[styles.youPulse, pulseStyle]} /> : null}
      <View style={styles.youRing}>
        <View style={styles.youCore} />
      </View>
    </View>
  );
}

export function GateMarker({
  kind,
  label,
}: {
  kind: 'next' | 'open' | 'done';
  label?: string;
}) {
  const size = kind === 'next' ? 32 : 28;
  const ring = kind === 'next' ? color.ember : kind === 'done' ? color.mark : color.dusk;
  return (
    <View
      style={[
        styles.gate,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ring,
        },
      ]}
    >
      {kind === 'done' ? (
        <Text style={styles.check}>✓</Text>
      ) : (
        <Text style={[styles.num, { color: kind === 'next' ? color.ink : color.stone }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

export function FinishMarker() {
  return (
    <View style={styles.finishWrap}>
      <View style={styles.pole} />
      <View style={styles.flag} />
    </View>
  );
}

const styles = StyleSheet.create({
  youWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.ember,
  },
  youRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color.ember,
  },
  gate: {
    backgroundColor: color.paper,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    ...type.caption,
    fontWeight: '600',
  },
  check: {
    ...type.caption,
    color: color.mark,
    fontWeight: '700',
  },
  finishWrap: {
    width: 28,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  pole: {
    position: 'absolute',
    left: 4,
    top: 2,
    width: 2,
    height: 28,
    backgroundColor: color.ink,
    borderRadius: 1,
  },
  flag: {
    marginLeft: 6,
    marginTop: 2,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: color.ember,
  },
});
