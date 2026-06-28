#!/usr/bin/env python3
"""Seed 20 technical track modules for 'Solidity & EVM' via Supabase REST API."""

import json
import uuid
import urllib.request
import urllib.error
from datetime import datetime, timezone

SUPABASE_URL = "https://lsfctypeldlkpqemtwfj.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZmN0eXBlbGRsa3BxZW10d2ZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NzUxNywiZXhwIjoyMDk2NjUzNTE3fQ.77KsuSaN6497R09l-CfDaBaKGfe5-4pO_U3IFuknr60"
TRACK_ID = "54f8f48c-e485-422c-aea6-dfe63c3437c7"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

BASE = {
    "track_id": TRACK_ID,
    "ecosystem": "EVM",
    "category": "technical",
    "is_published": True,
    "updated_at": datetime.now(timezone.utc).isoformat(),
}

MODULES_FILE = "scripts/modules_data.json"

def main():
    with open(MODULES_FILE, "r") as f:
        modules = json.load(f)

    success = 0
    errors = []

    for i, m in enumerate(modules, 1):
        payload = {**BASE, **m, "id": str(uuid.uuid4())}
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")

        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/modules",
            data=data,
            headers=HEADERS,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req) as resp:
                pass  # return=minimal gives no body
            print(f"  [{i:2d}/20] OK  {m['slug']}")
            success += 1
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()
            errors.append(f"{m['slug']}: HTTP {e.code} — {err_body[:200]}")
            print(f"  [{i:2d}/20] FAIL {m['slug']}: HTTP {e.code}")

    print(f"\n{'='*50}")
    print(f"Seeded: {success}/{len(modules)}")
    if errors:
        print(f"Errors ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
    print(f"Track ID: {TRACK_ID}")

if __name__ == "__main__":
    main()
