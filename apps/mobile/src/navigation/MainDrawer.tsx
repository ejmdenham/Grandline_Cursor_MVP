import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MapScreen } from '../screens/MapScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { DrawerContent } from '../components/DrawerContent';
import type { MainDrawerParamList } from './types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Map"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: true, title: 'Grandline' }}
    >
      <Drawer.Screen name="Map" component={MapScreen} options={{ title: 'Map', drawerLabel: 'Map' }} />
      <Drawer.Screen
        name="Profile"
        component={PlaceholderScreen}
        initialParams={{ title: 'Profile' }}
        options={{ drawerLabel: 'Profile' }}
      />
      <Drawer.Screen
        name="ActiveRace"
        component={PlaceholderScreen}
        initialParams={{ title: 'Active race' }}
        options={{ drawerLabel: 'Active race' }}
      />
      <Drawer.Screen
        name="Leaderboard"
        component={PlaceholderScreen}
        initialParams={{ title: 'Leaderboard' }}
        options={{ drawerLabel: 'Leaderboard' }}
      />
      <Drawer.Screen
        name="JoinRace"
        component={PlaceholderScreen}
        initialParams={{ title: 'Join race' }}
        options={{ drawerLabel: 'Join race' }}
      />
      <Drawer.Screen
        name="RulesSafety"
        component={PlaceholderScreen}
        initialParams={{ title: 'Rules / Safety' }}
        options={{ drawerLabel: 'Rules / Safety' }}
      />
    </Drawer.Navigator>
  );
}
