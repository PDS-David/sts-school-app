#!/usr/bin/env python3
"""Generate the original SS1 French library dialogue in two French TTS speeds.

The dialogue is original classroom material. Audio is synthetic speech, not an
official WAEC/NECO recording and not a human/native-speaker certification.
"""
from __future__ import annotations

import asyncio
import os
import subprocess
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "french"
OUT.mkdir(parents=True, exist_ok=True)

DIALOGUE = [
    ("Ada", "Bonjour, monsieur. Je cherche un livre sur les animaux."),
    ("Le bibliothécaire", "Bonjour. Regardez la deuxième étagère, à gauche."),
    ("Ada", "Merci. Est-ce que je peux emprunter ce livre ?"),
    ("Le bibliothécaire", "Oui. Avez-vous votre carte ?"),
    ("Ada", "Oui, la voici. Quand dois-je rendre le livre ?"),
    ("Le bibliothécaire", "Vendredi prochain."),
    ("Ada", "Très bien. Merci et au revoir."),
    ("Le bibliothécaire", "Au revoir."),
]

VOICES = {
    "Ada": "fr-FR-DeniseNeural",
    "Le bibliothécaire": "fr-FR-HenriNeural",
}


async def synthesize(rate: str, output_name: str) -> None:
    with tempfile.TemporaryDirectory(prefix="ss1-french-") as temp_dir:
        temp = Path(temp_dir)
        segment_paths: list[Path] = []
        for index, (speaker, text) in enumerate(DIALOGUE, start=1):
            segment = temp / f"segment-{index:02d}.mp3"
            communicate = edge_tts.Communicate(
                text,
                VOICES[speaker],
                rate=rate,
                pitch="+0Hz",
                volume="+0%",
            )
            await communicate.save(str(segment))
            segment_paths.append(segment)

        concat_list = temp / "segments.txt"
        concat_list.write_text(
            "".join(f"file '{path.as_posix()}'\n" for path in segment_paths),
            encoding="utf-8",
        )
        output = OUT / output_name
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "concat", "-safe", "0",
                "-i", str(concat_list), "-c:a", "libmp3lame",
                "-b:a", "64k", "-ar", "24000", "-ac", "1",
                "-metadata", "title=À la bibliothèque — SS1 French dialogue",
                "-metadata", "artist=STS School — synthetic French TTS",
                "-metadata", "comment=Original classroom dialogue; not official WAEC/NECO audio.",
                str(output),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        if not output.exists() or output.stat().st_size < 10_000:
            raise RuntimeError(f"Audio output is missing or unexpectedly small: {output}")
        print(f"Generated {output} ({output.stat().st_size} bytes)")


async def main() -> None:
    await synthesize("+0%", "SS1_French_Dialogue_standard.mp3")
    await synthesize("-20%", "SS1_French_Dialogue_slow.mp3")


if __name__ == "__main__":
    asyncio.run(main())
