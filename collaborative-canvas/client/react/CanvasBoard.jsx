import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { drawSegment } from "../canvas.js";

const socket = io("https://canvas-1-8tgn.onrender.com");


export default function CanvasBoard() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const drawing = useRef(false);
    const prev = useRef(null);
    const strokeId = useRef(null);

    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(4);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // ✅ Deterministic canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 56;

        ctxRef.current = ctx;

        // 🔹 Realtime hint (draw ONLY remote strokes)
        socket.on("drawing_step", (seg) => {
            if (seg.strokeId !== strokeId.current) {
                drawSegment(ctx, seg);
            }
        });

        // 🔥 Authoritative redraw
        socket.on("state_sync", (strokes) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            strokes.forEach((s) =>
                s.segments.forEach((seg) => drawSegment(ctx, seg)),
            );
        });

        return () => {
            socket.off("drawing_step");
            socket.off("state_sync");
        };
    }, []);

    function getPos(e) {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    function handleDown(e) {
        drawing.current = true;
        strokeId.current = crypto.randomUUID();
        prev.current = getPos(e);
    }

    function handleMove(e) {
        if (!drawing.current) return;

        const pos = getPos(e);
        const seg = {
            strokeId: strokeId.current,
            start: prev.current,
            end: pos,
            style: { color, width: size },
        };

        // 🔹 Local optimistic draw
        drawSegment(ctxRef.current, seg);

        // 🔹 Send to server
        socket.emit("drawing_step", seg);

        prev.current = pos;
    }

    function handleUp() {
        drawing.current = false;
    }

    function clearCanvas() {
        socket.emit("clear");
    }

    return (
        <>
            <div className="toolbar">
                <h1>🎨 Collaborative Canvas</h1>

                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />

                <input
                    type="range"
                    min="1"
                    max="20"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                />

                <button onClick={() => socket.emit("undo")}>Undo</button>
                <button onClick={clearCanvas}>Clear</button>
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={handleDown}
                onMouseMove={handleMove}
                onMouseUp={handleUp}
                onMouseLeave={handleUp}
            />
        </>
    );
}
