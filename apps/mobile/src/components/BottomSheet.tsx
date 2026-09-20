import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { color, inset, motion, radius, surface, type } from '../theme/tokens';

const PEEK_HEIGHT = 48;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_EXPANDED = Math.min(SCREEN_HEIGHT * 0.38, 300);

interface BottomSheetProps {
  children: React.ReactNode;
  peekLabel?: string;
  expandedHeight?: number;
}

export function BottomSheet({
  children,
  peekLabel,
  expandedHeight = DEFAULT_EXPANDED,
}: BottomSheetProps) {
  const [expanded, setExpanded] = React.useState(true);
  const height = useSharedValue(expandedHeight);
  const contentFade = useSharedValue(1);

  useEffect(() => {
    height.value = withSpring(expanded ? expandedHeight : PEEK_HEIGHT, {
      stiffness: 380,
      damping: 32,
    });
    contentFade.value = expanded
      ? withDelay(
          motion.contentDelay,
          withTiming(1, {
            duration: motion.contentFade,
            easing: Easing.bezier(
              motion.easeBezier[0],
              motion.easeBezier[1],
              motion.easeBezier[2],
              motion.easeBezier[3]
            ),
          })
        )
      : withTiming(0, { duration: 80 });
  }, [expanded, expandedHeight, contentFade, height]);

  const sheetStyle = useAnimatedStyle(() => ({ height: height.value }));
  const fadeStyle = useAnimatedStyle(() => ({ opacity: contentFade.value }));

  return (
    <Animated.View style={[styles.container, sheetStyle]}>
      <Pressable style={styles.handle} onPress={() => setExpanded((value) => !value)}>
        <Animated.View style={styles.handleBar} />
        {!expanded && peekLabel ? (
          <Text style={styles.peekLabel} numberOfLines={1}>
            {peekLabel}
          </Text>
        ) : null}
      </Pressable>
      <Animated.View style={[styles.content, fadeStyle]} pointerEvents={expanded ? 'auto' : 'none'}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: surface.sheet,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1.5,
    borderColor: color.dusk,
    shadowColor: color.ink,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  handle: {
    height: PEEK_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.dusk,
  },
  peekLabel: {
    position: 'absolute',
    left: 56,
    right: 16,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    ...type.action,
    color: color.ink,
    lineHeight: PEEK_HEIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: inset.sheet,
    paddingBottom: 24,
  },
});
