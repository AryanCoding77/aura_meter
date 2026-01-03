/**
 * Result Storage System
 * Stores aura results both in localStorage and Supabase database
 * Also encodes them in shareable URLs
 */

import { AuraResult, QwenVisionOutput } from "./fireworks";
import { supabase } from "./supabase";

export interface StoredResult extends AuraResult {
  id: string;
  timestamp: number;
  vision_analysis?: QwenVisionOutput;
}

const STORAGE_KEY = 'aura_results';
const MAX_RESULTS = 100; // Keep last 100 results

/**
 * Generate a unique ID for a result
 */
function generateResultId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Encode result data to base64 for URL sharing
 */
function encodeResultData(result: AuraResult): string {
  try {
    const json = JSON.stringify(result);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.error('Error encoding result:', error);
    return '';
  }
}

/**
 * Decode result data from base64 URL parameter
 */
export function decodeResultData(encoded: string): AuraResult | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (error) {
    console.error('Error decoding result:', error);
    return null;
  }
}

/**
 * Get all stored results from localStorage
 */
function getAllResults(): StoredResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading results from storage:', error);
    return [];
  }
}

/**
 * Save all results to localStorage
 */
function saveAllResults(results: StoredResult[]): void {
  try {
    // Keep only the most recent MAX_RESULTS
    const trimmed = results.slice(-MAX_RESULTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving results to storage:', error);
  }
}

/**
 * Save a new aura result to both localStorage and Supabase
 * Returns the unique ID
 */
export async function saveAuraResult(
  result: AuraResult, 
  visionAnalysis?: QwenVisionOutput
): Promise<string> {
  let finalId = generateResultId(); // Default ID for localStorage
  const timestamp = Date.now();

  // Save to Supabase first if user is authenticated (to get the UUID)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('💾 Saving analysis to Supabase for user:', user.id);
      
      // Check user's current credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw new Error('Failed to check credits');
      }

      // Check if user has credits
      if (profile.credits_remaining <= 0) {
        throw new Error('No credits remaining. Please purchase more credits to continue.');
      }

      console.log(`💳 User has ${profile.credits_remaining} credits. Deducting 1 credit...`);

      // Deduct 1 credit
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Error deducting credit:', updateError);
        throw new Error('Failed to deduct credit');
      }

      console.log(`✅ Credit deducted. Remaining: ${profile.credits_remaining - 1}`);
      
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          // Don't pass id - let Supabase generate UUID
          user_id: user.id,
          aura_score: result.aura_score,
          aura_label: result.aura_label,
          roast: result.roast,
          personality_insight: result.personality_insight,
          strengths: result.strengths || [],
          weaknesses: result.weaknesses || [],
          improvement_tips: result.improvement_tips || [],
          shareable_one_liner: result.shareable_one_liner,
          vision_analysis: visionAnalysis || null,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error saving to Supabase:', error);
        // Rollback credit deduction
        await supabase
          .from('profiles')
          .update({ credits_remaining: profile.credits_remaining })
          .eq('id', user.id);
        throw new Error('Failed to save analysis');
      } else {
        console.log('✅ Analysis saved to Supabase successfully:', data);
        // Use the UUID from Supabase
        finalId = data.id;
      }
    } else {
      console.log('ℹ️ No authenticated user - skipping Supabase save');
    }
  } catch (error) {
    console.error('❌ Exception saving to Supabase:', error);
    // Re-throw the error so the UI can handle it
    throw error;
  }

  // Save to localStorage with the final ID
  const storedResult: StoredResult = {
    ...result,
    id: finalId,
    timestamp,
    vision_analysis: visionAnalysis,
  };

  const allResults = getAllResults();
  allResults.push(storedResult);
  saveAllResults(allResults);

  return finalId;
}

/**
 * Get a result by its ID from localStorage or Supabase
 */
export async function getAuraResultById(id: string): Promise<StoredResult | null> {
  // First check localStorage
  const allResults = getAllResults();
  const localResult = allResults.find(r => r.id === id);
  
  if (localResult) {
    return localResult;
  }

  // If not in localStorage and looks like a UUID, try Supabase
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  if (isUUID) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            aura_score: data.aura_score,
            aura_label: data.aura_label,
            roast: data.roast,
            personality_insight: data.personality_insight,
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            improvement_tips: data.improvement_tips || [],
            shareable_one_liner: data.shareable_one_liner,
            timestamp: new Date(data.created_at).getTime(),
            vision_analysis: data.vision_analysis || undefined,
          };
        }
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }
  }

  return null;
}

/**
 * Generate a shareable URL with encoded result data
 * This allows the result to be viewed even in a new browser
 */
export function getShareableUrl(resultId: string, result: AuraResult): string {
  const encodedData = encodeResultData(result);
  return `${window.location.origin}/result/${resultId}?data=${encodedData}`;
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableUrl(resultId: string, result: AuraResult): Promise<boolean> {
  try {
    const url = getShareableUrl(resultId, result);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Fetch all analyses for the current user from Supabase
 */
export async function fetchUserAnalyses(): Promise<StoredResult[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('ℹ️ No authenticated user - returning localStorage results only');
      return getAllResults();
    }

    console.log('📥 Fetching analyses from Supabase for user:', user.id);
    
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching from Supabase:', error);
      // Fall back to localStorage
      return getAllResults();
    }

    if (!data || data.length === 0) {
      console.log('ℹ️ No analyses found in Supabase - returning localStorage results');
      return getAllResults();
    }

    console.log(`✅ Fetched ${data.length} analyses from Supabase`);
    
    // Convert Supabase data to StoredResult format
    const supabaseResults: StoredResult[] = data.map(row => ({
      id: row.id, // This is now a UUID from Supabase
      aura_score: row.aura_score,
      aura_label: row.aura_label,
      roast: row.roast,
      personality_insight: row.personality_insight,
      strengths: row.strengths || [],
      weaknesses: row.weaknesses || [],
      improvement_tips: row.improvement_tips || [],
      shareable_one_liner: row.shareable_one_liner,
      timestamp: new Date(row.created_at).getTime(),
      vision_analysis: row.vision_analysis || undefined,
    }));

    // Merge with localStorage results
    const localResults = getAllResults();
    const mergedResults = [...supabaseResults];
    
    // Add any local results that aren't in Supabase (by checking if ID is UUID format)
    localResults.forEach(localResult => {
      // Check if this is a custom ID (not UUID) or not in Supabase
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(localResult.id);
      if (!isUUID || !supabaseResults.find(sr => sr.id === localResult.id)) {
        mergedResults.push(localResult);
      }
    });

    // Sort by timestamp descending
    mergedResults.sort((a, b) => b.timestamp - a.timestamp);

    return mergedResults;
  } catch (error) {
    console.error('❌ Exception fetching analyses:', error);
    // Fall back to localStorage
    return getAllResults();
  }
}

/**
 * Delete an analysis from both localStorage and Supabase
 */
export async function deleteAnalysis(id: string): Promise<boolean> {
  try {
    // Remove from localStorage
    const allResults = getAllResults();
    const filtered = allResults.filter(r => r.id !== id);
    saveAllResults(filtered);

    // Remove from Supabase if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error deleting from Supabase:', error);
        return false;
      }

      console.log('✅ Analysis deleted from Supabase:', id);
    }

    return true;
  } catch (error) {
    console.error('❌ Exception deleting analysis:', error);
    return false;
  }
}
