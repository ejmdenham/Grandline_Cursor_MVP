/**
 * Precise-instrument copy helpers for player chrome.
 * Keep race voice short and present tense (Grandline_Design.md).
 */

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDistanceKm(meters: number): string {
  if (!Number.isFinite(meters) || meters <= 0) return '0 km';
  if (meters < 100) return `${Math.round(meters)} m`;
  const km = meters / 1000;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function formatOpensIn(startWindow: string, now = Date.now()): string | null {
  const start = Date.parse(startWindow);
  if (Number.isNaN(start)) return null;
  const diff = start - now;
  if (diff <= 0) return null;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `Opens in ${days}d ${hours % 24}h`;
  if (hours > 0) return `Opens in ${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `Opens in ${minutes}m`;
  return 'Opens in <1m';
}

export function formatOrdinal(n: number): string {
  const v = Math.abs(n) % 100;
  const remainder = v % 10;
  if (v > 10 && v < 14) return `${n}th`;
  if (remainder === 1) return `${n}st`;
  if (remainder === 2) return `${n}nd`;
  if (remainder === 3) return `${n}rd`;
  return `${n}th`;
}

export function gateLabel(order: number, isLast: boolean): string {
  return isLast ? 'Finish' : `Gate ${order}`;
}

export function modeMeta(amot: string[] | undefined): string {
  if (!amot?.length) return '';
  return amot.map((mode) => mode.toLowerCase()).join(' · ');
}

export type TickState = 'done' | 'now' | 'open';

export function tickStates(
  total: number,
  completedCount: number,
  currentTargetIndex: number
): TickState[] {
  return Array.from({ length: total }, (_, index) => {
    if (index < completedCount) return 'done';
    if (index === currentTargetIndex) return 'now';
    return 'open';
  });
}
