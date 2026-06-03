# System Design and Architecture

The Apex Retail Intelligence system is designed as a decoupled, event-driven pipeline optimized for lightweight edge deployment. 

## 1. The Vision Pipeline (Edge Nodes)
The computer vision component is strictly isolated from the business logic. It utilizes **YOLOv8n** for person detection and **ByteTrack** for spatial tracking. 
* **Input:** Raw `.mp4` feeds from 5 specific camera roles (Entry, Billing, Product Zones).
* **Processing:** Frame-skipping (`--skip-frames 2`) is applied to maintain real-time processing speeds on standard hardware.
* **Output:** Generates standard telemetry events (`ENTRY`, `ZONE_ENTER`, `ZONE_DWELL`, `BILLING_QUEUE_JOIN`) and pushes them to the backend via HTTP POST.

## 2. The Ingestion & Aggregation API (Backend)
Built with **FastAPI** and **SQLite**, the backend acts as the central nervous system.
* **Ingestion:** Receives unstructured telemetry from the edge nodes and stores it in a time-series optimized schema.
* **State Machine:** Reconstructs isolated events into continuous `Sessions` to track a single visitor's journey through the store.
* **Anomaly Engine:** Compares real-time session data against historical benchmarks (e.g., Conversion Rate drops, Dead Zones) and flags actionable alerts.

## 3. The Interactive Dashboard (Frontend)
A **React** and **Tailwind CSS** application that continuously polls the FastAPI endpoints to render live footfall, zone-specific dwell times, and active system alerts.