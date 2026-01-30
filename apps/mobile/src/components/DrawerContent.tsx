import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';

export function DrawerContent(props: DrawerContentComponentProps) {
  const { signOut } = useAuth();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
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
    paddingTop: 8,
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
