import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MapScreen } from '../screens/MapScreen';
import { JoinRaceScreen } from '../screens/JoinRaceScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { DrawerContent } from '../components/DrawerContent';
import type { MainDrawerParamList } from './types';
import { color, type, withAlpha } from '../theme/tokens';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const hidden = {
  drawerItemStyle: { display: 'none' as const, height: 0 },
  headerShown: false,
};

export function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Map"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: color.sand,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerShadowVisible: false,
        headerTintColor: color.ink,
        headerTitleStyle: {
          ...type.title,
          color: color.ink,
        },
        sceneStyle: { backgroundColor: color.sand },
        drawerStyle: { backgroundColor: color.paper, width: 300 },
        overlayColor: withAlpha(color.ink, 0.32),
        drawerActiveTintColor: color.ember,
        drawerInactiveTintColor: color.ink,
      }}
    >
      <Drawer.Screen name="Map" component={MapScreen} options={{ headerShown: false, title: 'Map' }} />
      <Drawer.Screen
        name="JoinRace"
        component={JoinRaceScreen}
        options={{ headerShown: false, title: 'Join race' }}
      />
      <Drawer.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ headerShown: false, title: 'Leaderboard' }}
      />
      <Drawer.Screen name="Profile" component={PlaceholderScreen} options={hidden} />
      <Drawer.Screen name="ActiveRace" component={PlaceholderScreen} options={hidden} />
      <Drawer.Screen name="RulesSafety" component={PlaceholderScreen} options={hidden} />
    </Drawer.Navigator>
  );
}
