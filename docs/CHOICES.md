# Engineering Decisions and Trade-offs

## 1. Detection and Tracking Strategy
* **Decision:** Utilized YOLOv8n paired with ByteTrack, processing frames dynamically (`--skip-frames 2`).
* **Trade-off:** I prioritized processing speed and edge-deployment viability over absolute frame-by-frame accuracy. While a heavier model (like YOLOv8x) might capture heavily occluded figures better, YOLOv8n + ByteTrack provides a lightweight pipeline capable of running on standard hardware without needing a massive GPU cluster, while still maintaining high confidence for distinct retail zones.

## 2. Resolving Cross-Camera ID Fragmentation
* **Observation:** Processing 5 distinct camera feeds with overlapping fields of view resulted in severe tracking ID inflation. Without a computationally expensive appearance-based Re-ID model, a single customer generated multiple unique IDs across the store.
* **Decision:** Instead of forcing a heavy AI solution, I solved this architecturally by decoupling the core metrics. The "Total Unique Visitors" denominator strictly utilizes `CAM_03` (Entry/Exit) as the single source of truth. The product zone cameras are dedicated entirely to calculating relative zone engagement and dwell times. This isolates the ID fragmentation, preventing it from corrupting the core Conversion Rate metric.

## 3. The "Ghost Track" Temporal Filter
* **Observation:** Visual occlusions (e.g., the center F.O.H gondolas) caused ByteTrack to occasionally drop IDs and generate micro-tracks lasting only a few frames.
* **Decision:** I implemented a backend temporal filter within the aggregation layer (`metrics.py`). The system requires a session to accumulate a minimum of 5 seconds of total dwell time across all zones. Tracks failing this threshold are classified as "ghosts" and excluded from the final metrics. This mathematically stabilizes the data and filters out AI hallucinations dynamically.

## 4. Database Selection
* **Decision:** Selected SQLite for the data layer.
* **Trade-off:** SQLite provides a zero-config, file-based database perfect for containerized evaluation environments. While a true production deployment would necessitate a transition to PostgreSQL or DynamoDB to handle high-concurrency writes across hundreds of retail locations, SQLite is the optimal choice for the single-store processing required for this challenge phase.