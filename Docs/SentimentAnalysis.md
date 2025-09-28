# Sentiment Analysis – Technical Brief and Implementation Notes

## Overview

This document summarizes the current sentiment analysis work captured in the notebook `backend/tests/Sentiment Analyzer.ipynb`. The notebook demonstrates how to load a multilingual sentiment model from Hugging Face Transformers, perform inference on sample text, and convert the model’s probability distribution over five sentiment classes into a single numeric score via a weighted average.

Unlike the general repository report, this brief focuses solely on the sentiment pipeline: libraries, model choice, runtime considerations (memory/CPU), and the scoring formula used to transform probabilities into an interpretable score.

---

## What’s Implemented

- Environment bootstrap (pip installs inside the notebook).
- Model and tokenizer loading with local caching to `D:\Models\Sentiment`.
- A resilience path that clears a potentially corrupted cache snapshot and re-downloads the model when loading fails.
- Single-text inference producing a probability distribution across five classes: [very negative, negative, neutral, positive, very positive].
- Post-processing that maps probabilities to an overall score using configurable weights.

---

## Code Walkthrough (Notebook)

### Key Libraries

- transformers – AutoTokenizer, AutoModelForSequenceClassification
- torch – tensor ops, softmax, device management
- shutil, os – cache management (cleanup on OSError)

### Model Choice and Cache

- Model: `tabularisai/multilingual-sentiment-analysis`
- Cache directory: `D:\\Models\\Sentiment`
- Loading strategy:
  1) Attempt normal load from cache (fp32 on CPU) for both tokenizer and model.
  2) On OSError, remove the corresponding snapshot directory under the cache and force a clean re-download.

### Inference Flow

1. Build inputs: `tokenizer(text, return_tensors="pt")`.
2. Forward pass: `outputs = model(**inputs)`.
3. Convert logits to probabilities: `pred = torch.softmax(outputs.logits, dim=1)` → shape [1, 5].
4. Class labels are ordered as: very negative, negative, neutral, positive, very positive.
5. The top label is printed along with the raw probability vector.

---

## Scoring Formula (Weighted Average)

We convert the five-class probability vector p = [p1, p2, p3, p4, p5] into a single score by applying weights w = [0.2, 0.4, 0.6, 0.8, 1.0] and scaling by 100:

Score = 100 × Σ (p_i × w_i), for i in {1..5}

Interpretation:

- Higher weights for more positive classes marginally increase the score when the model leans positive; more negative classes lower it.
- Weights are domain-configurable. The current set is a placeholder to illustrate the pipeline and can be adapted to your metric (e.g., clinical risk, engagement tone, etc.).

---

## Practical Considerations (Memory/Performance)

- Large checkpoint loads can peak RAM usage on Windows CPU environments. If RAM/pagefile is constrained, consider:
  - Using `low_cpu_mem_usage=True` during from_pretrained (where applicable).
  - Running with `torch.inference_mode()` and avoiding batches.
  - Truncating inputs (e.g., `max_length=128`) to limit sequence length.
  - Optionally switching to a smaller multilingual model (e.g., `lxyuan/distilbert-base-multilingual-cased-sentiments-student`) if footprint is critical.

---

## Example Output

Given an example text, the notebook prints:

- Top label (argmax over probabilities)
- Probability vector, e.g., [0.04, 0.17, 0.20, 0.56, 0.03]
- Weighted score (0–100), derived via the formula above

---

## Recommendations and Next Steps

1. Finalize model selection based on accuracy vs. memory constraints (keep `tabularisai/*` or adopt a lighter student model).
2. Externalize weights to a config so experiments don’t require code edits.
3. Add a short validation set and report accuracy/f1 per class to quantify trade-offs.
4. Wrap the notebook logic into a simple Python module or FastAPI endpoint for integration.
5. Add tests that cover: tokenization edge cases, very long inputs (truncation), and numeric stability of the softmax/weighting step.

---

## Conclusion

The notebook establishes a clear, reproducible path from raw text to a probabilistic sentiment profile and a single interpretable score. With small adjustments (weight tuning, optional lighter model, and API wrapping), this can be promoted from a research notebook into a reliable component of the broader Early Spark pipeline.
