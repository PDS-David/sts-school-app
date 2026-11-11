#!/usr/bin/env python3
"""Generate the original SS1 French library dialogue as two MP3 assets.

Uses the two-speaker French UPMC Piper voice model. This is synthetic speech,
not a human/native-speaker recording and not official WAEC/NECO audio.
"""
from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "french"
MODEL_DIR = Path(tempfile.gettempdir()) / "ss1-french-piper-voices"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

MODEL_NAME = "fr_FR-upmc-medium"
MODEL_PATH = MODEL_DIR / f"{MODEL_NAME}.onnx"
DIALOGUE = [
    (0, "Bonjour, monsieur. Je cherche un livre sur les animaux."),
    (1, "Bonjour. Regardez la deuxième étagère, à gauche."),
    (0, "Merci. Est-ce que je peux emprunter ce livre ?"),
    (1, "Oui. Avez-vous votre carte ?"),
    (0, "Oui, la voici. Quand dois-je rendre le livre ?"),
    (1, "Vendredi prochain."),
    (0, "Très bien. Merci et au revoir."),
    (1, "Au revoir."),
]


def run(command: list[str], *, input_text: str | None = None) -> None:
    subprocess.run(
        command,
        input=input_text,
        text=True,
        check=True,
        stdout=subprocess.DEVNULL,
    )


def ensure_voice() -> None:
    if MODEL_PATH.exists() and MODEL_PATH.with_suffix(".onnx.json").exists():
        return
    run([
        sys.executable, "-m", "piper.download_voices",
        MODEL_NAME, "--data-dir", str(MODEL_DIR),
    ])


def synthesize(length_scale: str, filename: str) -> None:
    with tempfile.TemporaryDirectory(prefix="ss1-french-") as temp_dir:
        temp = Path(temp_dir)
        segments: list[Path] = []
        for index, (speaker_id, text) in enumerate(DIALOGUE, start=1):
            wav = temp / f"turn-{index:02d}.wav"
            run([
                sys.executable, "-m", "piper",
                "-m", str(MODEL_PATH),
                "-f", str(wav),
                "--speaker", str(speaker_id),
                "--length-scale", length_scale,
                "--", text,
            ])
            if not wav.exists() or wav.stat().st_size < 2_000:
                raise RuntimeError(f"Piper did not produce turn {index}")
            segments.append(wav)

        concat_list = temp / "segments.txt"
        concat_list.write_text(
            "".join(f"file '{path.as_posix()}'\n" for path in segments),
            encoding="utf-8",
        )
        output = OUT / filename
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "concat", "-safe", "0",
                "-i", str(concat_list), "-c:a", "libmp3lame",
                "-b:a", "64k", "-ar", "22050", "-ac", "1",
                "-metadata", "title=À la bibliothèque — SS1 French dialogue",
                "-metadata", "artist=STS School — synthetic French TTS",
                "-metadata", "comment=Original dialogue; Piper UPMC French voice model; CC BY-SA 4.0 dataset attribution in accompanying README; not official WAEC/NECO audio.",
                str(output),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        if not output.exists() or output.stat().st_size < 10_000:
            raise RuntimeError(f"Audio output is missing or unexpectedly small: {output}")
        print(f"Generated {output} ({output.stat().st_size} bytes)")


def main() -> None:
    ensure_voice()
    synthesize("1.0", "SS1_French_Dialogue_standard.mp3")
    synthesize("1.25", "SS1_French_Dialogue_slow.mp3")


if __name__ == "__main__":
    main()
