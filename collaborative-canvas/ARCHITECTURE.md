# 🧠 System Architecture – Real-Time Collaborative Drawing Canvas

This document describes the internal architecture, synchronization strategy, and key design decisions behind the real-time collaborative drawing application.

---

## 🏗️ High-Level Architecture

Browser (React + HTML5 Canvas)
│
│ WebSocket (Socket.IO)
▼
Node.js Server (Express)
│
│ In-memory Stroke History
▼
Authoritative Drawing State


---

## 🎯 Core Design Principles

### 1. Canvas is a Rendering Layer Only
- The HTML5 Canvas API is used only to render pixels.
- Canvas does not maintain any application state.
- Once something is drawn, it cannot be queried or modified individually.
- Therefore, the canvas is never treated as a source of truth.

---

### 2. Server is the Source of Truth
- The server maintains the complete drawing history.
- All clients depend on the server for the authoritative state.
- Any client can reconstruct the full canvas at any time using server data.

---

## ✍️ Drawing Data Model

Each user drawing action is represented as a **stroke**, composed of multiple path segments.

### Stroke Structure
```js
{
  strokeId: string,
  userId: string,
  segments: [
    {
      start: { x, y },
      end: { x, y },
      style: { color, width }
    }
  ]
}
strokeId uniquely identifies a drawing action.

segments store incremental path movements.

Styling information is stored per segment.

🔄 Synchronization Strategy
Optimistic Local Rendering
Users draw locally on the canvas for immediate feedback.

Drawing segments are sent to the server in real time using WebSockets.

Server-Authoritative Replay
The server stores all strokes in memory.

The server broadcasts the full drawing state (state_sync) to all clients.

Clients clear their canvas and redraw everything from server history.

This approach guarantees:

Deterministic canvas state

No desynchronization between clients

Reliable undo and clear functionality

↩️ Undo Mechanism
Undo is applied per user.

The server removes the most recent stroke created by the requesting user.

The updated stroke history is broadcast to all clients.

Clients fully redraw the canvas from the updated state.

🧹 Clear Mechanism
Clear removes all strokes from the server state.

The server broadcasts an empty state.

All clients clear their canvas and redraw nothing.

⚠️ Conflict Resolution
Multiple users can draw simultaneously.

Stroke ordering is determined by server event arrival order.

Any temporary inconsistencies are corrected through state replay.

📈 Performance Considerations
Stroke segments are transmitted instead of raw pixel data.

Local rendering avoids perceived latency.

Full canvas redraws occur only during:

Undo operations

Clear operations

New client connections

State resynchronization

🔒 Limitations
Drawing history is stored in memory only.

Server restart clears all drawings.

No authentication or user identity management.

🚀 Future Enhancements
Persistent storage using Redis or a database

Room-based collaboration using unique URLs

User names and avatars

Ghost cursors (live user presence indicators)

Mobile and touch input support
