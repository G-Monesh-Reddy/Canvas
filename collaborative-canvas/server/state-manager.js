export function createRoom() {
    return { strokes: [] };
}

export function addSegment(room, segment, userId) {
    let stroke = room.strokes.find((s) => s.strokeId === segment.strokeId);
    if (!stroke) {
        stroke = { strokeId: segment.strokeId, userId, segments: [] };
        room.strokes.push(stroke);
    }
    stroke.segments.push(segment);
}

export function undo(room, userId) {
    for (let i = room.strokes.length - 1; i >= 0; i--) {
        if (room.strokes[i].userId === userId) {
            room.strokes.splice(i, 1);
            break;
        }
    }
}
