import React from 'react';
import { StyleSheet, View } from 'react-native';
import { color } from '../../theme/tokens';

/** Stand-in terrain for auth sheets when the live map is behind chrome. */
export function TerrainBackdrop() {
  return (
    <View style={styles.canvas} pointerEvents="none">
      <View style={styles.sky} />
      <View style={styles.water} />
      <View style={styles.park} />
      <View style={styles.hill} />
      <View style={styles.hillTwo} />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.mapLand,
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '28%',
    backgroundColor: color.haze,
  },
  water: {
    position: 'absolute',
    left: '8%',
    right: '42%',
    top: '38%',
    height: '22%',
    backgroundColor: color.mapWater,
    borderRadius: 80,
    opacity: 0.9,
  },
  park: {
    position: 'absolute',
    right: '6%',
    top: '32%',
    width: '40%',
    height: '30%',
    backgroundColor: color.mapPark,
    borderRadius: 48,
  },
  hill: {
    position: 'absolute',
    left: '-10%',
    bottom: '18%',
    width: '70%',
    height: '28%',
    backgroundColor: color.clay,
    borderRadius: 120,
    opacity: 0.7,
  },
  hillTwo: {
    position: 'absolute',
    right: '-8%',
    bottom: '8%',
    width: '55%',
    height: '24%',
    backgroundColor: color.clay,
    borderRadius: 100,
    opacity: 0.55,
  },
});
