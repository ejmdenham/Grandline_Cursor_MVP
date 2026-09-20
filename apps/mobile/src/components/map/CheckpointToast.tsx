import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { color, motion, radius, type } from '../../theme/tokens';

export function CheckpointToast({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const translate = useSharedValue(12);
  const fade = useSharedValue(0);

  useEffect(() => {
    translate.value = 12;
    fade.value = 0;
    translate.value = withSequence(
      withTiming(0, { duration: motion.toastIn, easing: Easing.out(Easing.quad) }),
      withDelay(
        motion.toastHold,
        withTiming(12, { duration: motion.toastOut, easing: Easing.in(Easing.quad) })
      )
    );
    fade.value = withSequence(
      withTiming(1, { duration: motion.toastIn }),
      withDelay(motion.toastHold, withTiming(0, { duration: motion.toastOut }))
    );
  }, [title, body, fade, translate]);

  const style = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: translate.value }],
  }));

  return (
    <Animated.View style={[styles.toast, style]} pointerEvents="none">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.dusk,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  title: {
    ...type.action,
    color: color.ink,
  },
  body: {
    ...type.caption,
    color: color.mark,
    marginTop: 2,
  },
});
