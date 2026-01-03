/**
 * AURA METER — NEGATIVE TO POSITIVE SCORING SYSTEM (-50 to +50)
 * 
 * This system uses a centered scale where:
 * - Negative scores = actively bad aura (repelling, misaligned, try-hard)
 * - Zero = neutral/forgettable
 * - Positive scores = genuinely good aura (rare and earned)
 * 
 * Key principles:
 * - Most users land between -15 and +15
 * - Positive scores are HARD to achieve
 * - Overconfidence is penalized, not rewarded
 * - Deterministic: same input = same output
 */

import { QwenVisionOutput } from "./fireworks";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ComponentScores {
  confidence: number;      // -20 to +10
  intentionality: number;  // -20 to +20
  visualBalance: number;   // -15 to +10
  consistency: number;     // -10 to +8
}

export interface ScoringBreakdown {
  componentScores: ComponentScores;
  weightedScores: {
    confidence: number;
    intentionality: number;
    visualBalance: number;
    consistency: number;
  };
  rawScore: number;        // Typically -18 to +18
  finalScore: number;      // -50 to +50 after curve
  auraLabel: string;
  explanation: string[];
}

// ============================================================================
// STEP 1: COMPONENT SCORE CALCULATIONS (CENTERED AT 0)
// ============================================================================

/**
 * Calculate Confidence Projection Score (Weight: 35%)
 * IMPORTANT: Overconfidence is penalized!
 */
function calculateConfidenceScore(
  indicator: string,
  visualTone: string,
  aestheticVibe: string[]
): number {
  const baseIndicator = indicator.toLowerCase();
  
  // Check for overconfidence signals
  const isOverconfident = 
    visualTone === "flashy" || 
    aestheticVibe.includes("dramatic") ||
    (baseIndicator === "high" && aestheticVibe.includes("trying"));
  
  if (isOverconfident) {
    return -10; // Overconfidence penalty
  }
  
  // Base confidence scores (centered at 0)
  const scores: Record<string, number> = {
    low: -15,
    medium: 0,
    high: +10,
    unclear: -5,
  };
  
  // Check for forced/shy signals
  if (visualTone === "chaotic" && baseIndicator === "high") {
    return -20; // Forced confidence
  }
  if (visualTone === "minimal" && baseIndicator === "low") {
    return -15; // Shy/withdrawn
  }
  
  return scores[baseIndicator] || -5;
}

/**
 * Calculate Intentionality Score (Weight: 30%)
 * Penalizes try-hard behavior and copied trends
 */
function calculateIntentionalityScore(
  aestheticVibe: string[],
  visualTone: string
): number {
  let score = 0; // Start at neutral
  
  // Positive signals (effortless quality)
  if (aestheticVibe.includes("intentional")) score += 10;
  if (aestheticVibe.includes("clean")) score += 5;
  if (visualTone === "minimal" || visualTone === "professional") score += 8;
  
  // Negative signals (try-hard, copied, unintentional)
  if (aestheticVibe.includes("dramatic")) score -= 10; // Trying too hard
  if (aestheticVibe.includes("flashy")) score -= 8;    // Copied trend
  if (aestheticVibe.includes("unintentional")) score -= 15;
  if (aestheticVibe.includes("messy")) score -= 12;
  if (aestheticVibe.includes("low-effort")) score -= 18;
  if (aestheticVibe.includes("chaotic")) score -= 10;
  
  // Clamp between -20 and +20
  return Math.max(-20, Math.min(20, score));
}

/**
 * Calculate Visual Balance Score (Weight: 20%)
 * Clean and minimal = positive, messy and chaotic = negative
 */
function calculateVisualBalanceScore(
  notableElements: string[],
  visualTone: string,
  aestheticVibe: string[]
): number {
  let score = 0;
  
  // Analyze clutter from element count
  const elementCount = notableElements.length;
  
  // Clean + minimal = best
  if (aestheticVibe.includes("clean") && visualTone === "minimal") {
    score = +10;
  }
  // Balanced presentation
  else if (elementCount >= 3 && elementCount <= 5 && !aestheticVibe.includes("messy")) {
    score = +5;
  }
  // Flashy = negative
  else if (visualTone === "flashy") {
    score = -5;
  }
  // Messy = more negative
  else if (aestheticVibe.includes("messy")) {
    score = -10;
  }
  // Chaotic = very negative
  else if (visualTone === "chaotic" || aestheticVibe.includes("chaotic")) {
    score = -15;
  }
  // Too many elements = cluttered
  else if (elementCount > 6) {
    score = -8;
  }
  
  return Math.max(-15, Math.min(10, score));
}

/**
 * Calculate Consistency Score (Weight: 15%)
 * Aligned signals = positive, conflicting = negative
 */
function calculateConsistencyScore(
  visualTone: string,
  aestheticVibe: string[],
  confidenceIndicator: string
): number {
  const hasPositive = aestheticVibe.some(v => 
    ["clean", "intentional", "professional", "minimal"].includes(v)
  );
  const hasNegative = aestheticVibe.some(v => 
    ["messy", "unintentional", "chaotic", "low-effort", "dramatic"].includes(v)
  );
  
  // Aligned positive signals
  if (hasPositive && !hasNegative && 
      (confidenceIndicator === "high" || confidenceIndicator === "medium") &&
      (visualTone === "confident" || visualTone === "professional" || visualTone === "minimal")) {
    return +8;
  }
  
  // Mixed signals (neutral)
  if (hasPositive && hasNegative) {
    return 0;
  }
  
  // Conflicting signals (negative)
  if ((confidenceIndicator === "high" && visualTone === "chaotic") ||
      (confidenceIndicator === "low" && visualTone === "flashy") ||
      (aestheticVibe.includes("clean") && aestheticVibe.includes("messy"))) {
    return -10;
  }
  
  // Consistently negative
  if (hasNegative && !hasPositive) {
    return -8;
  }
  
  // Default neutral
  return 0;
}

// ============================================================================
// STEP 2: WEIGHTED RAW SCORE CALCULATION
// ============================================================================

/**
 * Calculate weighted raw score (typically -18 to +18)
 */
function calculateRawScore(components: ComponentScores): number {
  const rawScore = 
    (components.confidence * 0.35) +
    (components.intentionality * 0.30) +
    (components.visualBalance * 0.20) +
    (components.consistency * 0.15);
  
  return rawScore;
}

// ============================================================================
// STEP 3: ASYMMETRIC DIFFICULTY CURVE
// ============================================================================

/**
 * Apply asymmetric scaling to make positive scores harder to achieve
 * 
 * Positive scores: grow slowly (harder to climb)
 * Negative scores: drop faster (easier to go negative)
 * 
 * Formula:
 * - If raw >= 0: final = raw^1.25 (makes positive growth slower)
 * - If raw < 0: final = -(|raw|^1.1) (makes negative drop faster)
 */
function applyAsymmetricCurve(rawScore: number): number {
  let finalScore: number;
  
  if (rawScore >= 0) {
    // Positive scores grow slowly - harder to achieve high scores
    finalScore = Math.pow(rawScore, 1.25);
  } else {
    // Negative scores drop faster - easier to go negative
    finalScore = -Math.pow(Math.abs(rawScore), 1.1);
  }
  
  // Clamp to -50 to +50 range
  finalScore = Math.max(-50, Math.min(50, finalScore));
  
  return Math.round(finalScore);
}

// ============================================================================
// AURA LABELS (NEGATIVE TO POSITIVE)
// ============================================================================

/**
 * Get aura label based on final score (-50 to +50)
 */
function getAuraLabel(score: number): string {
  if (score >= 40) return "Rare Energy";
  if (score >= 25) return "Strong Presence";
  if (score >= 10) return "Positive Aura";
  if (score >= 0) return "Neutral";
  if (score >= -14) return "Low Signal";
  if (score >= -29) return "Off Energy";
  return "Negative Presence";
}

/**
 * Get roast intensity guidance for LLaMA
 */
export function getRoastIntensity(score: number): string {
  if (score >= 40) return "Dominant, confident - 'don't get arrogant'";
  if (score >= 20) return "Respectful but challenging";
  if (score >= 1) return "Teasing, slightly disappointed";
  if (score === 0) return "Deadpan, cold";
  if (score >= -14) return "Sharp reality check";
  if (score >= -29) return "Brutal but fair";
  return "Surgical destruction (still no insults)";
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Calculate final aura score with full breakdown
 * Range: -50 to +50 (centered at 0)
 */
export function calculateAuraScore(visionData: QwenVisionOutput): ScoringBreakdown {
  const explanations: string[] = [];
  
  // Step 1: Calculate component scores (centered at 0)
  const componentScores: ComponentScores = {
    confidence: calculateConfidenceScore(
      visionData.confidence_indicators,
      visionData.visual_tone,
      visionData.aesthetic_vibe
    ),
    intentionality: calculateIntentionalityScore(
      visionData.aesthetic_vibe,
      visionData.visual_tone
    ),
    visualBalance: calculateVisualBalanceScore(
      visionData.notable_elements,
      visionData.visual_tone,
      visionData.aesthetic_vibe
    ),
    consistency: calculateConsistencyScore(
      visionData.visual_tone,
      visionData.aesthetic_vibe,
      visionData.confidence_indicators
    ),
  };
  
  // Add explanations
  explanations.push(
    `Confidence: ${componentScores.confidence > 0 ? '+' : ''}${componentScores.confidence} (${visionData.confidence_indicators}, ${visionData.visual_tone} tone)`
  );
  explanations.push(
    `Intentionality: ${componentScores.intentionality > 0 ? '+' : ''}${componentScores.intentionality} (vibes: ${visionData.aesthetic_vibe.join(", ")})`
  );
  explanations.push(
    `Visual Balance: ${componentScores.visualBalance > 0 ? '+' : ''}${componentScores.visualBalance} (${visionData.notable_elements.length} elements)`
  );
  explanations.push(
    `Consistency: ${componentScores.consistency > 0 ? '+' : ''}${componentScores.consistency} (signal alignment)`
  );
  
  // Step 2: Calculate weighted scores
  const weightedScores = {
    confidence: componentScores.confidence * 0.35,
    intentionality: componentScores.intentionality * 0.30,
    visualBalance: componentScores.visualBalance * 0.20,
    consistency: componentScores.consistency * 0.15,
  };
  
  // Step 3: Calculate raw score
  const rawScore = calculateRawScore(componentScores);
  explanations.push(
    `Raw weighted score: ${rawScore > 0 ? '+' : ''}${rawScore.toFixed(2)}`
  );
  
  // Step 4: Apply asymmetric difficulty curve
  const finalScore = applyAsymmetricCurve(rawScore);
  explanations.push(
    `Final score after asymmetric curve: ${finalScore > 0 ? '+' : ''}${finalScore}/50`
  );
  
  // Step 5: Get aura label and roast intensity
  const auraLabel = getAuraLabel(finalScore);
  const roastIntensity = getRoastIntensity(finalScore);
  explanations.push(`Aura classification: ${auraLabel}`);
  explanations.push(`Roast intensity: ${roastIntensity}`);
  
  return {
    componentScores,
    weightedScores,
    rawScore,
    finalScore,
    auraLabel,
    explanation: explanations,
  };
}

/**
 * Validate determinism
 */
export function validateDeterminism(visionData: QwenVisionOutput): boolean {
  const result1 = calculateAuraScore(visionData);
  const result2 = calculateAuraScore(visionData);
  return result1.finalScore === result2.finalScore;
}
