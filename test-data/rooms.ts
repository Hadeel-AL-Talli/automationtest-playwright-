/** Known public room records returned by GET /api/room on the demo site. */
export const expectedPublicRooms = [
  { roomName: '101', type: 'Single', roomPrice: 100 },
  { roomName: '102', type: 'Double', roomPrice: 150 },
  { roomName: '103', type: 'Suite', roomPrice: 225 },
] as const;