import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapLeaderboardResponse, mapParticipationResponse } from './resultMap.ts';

describe('mapLeaderboardResponse', () => {
  it('maps snake_case API payloads to camelCase entries', () => {
    const result = mapLeaderboardResponse(
      {
        race_id: 'race-1',
        race_name: 'Spring 5K',
        entries: [
          {
            user_id: 'user-a',
            name: 'Alex',
            status: 'finished',
            finish_time_ms: 324000,
            placement: 1,
          },
          { user_id: 'user-b', name: 'Bea', status: 'in_progress' },
        ],
      },
      'fallback'
    );
    assert.deepEqual(result, {
      raceId: 'race-1',
      raceName: 'Spring 5K',
      entries: [
        {
          name: 'Alex',
          status: 'finished',
          finishTimeMs: 324000,
          placement: 1,
          userId: 'user-a',
        },
        {
          name: 'Bea',
          status: 'in_progress',
          finishTimeMs: undefined,
          placement: undefined,
          userId: 'user-b',
        },
      ],
    });
  });

  it('keeps camelCase payloads valid', () => {
    const result = mapLeaderboardResponse(
      {
        raceId: 'race-2',
        raceName: 'Dawn Ride',
        entries: [
          {
            userId: 'user-c',
            name: 'Cam',
            status: 'finished',
            finishTimeMs: 1000,
            placement: 3,
          },
        ],
      },
      'fallback'
    );
    assert.equal(result.raceId, 'race-2');
    assert.equal(result.entries[0].userId, 'user-c');
    assert.equal(result.entries[0].finishTimeMs, 1000);
  });

  it('falls back when the body is empty', () => {
    const result = mapLeaderboardResponse({}, 'race-empty');
    assert.deepEqual(result, { raceId: 'race-empty', raceName: 'Race', entries: [] });
  });
});

describe('mapParticipationResponse', () => {
  it('maps finish placement from snake_case', () => {
    const result = mapParticipationResponse(
      {
        race_id: 'race-1',
        user_id: 'user-a',
        status: 'finished',
        finish_time_ms: 324000,
        placement: 2,
      },
      'fallback'
    );
    assert.deepEqual(result, {
      raceId: 'race-1',
      userId: 'user-a',
      status: 'finished',
      finishTimeMs: 324000,
      placement: 2,
    });
  });
});
