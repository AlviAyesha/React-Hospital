# Dr. React AI Mentor Quality Control Checklist

This document defines the strict quality guidelines and verification checks for **Dr. React** hints during the 50-student Beta test.

---

## 1. Quality Standards Checklist

| Guideline | Strict Rule | Pass Criteria |
|-----------|-------------|---------------|
| **1. Anti-Spoiler Rule** | Never give direct answer or full correct code in initial responses. | Response contains 0 complete replacement code blocks on Hints 1–3. |
| **2. Code Contextualization** | Always reference patient symptoms or terminal error output. | Response explicitly names the error or hook in the mission code. |
| **3. Micro-Step Actionability** | Give exactly ONE micro-step or guiding question per turn. | Avoids dumping long multi-paragraph textbook explanations. |
| **4. Progressive Hint Stages** | Escalate clues sequentially across 4 stages. | Stage 1 (Concept) -> Stage 2 (Location) -> Stage 3 (Line Clue) -> Stage 4 (Near-Solution). |
| **5. Tone & Language Adherence** | Speak in configured language (Hinglish or English) and tone style. | Natural Roman Urdu/Hindi dev phrasing when Hinglish is selected. |
| **6. Motivational Closing** | End every hint with an encouraging call-to-action. | E.g. *"Check that hook dependency and let me know what you find!"* |

---

## 2. Offline Fallback Verification

When AI provider API keys are unconfigured or rate limited:
- The system returns pre-crafted, stage-aware diagnostic hints (`getFallbackDrReactHint()`).
- Offline hints match the patient symptoms and current hint stage level.
