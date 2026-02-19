# PulsePoint Frontend

This frontend now loads all data from the Flask backend API (MySQL-backed).

## Prerequisites

1. Node.js 18+ for frontend
2. Python 3 + MySQL running for backend

## Run

1. Start backend from `Backend/`:
   `python3 app.py`
2. Install frontend deps from `Front-end/`:
   `npm install`
3. (Optional) set backend URL in `Front-end/.env`:
   `VITE_API_BASE_URL=http://localhost:5000`
4. Start frontend:
   `npm run dev`

## Build

`npm run build`
