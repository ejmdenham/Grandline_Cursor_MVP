import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PEEK_HEIGHT = 48;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const EXPANDED_HEIGHT = Math.min(SCREEN_HEIGHT * 0.45, 360);

interface BottomSheetProps {
  children: React.ReactNode;
  /** Optional label shown in peek state (e.g. race name). */
  peekLabel?: string;
}

export function BottomSheet({ children, peekLabel }: BottomSheetProps) {
  const [expanded, setExpanded] = useState(true);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  return (
    <View style={[styles.container, { height: expanded ? EXPANDED_HEIGHT : PEEK_HEIGHT }]}>
      <TouchableOpacity style={styles.handle} onPress={toggle} activeOpacity={1}>
        <View style={styles.handleBar} />
        {!expanded && peekLabel ? (
          <Text style={styles.peekLabel} numberOfLines={1}>
            {peekLabel}
          </Text>
        ) : null}
      </TouchableOpacity>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    height: PEEK_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  peekLabel: {
    position: 'absolute',
    left: 56,
    right: 16,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: PEEK_HEIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
