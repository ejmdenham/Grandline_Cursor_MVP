import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { MainDrawerParamList } from '../navigation/types';
import { color, type } from '../theme/tokens';

type PlaceholderRouteName = 'Profile' | 'ActiveRace' | 'Leaderboard' | 'JoinRace' | 'RulesSafety' | 'Placeholder';
type Props = DrawerScreenProps<MainDrawerParamList, PlaceholderRouteName>;

export function PlaceholderScreen({ route }: Props) {
  const params = route.params as { title?: string } | undefined;
  const title = params?.title ?? 'Coming soon';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.subtext}>Not in this phase.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: color.sand,
  },
  text: {
    ...type.title,
    color: color.ink,
    marginBottom: 8,
  },
  subtext: {
    ...type.caption,
    color: color.stone,
  },
});
