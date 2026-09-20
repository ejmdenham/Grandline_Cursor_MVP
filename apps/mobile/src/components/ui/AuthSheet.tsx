import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, inset, radius, surface, type } from '../../theme/tokens';
import { BrandMark } from './BrandMark';
import { TerrainBackdrop } from './TerrainBackdrop';

export function AuthSheet({
  eyebrow = 'The map is waiting.',
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TerrainBackdrop />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <BrandMark />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <View style={styles.body}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.mapLand,
  },
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: surface.sheet,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1.5,
    borderColor: color.dusk,
    paddingHorizontal: inset.sheet,
    paddingTop: 20,
    shadowColor: color.ink,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  eyebrow: {
    ...type.title,
    color: color.ink,
    marginTop: 16,
    marginBottom: 20,
  },
  body: {
    gap: 12,
  },
});
