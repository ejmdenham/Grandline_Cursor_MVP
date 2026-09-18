import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRace } from '../contexts/RaceContext';
import { BottomSheet } from '../components/BottomSheet';
import { PreRaceContent } from '../components/bottom-sheet/PreRaceContent';
import { RaceHUD } from '../components/RaceHUD';
import { InRaceContent } from '../components/bottom-sheet/InRaceContent';
import { PostRaceContent } from '../components/bottom-sheet/PostRaceContent';
import { subscribeToLocation, getCurrentPositionOnce } from '../services/location';
import { getCheckpointStatus } from '../services/checkpointDetection';
import { markers } from '../config/assets';

const DEFAULT_REGION: Region = {
  latitude: 59.3293,
  longitude: 18.0686,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

/** Compute initial region to include all checkpoints with padding, or default. */
function regionForCheckpoints(
  checkpoints: { lat: number; lng: number }[]
): Region {
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

function regionAroundUser(lat: number, lng: number): Region {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
}

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const {
    currentRace,
    raceState,
    raceStartTime,
    raceFinishTimeMs,
    completedCheckpointCount,
    setCompletedCheckpointCount,
    setRaceState,
    setRaceFinishTimeMs,
  } = useRace();

  const hasRace = !!currentRace;
  const checkpoints = currentRace?.checkpoints ?? [];
  const initialRegion = useMemo(
    () => regionForCheckpoints(checkpoints),
    [checkpoints.length]
  );

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [checkpointStatus, setCheckpointStatus] = useState<{
    currentTargetIndex: number;
    distanceToNextMeters: number;
    lastCompletedMessage: string | null;
  }>({ currentTargetIndex: 0, distanceToNextMeters: 0, lastCompletedMessage: null });
  const [elapsedMs, setElapsedMs] = useState(0);
  const hasCenteredOnUser = useRef(false);
  const completedCountRef = useRef(completedCheckpointCount);
  completedCountRef.current = completedCheckpointCount;

  const isInRace = raceState === 'in-race';

  // When Map is focused and not in race: fetch location once, set marker, center map
  useFocusEffect(
    useCallback(() => {
      if (isInRace) return;
      getCurrentPositionOnce().then((coords) => {
        if (coords) {
          setUserLocation({ lat: coords.lat, lng: coords.lng });
          mapRef.current?.animateToRegion(
            regionAroundUser(coords.lat, coords.lng),
            500
          );
        }
      });
    }, [isInRace])
  );

  // Location subscription when in-race
  useEffect(() => {
    if (!isInRace || !currentRace) return;
    const cleanup = subscribeToLocation((coords) => {
      setUserLocation({ lat: coords.lat, lng: coords.lng });
      const currentCompleted = completedCountRef.current;
      const status = getCheckpointStatus(
        coords.lat,
        coords.lng,
        checkpoints,
        currentCompleted
      );
      if (status.completedCount > currentCompleted) {
        setCompletedCheckpointCount(status.completedCount);
        if (status.completedCount >= checkpoints.length && raceStartTime != null) {
          setRaceFinishTimeMs(Date.now() - raceStartTime);
          setRaceState('post-race');
        }
      }
      setCheckpointStatus({
        currentTargetIndex: status.currentTargetIndex,
        distanceToNextMeters: status.distanceToNextMeters,
        lastCompletedMessage: status.lastCompletedMessage,
      });
    });
    return cleanup;
  }, [isInRace, currentRace?.id, checkpoints, raceStartTime, setCompletedCheckpointCount, setRaceState, setRaceFinishTimeMs]);

  useEffect(() => {
    if (!isInRace) hasCenteredOnUser.current = false;
  }, [isInRace]);

  // Center map on user on first location fix when in-race
  useEffect(() => {
    if (!isInRace || !userLocation || hasCenteredOnUser.current) return;
    hasCenteredOnUser.current = true;
    mapRef.current?.animateToRegion(regionAroundUser(userLocation.lat, userLocation.lng), 500);
  }, [isInRace, userLocation]);

  // Elapsed time ticker when in-race
  useEffect(() => {
    if (!isInRace || raceStartTime == null) return;
    const tick = () => setElapsedMs(Date.now() - raceStartTime);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isInRace, raceStartTime]);

  const handleCenterMap = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        regionAroundUser(userLocation.lat, userLocation.lng),
        500
      );
    }
  }, [userLocation]);

  const totalCheckpoints = checkpoints.length;
  const currentTargetIndex = isInRace ? checkpointStatus.currentTargetIndex : 0;
  const displayProgressIndex = isInRace ? Math.min(currentTargetIndex, totalCheckpoints) : 0;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        mapType="standard"
        rotateEnabled={false}
      >
        {checkpoints.map((cp, index) => {
          const isLast = index === checkpoints.length - 1;
          const isCompleted = isInRace && index < completedCheckpointCount;
          const isCurrentTarget = isInRace && index === currentTargetIndex;
          const showAsFinish = isLast && isCurrentTarget;
          return (
            <Marker
              key={`${cp.lat}-${cp.lng}-${cp.order}`}
              coordinate={{ latitude: cp.lat, longitude: cp.lng }}
              title={showAsFinish ? 'Finish' : `Checkpoint ${cp.order}`}
              opacity={isCompleted ? 0.5 : 1}
              pinColor={isCurrentTarget ? '#0066cc' : undefined}
            />
          );
        })}
        {userLocation ? (
          <Marker
            coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
            title="You"
            {...(markers.user != null ? { image: markers.user } : {})}
          />
        ) : null}
      </MapView>

      {hasRace && raceState === 'pre-race' ? (
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

      {hasRace && isInRace ? (
        <RaceHUD
          raceName={currentRace.name}
          elapsedMs={elapsedMs}
          currentCheckpointIndex={displayProgressIndex}
          totalCheckpoints={totalCheckpoints}
          insets={insets}
        />
      ) : null}

      {hasRace && raceState === 'pre-race' ? (
        <BottomSheet peekLabel={currentRace.name}>
          <PreRaceContent race={currentRace} />
        </BottomSheet>
      ) : null}

      {hasRace && isInRace ? (
        <BottomSheet peekLabel={currentRace.name}>
          <InRaceContent
            distanceToNextMeters={userLocation ? checkpointStatus.distanceToNextMeters : null}
            lastCompletedMessage={checkpointStatus.lastCompletedMessage}
            onCenterMap={handleCenterMap}
          />
        </BottomSheet>
      ) : null}

      {hasRace && raceState === 'post-race' && raceFinishTimeMs != null ? (
        <BottomSheet peekLabel={currentRace.name}>
          <PostRaceContent
            finishTimeMs={raceFinishTimeMs}
            raceName={currentRace.name}
            raceId={currentRace.id}
          />
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
