import sqlite3
import json
import os

DB_PATH = "./data/store_intelligence.db" 
OUTPUT_PATH = "events.jsonl"

def export_to_jsonl():
    if not os.path.exists(DB_PATH):
        print(f"Error finding DB at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM events")
    rows = cursor.fetchall()

    with open(OUTPUT_PATH, 'w') as f:
        for row in rows:
            # Convert the sqlite3.Row to a standard dictionary!
            # Inside your for loop:
            row_dict = dict(row) 
            
            event_dict = {
                "event_id": row_dict.get('event_id') or f"evt-{row_dict.get('id', '000')}",
                "store_id": "ST1008",
                "camera_id": row_dict.get('camera_id') or "CAM_01",
                "visitor_id": str(row_dict.get('person_id') or row_dict.get('visitor_id') or "V000"),
                "event_type": row_dict.get('event_type') or "ENTRY",
                "timestamp": row_dict.get('timestamp') or "2026-04-10T14:40:00+00:00",
                "confidence": float(row_dict.get('confidence') or 0.95),
                "is_staff": bool(row_dict.get('is_staff') or False),
                "dwell_ms": int(row_dict.get('dwell_ms') or row_dict.get('dwell_time') or 0),
                "zone_id": row_dict.get('zone_id'),
                "metadata": {}
            }
            f.write(json.dumps(event_dict) + "\n")

    conn.close()
    print(f"Successfully exported events to {OUTPUT_PATH}")

if __name__ == "__main__":
    export_to_jsonl()