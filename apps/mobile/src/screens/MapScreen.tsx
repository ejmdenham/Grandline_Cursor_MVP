import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRace } from '../contexts/RaceContext';
import { BottomSheet } from '../components/BottomSheet';
import { PreRaceContent } from '../components/bottom-sheet/PreRaceContent';
import { RaceHUD } from '../components/RaceHUD';
import { InRaceContent } from '../components/bottom-sheet/InRaceContent';
import { PostRaceContent } from '../components/bottom-sheet/PostRaceContent';
import { RecenterFab } from '../components/map/RecenterFab';
import { CheckpointToast } from '../components/map/CheckpointToast';
import { FinishMarker, GateMarker, YouMarker } from '../components/map/RaceMarkers';
import { subscribeToLocation, getCurrentPositionOnce } from '../services/location';
import { getCheckpointStatus } from '../services/checkpointDetection';
import { putParticipation } from '../services/participation';
import { markers } from '../config/assets';
import { color, motion } from '../theme/tokens';
import { gateLabel } from '../theme/format';
import type { InstrumentStatus } from '../components/ui/StatusChip';

const DEFAULT_REGION: Region = {
  latitude: 59.3293,
  longitude: 18.0686,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function regionForCheckpoints(checkpoints: { lat: number; lng: number }[]): Region {
  if (!checkpoints?.length) return DEFAULT_REGION;
  const lats = checkpoints.map((c) => c.lat);
  const lngs = checkpoints.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * 1.4, 0.02),
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

function toCoords(points: { lat: number; lng: number }[]) {
  return points.map((point) => ({ latitude: point.lat, longitude: point.lng }));
}

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const {
    currentRace,
    raceState,
    raceStartTime,
    raceFinishTimeMs,
    racePlacement,
    completedCheckpointCount,
    setCompletedCheckpointCount,
    setRaceState,
    setRaceFinishTimeMs,
    setRacePlacement,
  } = useRace();

  const hasRace = !!currentRace;
  const checkpoints = currentRace?.checkpoints ?? [];
  const initialRegion = useMemo(
    () => regionForCheckpoints(checkpoints),
    [checkpoints.length]
  );

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [checkpointStatus, setCheckpointStatus] = useState({
    currentTargetIndex: 0,
    distanceToNextMeters: 0,
    lastCompletedMessage: null as string | null,
  });
  const [elapsedMs, setElapsedMs] = useState(0);
  const [splitMs, setSplitMs] = useState(0);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const hasCenteredOnUser = useRef(false);
  const completedCountRef = useRef(completedCheckpointCount);
  const lastGateAtRef = useRef<number | null>(null);
  const lastMessageRef = useRef<string | null>(null);
  const finishReportedRef = useRef(false);
  completedCountRef.current = completedCheckpointCount;

  const isInRace = raceState === 'in-race';
  const currentTargetIndex = isInRace ? checkpointStatus.currentTargetIndex : 0;

  useFocusEffect(
    useCallback(() => {
      if (isInRace) return;
      getCurrentPositionOnce().then((coords) => {
        if (coords) {
          setUserLocation({ lat: coords.lat, lng: coords.lng });
          mapRef.current?.animateToRegion(regionAroundUser(coords.lat, coords.lng), 500);
        }
      });
    }, [isInRace])
  );

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
        const justHit = checkpoints[currentCompleted];
        setCompletedCheckpointCount(status.completedCount);
        lastGateAtRef.current = Date.now();
        if (justHit) {
          setToast({
            title: `Checkpoint ${justHit.order}`,
            body: 'Marked. Keep moving.',
          });
        }
        if (
          status.completedCount >= checkpoints.length &&
          raceStartTime != null &&
          !finishReportedRef.current
        ) {
          finishReportedRef.current = true;
          const finishTimeMs = Date.now() - raceStartTime;
          setRaceFinishTimeMs(finishTimeMs);
          setRaceState('post-race');
          void putParticipation(currentRace.id, {
            status: 'finished',
            finish_time_ms: finishTimeMs,
          })
            .then((result) => {
              if (result.placement != null) setRacePlacement(result.placement);
            })
            .catch((err) => {
              console.warn('[Race] persist finish failed', err);
            });
        }
      }
      if (status.completedCount > currentCompleted) {
        lastMessageRef.current = `Checkpoint ${checkpoints[currentCompleted]?.order} marked`;
      }
      setCheckpointStatus({
        currentTargetIndex: status.currentTargetIndex,
        distanceToNextMeters: status.distanceToNextMeters,
        lastCompletedMessage: lastMessageRef.current,
      });
    });
    return cleanup;
  }, [
    isInRace,
    currentRace?.id,
    checkpoints,
    raceStartTime,
    setCompletedCheckpointCount,
    setRaceState,
    setRaceFinishTimeMs,
    setRacePlacement,
  ]);

  useEffect(() => {
    if (!toast) return;
    const hold = motion.toastIn + motion.toastHold + motion.toastOut;
    const id = setTimeout(() => setToast(null), hold);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!isInRace) {
      lastMessageRef.current = null;
      hasCenteredOnUser.current = false;
      return;
    }
    lastMessageRef.current = null;
    lastGateAtRef.current = Date.now();
    finishReportedRef.current = false;
  }, [isInRace]);

  useEffect(() => {
    if (!isInRace || !userLocation || hasCenteredOnUser.current) return;
    hasCenteredOnUser.current = true;
    lastGateAtRef.current = Date.now();
    mapRef.current?.animateToRegion(regionAroundUser(userLocation.lat, userLocation.lng), 500);
  }, [isInRace, userLocation]);

  useEffect(() => {
    if (!isInRace || raceStartTime == null) return;
    const tick = () => {
      const now = Date.now();
      setElapsedMs(now - raceStartTime);
      setSplitMs(now - (lastGateAtRef.current ?? raceStartTime));
    };
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

  const hudStatus: InstrumentStatus | null = !hasRace
    ? null
    : raceState === 'pre-race'
      ? 'waiting'
      : raceState === 'in-race'
        ? 'live'
        : raceState === 'post-race'
          ? 'done'
          : null;

  const hudElapsed =
    raceState === 'post-race' && raceFinishTimeMs != null ? raceFinishTimeMs : elapsedMs;

  const completedPath = toCoords(checkpoints.slice(0, Math.max(completedCheckpointCount, 0)));
  const remainingStart = Math.max(completedCheckpointCount - 1, 0);
  const remainingPath = toCoords(checkpoints.slice(remainingStart));

  const target = checkpoints[currentTargetIndex];
  const currentGateName = target
    ? gateLabel(target.order, currentTargetIndex === checkpoints.length - 1)
    : '—';

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
        {completedPath.length >= 2 ? (
          <Polyline coordinates={completedPath} strokeColor={color.mark} strokeWidth={4} />
        ) : null}
        {remainingPath.length >= 2 ? (
          <Polyline
            coordinates={remainingPath}
            strokeColor={color.ember}
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
        ) : null}
        {checkpoints.map((cp, index) => {
          const isLast = index === checkpoints.length - 1;
          const isCompleted = (isInRace || raceState === 'post-race') && index < completedCheckpointCount;
          const isCurrentTarget = index === currentTargetIndex && raceState !== 'post-race';
          const image = isLast ? markers.finish : markers.checkpoint;
          return (
            <Marker
              key={`${cp.lat}-${cp.lng}-${cp.order}`}
              coordinate={{ latitude: cp.lat, longitude: cp.lng }}
              title={isLast ? 'Finish' : `Checkpoint ${cp.order}`}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              {...(image != null ? { image } : {})}
            >
              {image == null ? (
                isCompleted ? (
                  <GateMarker kind="done" />
                ) : isLast ? (
                  <FinishMarker />
                ) : (
                  <GateMarker
                    kind={isCurrentTarget ? 'next' : 'open'}
                    label={String(cp.order)}
                  />
                )
              ) : null}
            </Marker>
          );
        })}
        {userLocation ? (
          <Marker
            coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
            title="You"
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={isInRace && markers.user == null}
            {...(markers.user != null ? { image: markers.user } : {})}
          >
            {markers.user == null ? <YouMarker live={isInRace} /> : null}
          </Marker>
        ) : null}
      </MapView>

      <RaceHUD
        raceName={currentRace?.name}
        elapsedMs={hasRace ? hudElapsed : 0}
        status={hudStatus}
        completedCount={hasRace ? completedCheckpointCount : 0}
        currentTargetIndex={hasRace ? currentTargetIndex : 0}
        totalCheckpoints={checkpoints.length}
        topInset={insets.top}
      />

      {toast ? (
        <View style={styles.toastWrap} pointerEvents="none">
          <CheckpointToast title={toast.title} body={toast.body} />
        </View>
      ) : null}

      {hasRace && isInRace ? (
        <View style={styles.fabWrap}>
          <RecenterFab onPress={handleCenterMap} />
        </View>
      ) : null}

      {hasRace && raceState === 'pre-race' ? (
        <BottomSheet peekLabel={currentRace.name} expandedHeight={260}>
          <PreRaceContent race={currentRace} />
        </BottomSheet>
      ) : null}

      {hasRace && isInRace ? (
        <BottomSheet peekLabel={currentRace.name} expandedHeight={220}>
          <InRaceContent
            distanceToNextMeters={userLocation ? checkpointStatus.distanceToNextMeters : null}
            splitMs={splitMs}
            gateName={currentGateName}
            lastCompletedMessage={checkpointStatus.lastCompletedMessage}
            completedCount={completedCheckpointCount}
            currentTargetIndex={currentTargetIndex}
            totalCheckpoints={checkpoints.length}
          />
        </BottomSheet>
      ) : null}

      {hasRace && raceState === 'post-race' && raceFinishTimeMs != null ? (
        <BottomSheet peekLabel={currentRace.name} expandedHeight={240}>
          <PostRaceContent
            finishTimeMs={raceFinishTimeMs}
            placement={racePlacement ?? undefined}
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
    backgroundColor: color.mapLand,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  toastWrap: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fabWrap: {
    position: 'absolute',
    right: 16,
    bottom: 236,
  },
});
