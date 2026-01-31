import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getRoom } from "./rooms.js";
import { addSegment, undo } from "./state-manager.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    const roomId = "global";
    const room = getRoom(roomId);

    // ✅ Send full authoritative state on join
    socket.emit("state_sync", room.strokes);

    socket.on("drawing_step", (seg) => {
        addSegment(room, seg, socket.id);

        // 🔹 Optimistic realtime hint
        io.emit("drawing_step", seg);

        // 🔥 AUTHORITATIVE STATE SYNC (key fix)
        io.emit("state_sync", room.strokes);
    });

    socket.on("undo", () => {
        undo(room, socket.id);
        io.emit("state_sync", room.strokes);
    });

    socket.on("clear", () => {
        room.strokes = [];
        io.emit("state_sync", room.strokes);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
