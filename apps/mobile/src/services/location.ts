/**
 * Location service — GPS polling via expo-location.
 * Request permissions, subscribe to position updates, return cleanup.
 */

import * as Location from 'expo-location';

export interface Coords {
  lat: number;
  lng: number;
}

/**
 * Request foreground location permission. Returns true if granted.
 */
export async function requestPermissions(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/**
 * Get current position once. Requests permission first. Returns coords or null if denied or error.
 */
export async function getCurrentPositionOnce(): Promise<Coords | null> {
  const granted = await requestPermissions();
  if (!granted) return null;
  try {
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      maxAge: 60000,
    });
    if (loc?.coords) {
      return {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('[location] getCurrentPositionOnce error', err);
    }
  }
  return null;
}

/**
 * Subscribe to location updates. Requests permission then starts watching.
 * Returns a cleanup function to stop watching. Callback receives { lat, lng }.
 * If permission was not granted, callback is never called and cleanup is a no-op.
 */
export function subscribeToLocation(
  callback: (coords: Coords) => void
): () => void {
  let subscription: Location.LocationSubscription | null = null;
  let cancelled = false;

  (async () => {
    const granted = await requestPermissions();
    if (!granted || cancelled) {
      if (__DEV__ && !cancelled) {
        console.warn('[location] Permission not granted');
      }
      return;
    }
    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          if (loc?.coords) {
            callback({
              lat: loc.coords.latitude,
              lng: loc.coords.longitude,
            });
          }
        }
      );
      if (cancelled && sub?.remove) {
        sub.remove();
      } else {
        subscription = sub;
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('[location] watchPositionAsync error', err);
      }
    }
  })();

  return () => {
    cancelled = true;
    if (subscription?.remove) {
      subscription.remove();
      subscription = null;
    }
  };
}
