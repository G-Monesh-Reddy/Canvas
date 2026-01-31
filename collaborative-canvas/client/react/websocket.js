import { drawSegment } from "./canvas";

export function setupSocket(socket, ctx) {
    socket.on("drawing_step", (data) => drawSegment(ctx, data));

    socket.on("state_sync", (strokes) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        strokes.forEach((stroke) =>
            stroke.segments.forEach((s) => drawSegment(ctx, s)),
        );
    });
}
