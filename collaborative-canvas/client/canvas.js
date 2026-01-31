export function drawSegment(ctx, segment) {
    ctx.strokeStyle = segment.style.color;
    ctx.lineWidth = segment.style.width;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(segment.start.x, segment.start.y);
    ctx.lineTo(segment.end.x, segment.end.y);
    ctx.stroke();
}
