import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const DEFAULT_REGION = {
  latitude: 59.3293,
  longitude: 18.0686,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={false}
        mapType="standard"
        rotateEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
