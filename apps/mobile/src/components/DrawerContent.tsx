import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export function DrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 32 }]}
    >
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logout} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logout: {
    padding: 16,
    marginHorizontal: 12,
    marginTop: 'auto',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: '#c00',
    fontWeight: '600',
  },
});
