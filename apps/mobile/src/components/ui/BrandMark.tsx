import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, type } from '../../theme/tokens';

export function BrandMark() {
  return (
    <View>
      <View style={styles.ruleTrack}>
        <View style={styles.duskRule} />
        <View style={styles.tick} />
      </View>
      <Text style={styles.overline}>GRANDLINE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ruleTrack: {
    height: 4,
    justifyContent: 'center',
  },
  duskRule: {
    height: 1.5,
    backgroundColor: color.dusk,
    width: '100%',
  },
  tick: {
    width: 28,
    height: 4,
    backgroundColor: color.ember,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  overline: {
    ...type.overline,
    color: color.stone,
    marginTop: 8,
  },
});
