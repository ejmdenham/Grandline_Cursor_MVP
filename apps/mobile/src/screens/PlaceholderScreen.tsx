import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { MainDrawerParamList } from '../navigation/types';

type PlaceholderRouteName = 'Profile' | 'ActiveRace' | 'Leaderboard' | 'JoinRace' | 'RulesSafety' | 'Placeholder';
type Props = DrawerScreenProps<MainDrawerParamList, PlaceholderRouteName>;

export function PlaceholderScreen({ route }: Props) {
  const params = route.params as { title?: string } | undefined;
  const title = params?.title ?? 'Coming soon';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.subtext}>Phase 3+</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
});
