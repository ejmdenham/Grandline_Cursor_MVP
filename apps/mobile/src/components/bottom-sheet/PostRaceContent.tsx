import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { MainDrawerParamList } from '../../navigation/types';
import { Button } from '../ui/Button';
import { color, type } from '../../theme/tokens';
import { formatElapsed, formatOrdinal } from '../../theme/format';

export interface PostRaceContentProps {
  finishTimeMs: number;
  placement?: number;
  raceId: string;
}

export function PostRaceContent({
  finishTimeMs,
  placement,
  raceId,
}: PostRaceContentProps) {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList, 'Leaderboard'>>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Finished</Text>
      <Text style={styles.time}>{formatElapsed(finishTimeMs)}</Text>
      {placement != null ? (
        <Text style={styles.placement}>{formatOrdinal(placement)}</Text>
      ) : null}
      <Button
        label="View leaderboard"
        kind="ember"
        onPress={() => navigation.navigate('Leaderboard', { raceId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
  },
  label: {
    ...type.overline,
    color: color.stone,
  },
  time: {
    ...type.time,
    color: color.ink,
  },
  placement: {
    ...type.placement,
    color: color.ink,
    marginBottom: 8,
  },
});
