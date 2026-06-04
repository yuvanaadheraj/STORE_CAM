# System Design & Architecture

## 1. Architectural Philosophy
The Apex Retail Intelligence system was designed strictly for **edge-optimized performance** and **functional correctness**. Rather than deploying theoretical, computationally heavy AI models that fail in constrained environments, this architecture relies on a lightweight detection pipeline coupled with a robust backend orchestration layer to derive business intelligence.

## 2. System Components

### A. The Edge Detection Pipeline (Python, OpenCV, YOLOv8n, ByteTrack)
*   **Object Detection:** YOLOv8-nano is used for its superior frame-rate-to-accuracy ratio on edge CPUs/low-end GPUs.
*   **Tracking:** ByteTrack handles temporal consistency without the overhead of deep feature extraction (Re-ID), keeping the pipeline lightweight.
*   **Spatial Logic:** Cameras are mapped to physical store zones using predetermined configuration polygons. Tracks are translated into standard telemetry events (`ENTRY`, `EXIT`, `ZONE_ENTER`, `ZONE_DWELL`).

### B. The API & Aggregation Engine (FastAPI, SQLite, Pandas)
*   **Event Ingestion:** A high-throughput REST API receives batch-optimized JSON payloads from the camera pipeline.
*   **Temporal Aggregation (The Ghost Filter):** To handle camera overlap and ID fragmentation, the backend utilizes time-window sessionization. If a track is lost and a "new" track appears in an adjacent zone within a short delta, they are treated as a continuous session.
*   **POS Data Fusion:** Real-time footfall metrics are merged with offline Point-of-Sale (`pos_transactions.csv`) data via Pandas to calculate definitive conversion rates and GMV, mapping physical movement to actual revenue.

### C. The Frontend Dashboard (React, Vite, Tailwind CSS)
*   **Live Telemetry:** A polling mechanism fetches aggregated metrics and anomalies every 3 seconds.
*   **Business Insights:** Displays top-level KPIs (Unique Visitors, True Conversion Rate, Revenue), spatial metrics (Dwell Heatmaps), and POS analytics (Department GMV, Staff Yield).

## 3. Data Flow
1. **Physical:** Raw video is processed by YOLO/ByteTrack at 10-15 FPS (using `--skip-frames` optimization).
2. **Telemetry:** Spatial movements are converted into batch REST API POST requests.
3. **Aggregation:** FastAPI cleanses the tracks, merges them with POS data, and stores them in SQLite.
4. **Visualization:** React queries the backend for structured UI insights.