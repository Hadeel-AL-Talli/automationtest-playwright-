import { test, expect } from '../../fixtures/test';

test('creates a room through the API and verifies it in the admin UI', async ({ page, adminLoginPage }) => {
  // page.request shares the browser context's saved admin cookie from storageState.
  const roomName = `PW-API-UI-${Date.now()}`;
  const createResponse = await page.request.post('/api/room', {
    data: {
      roomName,
      type: 'Single',
      accessible: false,
      description: 'Created by the Playwright API/UI integration test',
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
      roomPrice: 123,
      features: [],
    },
  });

  expect(createResponse.status()).toBe(200);
  await expect(createResponse.json()).resolves.toMatchObject({ success: true });

  // The create response omits the new id; retrieve it from the observed room-list endpoint.
  const roomsResponse = await page.request.get('/api/room');
  expect(roomsResponse.status()).toBe(200);
  const roomsBody = await roomsResponse.json() as {
    rooms: Array<{ roomid: number; roomName: string }>;
  };
  const createdRoom = roomsBody.rooms.find((room) => room.roomName === roomName);
  expect(createdRoom).toBeDefined();

  try {
    await adminLoginPage.goto();
    await expect(page).toHaveURL(/\/admin\/rooms$/);
    // Room rows are non-semantic divs, so exact visible text is the clearest available locator.
    await expect(page.getByText(roomName, { exact: true })).toBeVisible();
  } finally {
    // Always remove test-created shared demo data, even if the UI assertion fails.
    if (createdRoom) {
      const deleteResponse = await page.request.delete(`/api/room/${createdRoom.roomid}`);
      expect(deleteResponse.status()).toBe(202);
    }
  }
});
