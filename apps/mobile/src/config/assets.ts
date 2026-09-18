/**
 * Centralized asset paths for the mobile app.
 * See Grandline_Context.md — Asset References (Mobile Frontend).
 * Use these paths with require() or your image/icon component once files exist.
 * Missing files must not crash the app: check for undefined before rendering
 * or use a fallback. Asset files are added in Phase 3+; until then use a placeholder
 * or optional chaining (e.g. markers.user ?? require('./placeholder.png')).
 */

/** Relative paths from app root for map markers (PNG). */
export const markerPaths = {
  user: 'assets/markers/user_marker.png',
  checkpoint: 'assets/markers/checkpoint_marker.png',
  finish: 'assets/markers/finish_marker.png',
} as const;

/** Relative paths from app root for icons (SVG). */
export const iconPaths = {
  run: 'assets/icons/run.svg',
  bike: 'assets/icons/bike.svg',
  trophy: 'assets/icons/trophy.svg',
  invite: 'assets/icons/invite.svg',
} as const;

/**
 * Resolve a marker asset. Returns require() result or undefined if missing (safe fallback).
 * Call this at runtime; wrap usage in optional chaining so missing assets don't crash.
 * Placeholder PNGs: add checkpoint_marker.png, finish_marker.png, user_marker.png under
 * apps/mobile/assets/markers/ then uncomment the require() lines below.
 */
export const markers: Record<keyof typeof markerPaths, number | undefined> = {
  user: undefined,
  checkpoint: undefined,
  finish: undefined,
};
// When asset files exist in assets/markers/, use:
// user: require('../../assets/markers/user_marker.png'),
// checkpoint: require('../../assets/markers/checkpoint_marker.png'),
// finish: require('../../assets/markers/finish_marker.png'),

/** Icon path strings (SVG). Use with your SVG transformer or component. */
export const icons = {
  run: iconPaths.run,
  bike: iconPaths.bike,
  trophy: iconPaths.trophy,
  invite: iconPaths.invite,
} as const;
