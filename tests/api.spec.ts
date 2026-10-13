import { test, expect } from '@playwright/test';
import { expectedPublicRooms } from '../test-data/rooms';

test.describe('rooms API', () => {
  test('returns the public rooms and their key fields', async ({ request }) => {
    // Network inspection confirmed the homepage requests GET /api/room.
    const response = await request.get('/api/room');
    expect(response.status()).toBe(200);

    const body = await response.json() as {
      rooms: Array<{ roomName: string; type: string; roomPrice: number }>;
    };
    // Project to contract fields first: arrayContaining still deep-compares each object.
    const roomSummary = body.rooms.map(({ roomName, type, roomPrice }) => ({
      roomName,
      type,
      roomPrice,
    }));
    expect(roomSummary).toEqual(expect.arrayContaining([...expectedPublicRooms]));
  });
});
