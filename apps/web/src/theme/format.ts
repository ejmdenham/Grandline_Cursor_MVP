/**
 * Dense admin table copy. Status is derived from start_window until
 * results persist; CRUD payloads are unchanged.
 */

export type AdminRaceStatus = 'waiting' | 'live';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function formatWindow(startWindow: string): string {
  if (!startWindow?.trim()) return '—';
  const ms = Date.parse(startWindow);
  if (Number.isNaN(ms)) return startWindow;
  const d = new Date(ms);
  const day = d.getUTCDate();
  const month = MONTHS[d.getUTCMonth()];
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${hh}:${mm}`;
}

export function formatCourse(checkpointCount: number): string {
  const n = Number.isFinite(checkpointCount) ? Math.max(0, checkpointCount) : 0;
  return `${n} cp`;
}

export function raceStatus(startWindow: string, now = Date.now()): AdminRaceStatus {
  const start = Date.parse(startWindow);
  if (Number.isNaN(start) || now < start) return 'waiting';
  return 'live';
}

export const statusLabel: Record<AdminRaceStatus, string> = {
  waiting: 'WAITING',
  live: 'LIVE',
};
