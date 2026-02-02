import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRace } from '../contexts/RaceContext';
import { BottomSheet } from '../components/BottomSheet';
import { PreRaceContent } from '../components/bottom-sheet/PreRaceContent';

const DEFAULT_REGION = {
  latitude: 59.3293,
  longitude: 18.0686,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

/** Compute initial region to include all checkpoints with padding, or default. */
function regionForCheckpoints(
  checkpoints: { lat: number; lng: number }[]
): { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } {
  if (!checkpoints?.length) return DEFAULT_REGION;
  const lats = checkpoints.map((c) => c.lat);
  const lngs = checkpoints.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latDelta = Math.max((maxLat - minLat) * 1.4, 0.02);
  const lngDelta = Math.max((maxLng - minLng) * 1.4, 0.02);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const { currentRace, raceState } = useRace();
  const hasRace = !!currentRace;
  const checkpoints = currentRace?.checkpoints ?? [];
  const initialRegion = useMemo(
    () => regionForCheckpoints(checkpoints),
    [checkpoints.length]
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        mapType="standard"
        rotateEnabled={false}
      >
        {checkpoints.map((cp, index) => {
          const isLast = index === checkpoints.length - 1;
          return (
            <Marker
              key={`${cp.lat}-${cp.lng}-${cp.order}`}
              coordinate={{ latitude: cp.lat, longitude: cp.lng }}
              title={isLast ? 'Finish' : `Checkpoint ${cp.order}`}
            />
          );
        })}
      </MapView>

      {hasRace ? (
        <View style={[styles.overlay, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
          <View style={styles.overlayContent}>
            <Text style={styles.raceName} numberOfLines={1}>
              {currentRace.name}
            </Text>
            <Text style={styles.elapsed}>0:00</Text>
            <Text style={styles.progress}>
              Checkpoint 0 / {checkpoints.length}
            </Text>
          </View>
        </View>
      ) : null}

      {hasRace && raceState === 'pre-race' ? (
        <BottomSheet peekLabel={currentRace.name}>
          <PreRaceContent race={currentRace} />
        </BottomSheet>
      ) : null}
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  overlayContent: {
    gap: 4,
  },
  raceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  elapsed: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
});
