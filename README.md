# Apex Retail Intelligence

**Edge-Optimized Store Funnel & Temporal Ghost Filter**

A Store Intelligence System designed for the Purplle Tech Challenge 2026. This platform brings e-commerce-level analytics (Conversion Funnels, Dwell Times, and Drop-off Rates) into physical retail spaces using edge-optimized computer vision and POS data fusion.

## Key Innovations

*   **Temporal Ghost Filter:** Resolves tracking ID fragmentation across overlapping CCTV cameras without heavy spatial Re-ID models. The temporal aggregation filter mathematically stabilizes the footfall count, successfully filtering raw tracks down to a verified 74 unique visitors.
*   **POS & Vision Integration:** Fuses physical footfall (YOLOv8n + ByteTrack) with point-of-sale offline data to calculate a mathematically true real-time conversion rate (32.43%) and department-level GMV yields (₹44,920 in total revenue tracked).
*   **Zero-Friction Deployment:** A fully containerized application stack (React, FastAPI, SQLite) via Docker for seamless evaluator launch.

## Technology Stack

*   **Computer Vision:** YOLOv8n, ByteTrack, OpenCV
*   **Backend API:** FastAPI, Python, SQLite, Pandas
*   **Frontend Dashboard:** React, Vite, Tailwind CSS
*   **Infrastructure:** Docker, Containerized Microservices

---

## Evaluation Setup & Instructions

**⚠️ WARNING: Video Assets Required**
Before running the pipeline, please ensure the evaluation `.mp4` video files are placed inside the following directory structure: `data/cctv/CCTV Footage/*.mp4`

### 1. Boot the Backend API & Database

Open a terminal at the project root and start the containerized backend:

```bash
docker compose up --build
(The FastAPI server will be available at http://127.0.0.1:8000)

2. Launch the Live React Dashboard
Open a second terminal, navigate to the frontend directory, and run the development server:

Bash
cd apex-dashboard
npm install
npm run dev
(The live dashboard will be available at http://localhost:5173)

3. Execute the Vision Pipeline
Open a third terminal at the project root and execute the edge detection script:

Bash
python3 scripts/run_pipeline.py --api [http://127.0.0.1:8000](http://127.0.0.1:8000) --skip-frames 2
Once the pipeline begins processing the video frames, the React dashboard will automatically poll the API and update the key business metrics in real-time.


Once you save this, you can run your standard Git commands (`git add README.md`, `git commit -m "docs: Finalize README"`, `git push origin main`) to get it onto GitHub before you download your final ZIP for submission!