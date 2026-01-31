# 🎨 Real-Time Collaborative Drawing Canvas

A real-time, multi-user drawing application that allows multiple users to draw simultaneously on a shared canvas.  
Built using the **HTML5 Canvas API** for rendering and **Socket.IO** for real-time communication.

---

## 🚀 Features

- Real-time collaborative drawing
- Multiple users drawing simultaneously
- Smooth freehand drawing using Canvas API
- Color picker and brush size control
- Per-user Undo functionality
- Clear canvas (synchronized for all users)
- Server-authoritative state synchronization
- Deterministic redraw (no desynchronization between clients)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- HTML5 Canvas API
- CSS
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO
- In-memory state management

---

## 📁 Project Structure

collaborative-canvas/
├── client/
│ ├── index.html
│ ├── style.css
│ ├── canvas.js
│ ├── react/
│ │ ├── App.jsx
│ │ ├── CanvasBoard.jsx
│ │ └── main.jsx
│ └── vite.config.js
│
├── server/
│ ├── server.js
│ ├── rooms.js
│ └── state-manager.js
│
├── package.json
├── README.md
└── ARCHITECTURE.md


---

## ▶️ Local Setup & Run

### Prerequisites
- Node.js v18 or higher

---

### 1️⃣ Install dependencies
```bash
npm install
cd client
npm install
cd ..
2️⃣ Start development servers
npm run dev
Backend runs on: http://localhost:3000

Frontend runs on: http://localhost:5173

3️⃣ Test collaboration
Open the frontend URL in multiple browser tabs

Draw in one tab → updates appear in others

Use Undo or Clear → synchronized across all clients

🌐 Deployment Overview
Backend: Deployed on Render (Node.js + Socket.IO)

Frontend: Deployed on Vercel (React + Vite)

The backend is deployed first, followed by updating the frontend with the deployed backend URL.

⚠️ Known Limitations
Drawing history is stored in memory

Server restart clears the canvas

No authentication or user identity management

📌 Future Enhancements
Persistent storage using Redis or a database

Room-based collaborative sessions

User names and avatars

Ghost cursors (live user indicators)

Mobile and touch support

