import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface AuraResultRecord {
  id: string;
  aura_score: number;
  aura_label: string;
  roast: string;
  personality_insight: string;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
  shareable_one_liner: string;
  created_at: string;
}

/**
 * Save aura result to database and return unique ID
 */
export async function saveAuraResult(result: Omit<AuraResultRecord, 'id' | 'created_at'>): Promise<string> {
  const { data, error } = await supabase
    .from('aura_results')
    .insert([result])
    .select('id')
    .single();

  if (error) {
    console.error('Error saving aura result:', error);
    throw new Error('Failed to save result');
  }

  return data.id;
}

/**
 * Get aura result by ID
 */
export async function getAuraResult(id: string): Promise<AuraResultRecord | null> {
  const { data, error } = await supabase
    .from('aura_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching aura result:', error);
    return null;
  }

  return data;
}

/**
 * Generate shareable URL for a result
 */
export function getShareableUrl(resultId: string): string {
  return `${window.location.origin}/result/${resultId}`;
}
