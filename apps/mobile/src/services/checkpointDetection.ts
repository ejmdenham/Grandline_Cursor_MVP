/**
 * Checkpoint detection — distance-based (Haversine).
 * Consider checkpoint reached when user is within threshold (50m).
 */

import type { Checkpoint } from '../types/race';

const REACH_THRESHOLD_METERS = 50;

/**
 * Haversine distance in meters between two lat/lng points.
 */
export function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export interface CheckpointStatus {
  completedCount: number;
  currentTargetIndex: number;
  distanceToNextMeters: number;
  lastCompletedMessage: string | null;
}

/**
 * Get checkpoint status given user position and current completed count.
 * If user is within REACH_THRESHOLD_METERS of the current target, it is considered reached
 * (returned completedCount is incremented, lastCompletedMessage set).
 */
export function getCheckpointStatus(
  userLat: number,
  userLng: number,
  checkpoints: Checkpoint[],
  completedCount: number
): CheckpointStatus {
  const total = checkpoints.length;
  if (total === 0) {
    return {
      completedCount: 0,
      currentTargetIndex: 0,
      distanceToNextMeters: 0,
      lastCompletedMessage: null,
    };
  }
  if (completedCount >= total) {
    return {
      completedCount: total,
      currentTargetIndex: total,
      distanceToNextMeters: 0,
      lastCompletedMessage: null,
    };
  }

  const currentTarget = checkpoints[completedCount];
  const distanceToCurrent = haversineDistanceMeters(
    userLat,
    userLng,
    currentTarget.lat,
    currentTarget.lng
  );

  if (distanceToCurrent < REACH_THRESHOLD_METERS) {
    const newCompleted = completedCount + 1;
    const lastCompletedMessage = `Checkpoint ${currentTarget.order} complete`;
    if (newCompleted >= total) {
      return {
        completedCount: newCompleted,
        currentTargetIndex: total,
        distanceToNextMeters: 0,
        lastCompletedMessage,
      };
    }
    const nextTarget = checkpoints[newCompleted];
    const distanceToNext = haversineDistanceMeters(
      userLat,
      userLng,
      nextTarget.lat,
      nextTarget.lng
    );
    return {
      completedCount: newCompleted,
      currentTargetIndex: newCompleted,
      distanceToNextMeters: Math.round(distanceToNext),
      lastCompletedMessage,
    };
  }

  return {
    completedCount,
    currentTargetIndex: completedCount,
    distanceToNextMeters: Math.round(distanceToCurrent),
    lastCompletedMessage: null,
  };
}
