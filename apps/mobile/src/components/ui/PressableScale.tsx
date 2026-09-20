import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { motion, opacity } from '../../theme/tokens';

const easing = Easing.bezier(
  motion.easeBezier[0],
  motion.easeBezier[1],
  motion.easeBezier[2],
  motion.easeBezier[3]
);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function PressableScale({ style, children, disabled, ...rest }: Props) {
  const scale = useSharedValue(1);
  const fade = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: fade.value,
  }));

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => {
        if (disabled) return;
        scale.value = withTiming(0.97, { duration: motion.pressIn, easing });
        fade.value = withTiming(opacity.press, { duration: motion.pressIn, easing });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: motion.pressOut, easing });
        fade.value = withTiming(1, { duration: motion.pressOut, easing });
      }}
      {...rest}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
