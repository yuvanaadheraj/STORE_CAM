# Apex Retail Intelligence: Store ST1008

An end-to-end AI-powered Store Intelligence System built for the Purplle Tech Challenge 2026. This system processes raw CCTV footage using edge-optimized computer vision, aggregates spatial events into a centralized API, and visualizes retail metrics (Conversion Rate, Queue Depth, Dwell Times) in real-time.

## System Architecture Overview
* **Frontend:** React, Tailwind CSS, Vite
* **Backend API:** FastAPI, Uvicorn, SQLite
* **Vision Pipeline:** YOLOv8n, ByteTrack (Edge-optimized)
* **Containerization:** Docker & Docker Compose

## Quick Start (Evaluation Guide)

**1. Start the Backend API & Database**
To spin up the containerized backend and initialize the database:
`bash
docker compose up --build
`
*The API will be available at `http://localhost:8000`.*

**2. Start the Live Dashboard**
Open a second terminal window to launch the UI:
`bash
cd apex-dashboard
npm install
npm run dev
`
*The dashboard will be available at `http://localhost:5173`.*

**3. Execute the Vision Pipeline**
Open a third terminal window to process the CCTV feeds and ingest telemetry data:
`bash
python3 scripts/run_pipeline.py --api http://127.0.0.1:8000 --skip-frames 2
`

## Testing & Quality Assurance
To verify production readiness, edge-case handling, and the temporal ghost-filtering logic:
`bash
python3 -m pytest tests/ -v
`