import { createRoom } from "./state-manager.js";

export const rooms = {};

export function getRoom(roomId) {
    if (!rooms[roomId]) rooms[roomId] = createRoom();
    return rooms[roomId];
}
