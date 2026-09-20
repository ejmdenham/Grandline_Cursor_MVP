import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatCourse, formatWindow, raceStatus } from './format.ts';

describe('formatWindow', () => {
  it('renders UTC day month time', () => {
    assert.equal(formatWindow('2026-09-19T09:00:00Z'), '19 Sep 09:00');
    assert.equal(formatWindow('2026-09-20T07:30:00.000Z'), '20 Sep 07:30');
  });

  it('keeps unparsed values and blanks as em dash', () => {
    assert.equal(formatWindow(''), '—');
    assert.equal(formatWindow('   '), '—');
    assert.equal(formatWindow('open window'), 'open window');
  });
});

describe('formatCourse', () => {
  it('counts checkpoints as cp', () => {
    assert.equal(formatCourse(0), '0 cp');
    assert.equal(formatCourse(5), '5 cp');
  });
});

describe('raceStatus', () => {
  const now = Date.parse('2026-09-20T13:00:00Z');

  it('is waiting before the window and live after', () => {
    assert.equal(raceStatus('2026-09-20T15:00:00Z', now), 'waiting');
    assert.equal(raceStatus('2026-09-20T12:00:00Z', now), 'live');
  });

  it('treats missing windows as waiting', () => {
    assert.equal(raceStatus('', now), 'waiting');
  });
});
