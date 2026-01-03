/**
 * Aura Tips Generator
 * Provides free (generic) and paid (personalized) improvement tips
 */

import { AuraResult } from "./fireworks";

/**
 * Generate a generic free tip based on aura score
 */
export function getFreeTip(score: number): string {
  if (score >= 40) {
    return "Keep doing what you're doing. Consistency is key to maintaining strong energy.";
  }
  if (score >= 25) {
    return "Focus on activities that align with your natural strengths.";
  }
  if (score >= 10) {
    return "Try spending more time on things that calm your mind.";
  }
  if (score >= 0) {
    return "Small daily actions aligned with your goals will boost your presence.";
  }
  if (score >= -14) {
    return "Consider what drains your energy and minimize those interactions.";
  }
  if (score >= -29) {
    return "Take time to reflect on what truly matters to you.";
  }
  return "Start with one small change that feels authentic to you.";
}

/**
 * Generate personalized paid tips based on full aura analysis
 */
export function getPaidTip(result: AuraResult): string {
  const { aura_score, strengths, weaknesses } = result;
  
  // High performers
  if (aura_score >= 40) {
    return `Your aura is strong, but don't let it make you complacent. ${strengths[0]?.toLowerCase() || 'Your natural confidence'} is your foundation—build on it by addressing ${weaknesses[0]?.toLowerCase() || 'areas where you hold back'}. People already respect your energy; now make it unforgettable.`;
  }
  
  // Strong presence
  if (aura_score >= 25) {
    return `You're close to elite energy. ${strengths[0] || 'Your presence'} works in your favor, but ${weaknesses[0]?.toLowerCase() || 'inconsistency'} is holding you back. Focus on showing up with the same intentionality every day. Your aura strengthens when your actions match your potential.`;
  }
  
  // Positive but room to grow
  if (aura_score >= 10) {
    return `Your aura has potential, but it's not fully realized yet. ${weaknesses[0] || 'Uncertainty in your energy'} is the main blocker. When you ${strengths[0]?.toLowerCase() || 'lean into your natural strengths'}, people notice. Do more of that, and cut out anything that feels forced.`;
  }
  
  // Neutral/forgettable
  if (aura_score >= 0) {
    return `Your aura is neutral—not bad, but not memorable. The issue isn't what you're doing wrong; it's what you're not doing at all. ${weaknesses[0] || 'Playing it safe'} keeps you invisible. Start taking small risks that feel authentic. Your energy will follow.`;
  }
  
  // Weak signal
  if (aura_score >= -14) {
    return `Your aura weakens when you ${weaknesses[0]?.toLowerCase() || 'suppress your true self'}. People sense the disconnect. The fix isn't to try harder—it's to stop trying to be something you're not. ${strengths[0] || 'Your authentic moments'} are when your energy actually works. Lean into those.`;
  }
  
  // Off energy
  if (aura_score >= -29) {
    return `Your aura is actively working against you. ${weaknesses[0] || 'The energy you project'} creates distance instead of connection. This isn't about changing who you are—it's about removing what's fake. People can tell when you're performing. Stop performing. Start being real.`;
  }
  
  // Negative presence
  return `Your aura is in the red zone. ${weaknesses[0] || 'The way you show up'} is pushing people away. The harsh truth: you're either trying too hard or not trying at all. ${strengths[0] ? `You have ${strengths[0].toLowerCase()} going for you—start there.` : 'Find one thing that feels natural and build from that.'} Everything else is noise.`;
}

/**
 * Check if user has unlocked premium tips (placeholder - integrate with credit system)
 */
export function hasPremiumAccess(userId: string | null): boolean {
  // TODO: Integrate with actual credit/payment system
  // For now, return false to show locked state
  return false;
}
