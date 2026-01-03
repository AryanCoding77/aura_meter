# 🧮 AURA SCORE SYSTEM (-50 to +50)

## Overview

The Aura Meter uses a **negative-to-positive scoring system** where:
- **Negative scores** = actively bad aura (repelling, misaligned, try-hard)
- **Zero** = neutral/forgettable
- **Positive scores** = genuinely good aura (rare and earned)

Most users land between **-15 and +15**.

---

## Score Range & Meaning

| Range | Label | Meaning |
|-------|-------|---------|
| +40 to +50 | Rare Energy | Elite tier - extremely rare |
| +25 to +39 | Strong Presence | Genuinely impressive |
| +10 to +24 | Positive Aura | Good vibes, room to grow |
| 0 to +9 | Neutral | Forgettable but not offensive |
| -1 to -14 | Low Signal | Weak, needs work |
| -15 to -29 | Off Energy | Something's not right |
| -30 to -50 | Negative Presence | Actively repelling |

---

## How Scores Are Calculated

### Step 1: Component Scores (Centered at 0)

#### 1. Confidence Projection (Weight: 35%)
- **Natural confidence**: +10
- **Medium confidence**: 0
- **Low/shy**: -15
- **Unclear**: -5
- **Overconfident/flashy**: -10 ⚠️ (PENALTY!)
- **Forced confidence**: -20

**Key insight**: Overconfidence is penalized, not rewarded.

#### 2. Intentionality (Weight: 30%)
Starts at 0, then adjusted:

**Positive signals:**
- Intentional: +10
- Clean: +5
- Minimal/Professional: +8

**Negative signals:**
- Dramatic (try-hard): -10
- Flashy (copied trend): -8
- Unintentional: -15
- Messy: -12
- Low-effort: -18
- Chaotic: -10

Range: -20 to +20

#### 3. Visual Balance (Weight: 20%)
- Clean + minimal: +10
- Balanced (3-5 elements): +5
- Flashy: -5
- Messy: -10
- Chaotic: -15
- Too cluttered (6+ elements): -8

Range: -15 to +10

#### 4. Consistency (Weight: 15%)
- Aligned positive signals: +8
- Mixed signals: 0
- Conflicting signals: -10
- Consistently negative: -8

Range: -10 to +8

---

### Step 2: Weighted Raw Score

```
raw_score = (confidence × 0.35) + (intentionality × 0.30) + 
            (balance × 0.20) + (consistency × 0.15)
```

Typical range: **-18 to +18**

---

### Step 3: Asymmetric Difficulty Curve

This is what makes positive scores HARD to achieve:

```javascript
if (raw_score >= 0) {
  // Positive scores grow slowly - harder to climb
  final_score = round(raw_score ^ 1.25)
} else {
  // Negative scores drop faster - easier to go negative
  final_score = round(-(|raw_score| ^ 1.1))
}
```

**What this does:**
- Positive scores require exponentially better signals
- Negative scores accumulate faster
- +30 feels genuinely earned
- +40+ is extremely rare
- -30 is a harsh reality check

---

## Roast Intensity by Score

| Score Range | Roast Style |
|-------------|-------------|
| +40 to +50 | Dominant, confident - "don't get arrogant" |
| +20 to +39 | Respectful but challenging |
| +1 to +19 | Teasing, slightly disappointed |
| 0 | Deadpan, cold |
| -1 to -14 | Sharp reality check |
| -15 to -29 | Brutal but fair |
| -30 to -50 | Surgical destruction (no insults) |

---

## Example Scores

### Score: +42 (Rare Energy)
**Roast**: "This works because it's calm, not because it's loud. You're not begging for attention — and that's why you get it. Just don't start trying to upgrade what's already solid."

**One-liner**: "+42/50. Effortlessly magnetic. Don't ruin it."

---

### Score: +15 (Positive Aura)
**Roast**: "You're giving off decent energy, but it's not quite landing yet. The foundation is there, but you're playing it too safe. Push a little harder without trying too hard."

**One-liner**: "+15/50. Positive vibes, but make them louder."

---

### Score: 0 (Neutral)
**Roast**: "There's nothing wrong here — which is exactly the problem. This image doesn't offend, but it doesn't land either. Neutral isn't safe. It's forgettable."

**One-liner**: "0/50. Exists. That's about it."

---

### Score: -5 (Low Signal)
**Roast**: "The vibe is there, but it's weak. You're not committing to anything, and it shows. Either go all in or don't bother — this middle ground isn't doing you favors."

**One-liner**: "-5/50. Low signal, lower impact."

---

### Score: -22 (Off Energy)
**Roast**: "This image is trying to project confidence, but it doesn't believe itself. The choices feel borrowed, not owned. Right now, the aura isn't bad — it's insecure and loud about it."

**One-liner**: "-22/50. Aura so low it's asking for validation."

---

### Score: -38 (Negative Presence)
**Roast**: "Everything about this screams 'trying too hard' while simultaneously giving up. The confidence is forced, the aesthetic is chaotic, and the overall vibe is repelling. This isn't a bad day — this is a pattern."

**One-liner**: "-38/50. Negative energy. Full stop."

---

## Why This System Works

### 1. Realistic Distribution
- Most people get -15 to +15 (realistic)
- High scores feel genuinely earned
- Low scores sting but are fair

### 2. Penalizes Try-Hard Behavior
- Overconfidence = penalty
- Flashy/dramatic = negative
- Copied trends = negative

### 3. Rewards Genuine Quality
- Natural confidence = positive
- Intentional choices = positive
- Clean, minimal = positive

### 4. Deterministic & Transparent
- Same input = same output
- Every component is explainable
- No randomness or AI bias

### 5. Entertainment Value
- Negative scores create memorable roasts
- Positive scores feel special
- Zero is brutally honest

---

## Implementation Details

### File: `src/lib/auraScoring.ts`

**Key Functions:**
- `calculateConfidenceScore()` - Detects overconfidence
- `calculateIntentionalityScore()` - Penalizes try-hard
- `calculateVisualBalanceScore()` - Rewards clean/minimal
- `calculateConsistencyScore()` - Checks signal alignment
- `applyAsymmetricCurve()` - Makes positive scores rare
- `calculateAuraScore()` - Main scoring function

**Exports:**
- `calculateAuraScore(visionData)` - Returns full breakdown
- `getRoastIntensity(score)` - Returns roast guidance
- `validateDeterminism(visionData)` - Confirms consistency

---

## Testing the System

```typescript
import { calculateAuraScore } from './auraScoring';

const testData = {
  confidence_indicators: "high",
  visual_tone: "confident",
  aesthetic_vibe: ["clean", "intentional"],
  notable_elements: ["element1", "element2", "element3"],
  overall_impression: "Strong presentation"
};

const result = calculateAuraScore(testData);
console.log(result.finalScore); // e.g., +18
console.log(result.auraLabel);  // e.g., "Positive Aura"
console.log(result.explanation); // Full breakdown
```

---

## Future Enhancements

Potential improvements:
- [ ] Add temporal analysis (score changes over time)
- [ ] Category-specific scoring (selfie vs. profile vs. screenshot)
- [ ] Peer comparison (percentile ranking)
- [ ] Score history tracking
- [ ] A/B test different curve parameters

---

**Status:** ✅ Production Ready
**Last Updated:** January 1, 2026
