#!/usr/bin/env python3
"""Decode every registered SS1 Technical Drawing image asset in CI.

Integrity hashes alone do not prove that a browser/mobile image decoder can open
an asset. This check verifies the stored bytes, fully decodes PNG/JPEG source
figures, and rasterizes every registered SVG supplement through CairoSVG.
"""
from __future__ import annotations

import hashlib
import io
import json
import sys
from pathlib import Path

import cairosvg
from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[2]
PACKAGE = ROOT / "backend/src/db/ss1/subjects/technical-drawing.json"
EXPECTED_SOURCE_FIGURES = 104


def fail(message: str) -> None:
    raise SystemExit(f"Technical Drawing asset decode failed: {message}")


def main() -> None:
    package = json.loads(PACKAGE.read_text(encoding="utf-8"))
    assets = package.get("assets", [])
    source_assets = [asset for asset in assets if asset["id"].startswith("TD-ASSET-")]
    if len(source_assets) != EXPECTED_SOURCE_FIGURES:
        fail(f"expected {EXPECTED_SOURCE_FIGURES} source figures, found {len(source_assets)}")

    counts = {"image/png": 0, "image/jpeg": 0, "image/svg+xml": 0}
    decoded_pixels = 0

    for asset in assets:
        asset_id = asset["id"]
        path = (ROOT / asset["path"]).resolve()
        if not path.is_relative_to(ROOT) or not path.is_file():
            fail(f"{asset_id}: path is missing or escapes the repository: {asset['path']}")

        payload = path.read_bytes()
        if len(payload) != asset["bytes"]:
            fail(f"{asset_id}: byte count {len(payload)} != registered {asset['bytes']}")
        digest = hashlib.sha256(payload).hexdigest()
        if digest != asset["sha256"]:
            fail(f"{asset_id}: SHA-256 {digest} != registered {asset['sha256']}")

        media_type = asset["media_type"]
        if media_type in ("image/png", "image/jpeg"):
            try:
                with Image.open(io.BytesIO(payload)) as image:
                    image.verify()
                with Image.open(io.BytesIO(payload)) as image:
                    image.load()
                    expected_format = "PNG" if media_type == "image/png" else "JPEG"
                    if image.format != expected_format:
                        fail(f"{asset_id}: decoded as {image.format}, expected {expected_format}")
                    width, height = image.size
            except (OSError, UnidentifiedImageError, Image.DecompressionBombError) as error:
                fail(f"{asset_id}: cannot fully decode {media_type}: {error}")
            if width < 1 or height < 1:
                fail(f"{asset_id}: invalid decoded dimensions {width}x{height}")
            decoded_pixels += width * height
        elif media_type == "image/svg+xml":
            try:
                rendered = cairosvg.svg2png(bytestring=payload)
                with Image.open(io.BytesIO(rendered)) as image:
                    image.verify()
                with Image.open(io.BytesIO(rendered)) as image:
                    image.load()
                    width, height = image.size
            except Exception as error:  # CairoSVG/Pillow expose several decoder exception types.
                fail(f"{asset_id}: SVG cannot be rasterized and decoded: {error}")
            if width < 1 or height < 1:
                fail(f"{asset_id}: invalid SVG render dimensions {width}x{height}")
            decoded_pixels += width * height
        else:
            fail(f"{asset_id}: unsupported image media type {media_type}")

        counts[media_type] += 1

    if sum(counts.values()) != len(assets):
        fail("not every registered asset was decoded")

    print(json.dumps({
        "subject": package["canonical_subject"],
        "package_status": package["package_status"],
        "registered_assets": len(assets),
        "source_figure_assets": len(source_assets),
        "decoded_by_media_type": counts,
        "total_decoded_pixels": decoded_pixels,
        "result": "PASS",
        "note": "Successful decoding verifies file/render compatibility only; it does not grant content approval or source reuse rights."
    }, indent=2))


if __name__ == "__main__":
    main()
