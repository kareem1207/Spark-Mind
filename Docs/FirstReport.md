# Spark Mind – Technical Analysis and Report

## Overview

This report documents the current state of the Spark Mind repository based on the files present in the workspace. The codebase is in an early stage and contains:

- A minimal backend (Python) with a scoring utility for a memory game and a placeholder entry point.
- A very simple frontend (static HTML welcome page).
- Test artifacts for speech-to-text transcription experiments using OpenAI Whisper (via the open-source whisper Python package), including audio samples and a JSON transcription result.
- An empty database folder and a docs folder containing this report.

The primary implemented logic resides in `backend/MemoryGameScore.py`, which provides a scoring mechanism to compare a set of “actual” words against a set of “guessed” words.

---

## Repository Structure (as analyzed)

- `backend/`
    - `main.py` – placeholder script that currently prints "Hello world"; no framework wiring yet.
    - `MemoryGameScore.py` – contains the `Marks` class implementing the memory game scoring logic.
    - `audio/` – contains `audio.mp3` and `audio2.mp3` sample audio files.
    - `tests/`
        - `OpenAi whisper.ipynb` – Jupyter notebook that imports `whisper` and runs transcription (CPU-targeted, with a local cache path).
        - `sample.txt` – a small text file likely used in testing.
        - `transcription.json` – Whisper output containing text, segments, tokens, word-level timings, and probabilities.
- `frontend/`
  - `index.html` – static "Welcome to Spark Mind" page with simple styling.
- `database/` – currently empty.
- `Docs/FirstReport.md` – this report.

---

## Backend Logic and Algorithms

### Memory Game Scoring (`backend/MemoryGameScore.py`)

Code summary:

```python
class Marks:
    def __init__(self, actual_words: list[str], guessed_words: list[str]):
        self.score: int = 0
        self.actual_words = actual_words
        self.guessed_words = guessed_words

    def add_score(self):
        words_comp: dict[str, int] = {}
        for word in self.actual_words:
            words_comp[word] = words_comp.get(word, 0) + 1
        for word in self.guessed_words:
            if word in words_comp and words_comp[word] == 1:
                self.score += 1

    def return_score(self) -> int:
        return self.score
```

Intent and behavior:

- The algorithm builds a frequency dictionary `words_comp` for the `actual_words` list.
- It then iterates over `guessed_words` and increments `score` by 1 for each guessed word that appears in `actual_words` with frequency exactly 1.
- Duplicates in `actual_words` are intentionally not counted as correct matches unless the frequency check is broadened (currently it must be exactly 1). Duplicates in `guessed_words` do not reduce remaining availability and do not consume counts, since the availability in `words_comp` is not decremented during scoring.

Complexity:

- Building the frequency map: O(n), where n = len(actual_words)
- Scoring loop: O(m), where m = len(guessed_words)
- Space: O(u) for unique words in `actual_words`

Edge cases and considerations:

- Case sensitivity: Strings are matched exactly; "Apple" != "apple".
- Punctuation/whitespace: No normalization is applied.
- Multiple occurrences: Because of the `== 1` condition and no decrementing, multiple instances of a guessed word will all count as hits as long as the word exists once in `actual_words` (e.g., guessed_words = ["cat", "cat"], actual_words = ["cat"] results in score 2). This may or may not be intended.
- If the intent is to do multiset matching, common logic is to decrement availability when a guess is counted, e.g., `if words_comp[word] > 0: score += 1; words_comp[word] -= 1`.

Suggested alternative (if you want multiset-aware scoring):

```python
def add_score(self):
    words_comp: dict[str, int] = {}
    for w in self.actual_words:
        words_comp[w] = words_comp.get(w, 0) + 1
    for g in self.guessed_words:
        if words_comp.get(g, 0) > 0:
            self.score += 1
            words_comp[g] -= 1
```

This change ensures each occurrence in `actual_words` can only contribute once to the score.

### Backend entry point (`backend/main.py`)

Currently contains only:

```python
print("Hello world")
```

There is no web framework or API surface yet. If a service is planned, consider FastAPI for a simple JSON API that exposes the scoring functionality and, later, transcription endpoints.

---

## Transcription Experiments (Tests)

The notebook `backend/tests/OpenAi whisper.ipynb` indicates use of the open-source Whisper package:

- Imports: `import os, shutil, torch, whisper as ws`
- Model loading (example from notebook): `ws.load_model("small", device="cpu", download_root=r"D:\\whisper_cache")`
- Outputs are stored in `transcription.json`, which contains fields such as `text`, `segments`, `tokens`, `words`, and metrics (`avg_logprob`, `no_speech_prob`, etc.).

From the JSON, we can infer the process:

1. Audio is processed into time-aligned segments.
2. Each segment includes token IDs and decoded text.
3. Word-level timestamps and probabilities are available, enabling confidence analysis.

While these experiments are not yet wired into the Python backend code (`main.py`), the artifacts demonstrate feasibility for a speech-to-text feature.

---

## Frontend

`frontend/index.html` is a single-page static welcome screen with basic CSS. No JavaScript or API calls are present yet.

---

## Libraries and Dependencies Identified

- Python (standard library types used; no external imports in committed backend scripts at this time).
- In tests (Jupyter notebook):
  - `whisper` (OpenAI Whisper, open-source) – automatic speech recognition.
  - `torch` – required backend for Whisper models.
  - `os`, `shutil` – standard library modules for filesystem handling.

No `requirements.txt` or `pyproject.toml` is present in the repo, so dependencies are implicit from the notebook.

---

## Formulas and Data Processing Details

### Scoring Formula

Given:

- Actual words A = [a1, a2, ..., an]
- Guessed words G = [g1, g2, ..., gm]

Current implemented rule increments the score for each guess `g` satisfying frequency_A(g) == 1.

Mathematically:

1. Build frequency map f(w) = count of w in A.
2. For each g in G, if f(g) == 1 then score += 1.

This can be written as:

Score = Σ_{g∈G} 1{ f(g) = 1 }

Where 1{·} is the indicator function.

Limitations: This formulation does not cap contributions by frequency in A and ignores duplicates in G. If multiset matching is desired, the alternative logic becomes:

Score = Σ_{g∈G} 1{ f_t(g) > 0 }, with f_t updated per match: f_t(g) ← f_t(g) − 1.

### Whisper Transcription Output

For each segment s, the JSON includes:

- `start`, `end` (seconds)
- `text` (decoded string)
- `tokens` (token IDs)
- `avg_logprob`, `no_speech_prob`, `compression_ratio`
- `words`: list of { word, start, end, probability }

These allow optional post-processing formulas like:

- Utterance confidence ≈ mean probability over words.
- Speaking rate ≈ total words / (end − start).
- Silence detection using `no_speech_prob` thresholds.

---

## Current State Assessment

- Core game logic: Present and functional for a simple rule set.
- Backend service/API: Not yet implemented.
- ASR experiments: Present in notebooks; not integrated into backend.
- Frontend: Placeholder welcome page; no interaction.
- Database: Not yet used.

---

## Recommendations and Next Steps

1. Clarify scoring rules:
    - Decide between unique-only matching (current) versus multiset matching (common in memory/word games).
    - Add tests covering case sensitivity, punctuation, and duplicates.

2. Introduce a backend API:
    - Consider FastAPI with endpoints like POST `/score` { actual_words, guessed_words } returning { score }.
    - Optional: Add a POST `/transcribe` endpoint to process uploaded audio and return Whisper results (once integrated).

3. Packaging and dependencies:
    - Add `requirements.txt` including at least: `fastapi`, `uvicorn`, `pydantic`, `whisper`, `torch` (exact versions tbd).
    - Create a minimal app structure and tests with `pytest`.

4. Frontend wiring:
    - Replace static page with a simple form to submit words for scoring.
    - Later, add audio upload for transcription.

5. Data handling:
    - If storing results, add a simple persistence layer (SQLite or a cloud DB) and schema.

6. Performance and reliability:
    - If Whisper runs on CPU, preload the model once per process.
    - Use `/health` endpoint and logging around inference calls.

---

## Example Test Cases (for the scoring logic)

1. Unique match only (current logic):
    - A = ["cat", "dog"], G = ["cat", "cat", "dog"] → score = 3 (because f(cat)=1 and f(dog)=1; duplicates in G all score).

2. Multiset matching (proposed variant):
    - A = ["cat", "dog"], G = ["cat", "cat", "dog"] → score = 3 under current logic; proposed becomes 3 only if you decrement counts; if A = ["cat", "dog"], G = ["cat", "cat", "dog", "dog"] → proposed score = 3 (since only one "dog" is available).

3. Case sensitivity:
    - A = ["Cat"], G = ["cat"] → score = 0 unless normalized.

4. Duplicates in A:
    - A = ["cat", "cat"], G = ["cat"] → current score = 0 (f(cat)=2); multiset variant score = 1.

---

## Conclusion

Spark Mind currently contains a foundational scoring utility and early ASR experiments. Formalizing the scoring rules, exposing an API, and integrating the transcription pipeline will turn the repository into a functional prototype. The suggestions above outline a low-risk path from this baseline to an end-to-end, testable application.

