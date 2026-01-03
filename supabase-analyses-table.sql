-- Create analyses table to store all user analysis results
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core analysis data
  aura_score INTEGER NOT NULL,
  aura_label TEXT NOT NULL,
  roast TEXT NOT NULL,
  personality_insight TEXT NOT NULL,
  
  -- Arrays for structured data
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  improvement_tips TEXT[] NOT NULL DEFAULT '{}',
  
  -- Shareable content
  shareable_one_liner TEXT NOT NULL,
  
  -- Vision analysis data (stored as JSONB for flexibility)
  vision_analysis JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own analyses
CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update own analyses"
  ON analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_aura_score_idx ON analyses(aura_score);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on row update
DROP TRIGGER IF EXISTS analyses_updated_at_trigger ON analyses;
CREATE TRIGGER analyses_updated_at_trigger
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_analyses_updated_at();

-- Add comment to table
COMMENT ON TABLE analyses IS 'Stores all user aura analysis results with scores, roasts, and insights';
