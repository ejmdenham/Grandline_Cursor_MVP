import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, inset, type } from '../../theme/tokens';
import { MenuWell } from './MenuWell';

export function InstrumentPage({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.page, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.top}>
        <MenuWell onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <View style={styles.titles}>
          <View style={styles.ruleTrack}>
            <View style={styles.duskRule} />
            <View style={styles.tick} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: color.sand,
    paddingHorizontal: inset.sheet,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 16,
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  ruleTrack: {
    height: 4,
    justifyContent: 'center',
    marginBottom: 8,
  },
  duskRule: {
    height: 1.5,
    backgroundColor: color.dusk,
  },
  tick: {
    position: 'absolute',
    left: 0,
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.ember,
  },
  title: {
    ...type.title,
    color: color.ink,
  },
  meta: {
    ...type.caption,
    color: color.stone,
    marginTop: 4,
  },
  body: {
    flex: 1,
  },
});
