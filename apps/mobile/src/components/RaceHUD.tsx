import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { color, inset, radius, surface, type } from '../theme/tokens';
import { formatElapsed } from '../theme/format';
import { CourseTicks } from './ui/CourseTicks';
import { MenuWell } from './ui/MenuWell';
import { StatusChip, type InstrumentStatus } from './ui/StatusChip';

export interface RaceHUDProps {
  raceName?: string;
  elapsedMs: number;
  status: InstrumentStatus | null;
  completedCount: number;
  currentTargetIndex: number;
  totalCheckpoints: number;
  topInset: number;
}

export function RaceHUD({
  raceName,
  elapsedMs,
  status,
  completedCount,
  currentTargetIndex,
  totalCheckpoints,
  topInset,
}: RaceHUDProps) {
  const navigation = useNavigation();

  return (
    <View style={[styles.anchor, { top: topInset + 8 }]} pointerEvents="box-none">
      <View style={styles.hud}>
        <MenuWell onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <View style={styles.cluster}>
          <Text style={styles.race} numberOfLines={1}>
            {raceName ? raceName.toUpperCase() : 'GRANDLINE'}
          </Text>
          <Text style={styles.time}>{formatElapsed(elapsedMs)}</Text>
          <CourseTicks
            total={totalCheckpoints}
            completedCount={completedCount}
            currentTargetIndex={currentTargetIndex}
          />
        </View>
        {status ? (
          <StatusChip status={status} pulse={status === 'live'} />
        ) : (
          <View style={styles.statusSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: inset.hud,
    right: inset.hud,
  },
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surface.hud,
    borderWidth: 1.5,
    borderColor: color.dusk,
    borderRadius: radius.hud,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    shadowColor: color.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cluster: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  race: {
    ...type.overline,
    color: color.stone,
  },
  time: {
    ...type.time,
    color: color.ink,
  },
  statusSpacer: {
    width: 36,
  },
});
