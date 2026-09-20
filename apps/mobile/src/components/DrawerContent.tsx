import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useRace } from '../contexts/RaceContext';
import { BrandMark } from './ui/BrandMark';
import { PressableScale } from './ui/PressableScale';
import { StatusChip, type InstrumentStatus } from './ui/StatusChip';
import { color, radius, type } from '../theme/tokens';

const NAV_ITEMS: { name: 'Map' | 'JoinRace' | 'Leaderboard'; label: string }[] = [
  { name: 'Map', label: 'Map' },
  { name: 'JoinRace', label: 'Join race' },
  { name: 'Leaderboard', label: 'Leaderboard' },
];

function raceStatus(state: string): InstrumentStatus | null {
  if (state === 'pre-race') return 'waiting';
  if (state === 'in-race') return 'live';
  if (state === 'post-race') return 'done';
  return null;
}

export function DrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const { signOut, session } = useAuth();
  const { currentRace, raceState } = useRace();
  const status = raceStatus(raceState);
  const routeName = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <BrandMark />
      <View style={styles.identity}>
        <Text style={styles.name} numberOfLines={1}>
          {session?.user?.name || session?.user?.email || 'Racer'}
        </Text>
        {session?.user?.email ? (
          <Text style={styles.email} numberOfLines={1}>
            {session.user.email}
          </Text>
        ) : null}
      </View>

      {currentRace && status ? (
        <PressableScale
          onPress={() => props.navigation.navigate('Map')}
          style={styles.raceWell}
        >
          <View style={styles.emberBar} />
          <View style={styles.raceCopy}>
            <Text style={styles.raceName} numberOfLines={1}>
              {currentRace.name}
            </Text>
            <StatusChip status={status} pulse={false} />
          </View>
        </PressableScale>
      ) : null}

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const focused = routeName === item.name;
          return (
            <PressableScale
              key={item.name}
              onPress={() => props.navigation.navigate(item.name)}
              style={[styles.navRow, focused && styles.navFocused]}
            >
              {focused ? <View style={styles.emberBar} /> : null}
              <Text style={styles.navLabel}>{item.label}</Text>
            </PressableScale>
          );
        })}
      </View>

      <PressableScale onPress={signOut} style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </PressableScale>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: color.paper,
  },
  identity: {
    marginTop: 20,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: color.dusk,
  },
  name: {
    ...type.title,
    color: color.ink,
  },
  email: {
    ...type.caption,
    color: color.stone,
    marginTop: 4,
  },
  raceWell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.sand,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.dusk,
    overflow: 'hidden',
    marginBottom: 20,
    minHeight: 56,
  },
  emberBar: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: color.ember,
  },
  raceCopy: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  raceName: {
    ...type.action,
    color: color.ink,
  },
  nav: {
    gap: 4,
  },
  navRow: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: radius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: color.dusk,
  },
  navFocused: {
    backgroundColor: color.sand,
  },
  navLabel: {
    ...type.action,
    color: color.ink,
    flex: 1,
    paddingVertical: 10,
  },
  logout: {
    marginTop: 'auto',
    paddingVertical: 16,
  },
  logoutText: {
    ...type.action,
    color: color.flare,
  },
});
