import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatDistanceKm,
  formatElapsed,
  formatOpensIn,
  formatOrdinal,
  gateLabel,
  modeMeta,
  tickStates,
} from './format.ts';
import { color, withAlpha } from './tokens.ts';
import { courseLengthMeters } from '../services/checkpointDetection.ts';

describe('formatElapsed', () => {
  it('renders a chronograph clock', () => {
    assert.equal(formatElapsed(0), '0:00');
    assert.equal(formatElapsed(4_120), '0:04');
    assert.equal(formatElapsed(252_000), '4:12');
    assert.equal(formatElapsed(4_324_000), '1:12:04');
  });
});

describe('formatDistanceKm', () => {
  it('uses meters under 100 and km otherwise', () => {
    assert.equal(formatDistanceKm(0), '0 km');
    assert.equal(formatDistanceKm(42), '42 m');
    assert.equal(formatDistanceKm(1200), '1.2 km');
    assert.equal(formatDistanceKm(12_400), '12.4 km');
  });
});

describe('formatOpensIn', () => {
  it('uses precise instrument copy', () => {
    const now = Date.parse('2026-09-20T13:00:00Z');
    assert.equal(formatOpensIn('2026-09-20T13:14:00Z', now), 'Opens in 14m');
    assert.equal(formatOpensIn('2026-09-20T15:14:00Z', now), 'Opens in 2h 14m');
    assert.equal(formatOpensIn('2026-09-20T12:00:00Z', now), null);
  });
});

describe('formatOrdinal', () => {
  it('renders placement', () => {
    assert.equal(formatOrdinal(1), '1st');
    assert.equal(formatOrdinal(2), '2nd');
    assert.equal(formatOrdinal(3), '3rd');
    assert.equal(formatOrdinal(11), '11th');
  });
});

describe('course helpers', () => {
  it('sums checkpoint legs and labels gates', () => {
    const meters = courseLengthMeters([
      { lat: 59.3293, lng: 18.0686 },
      { lat: 59.332, lng: 18.07 },
    ]);
    assert.ok(meters > 200);
    assert.equal(gateLabel(3, false), 'Gate 3');
    assert.equal(gateLabel(5, true), 'Finish');
    assert.equal(modeMeta(['run', 'bike']), 'run · bike');
  });
});

describe('tickStates', () => {
  it('marks completed, current, and upcoming gates', () => {
    assert.deepEqual(tickStates(5, 2, 2), ['done', 'done', 'now', 'open', 'open']);
  });
});

describe('withAlpha', () => {
  it('builds HUD glass from Paper', () => {
    assert.equal(withAlpha(color.paper, 0.82), 'rgba(250, 250, 249, 0.82)');
  });
});
