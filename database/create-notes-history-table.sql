-- Create assessment_notes_history table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Create assessment_notes_history table for tracking notes over time
CREATE TABLE IF NOT EXISTS assessment_notes_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  notes TEXT NOT NULL,
  assessment_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by field name and date
CREATE INDEX IF NOT EXISTS idx_notes_history_field_name ON assessment_notes_history(field_name);
CREATE INDEX IF NOT EXISTS idx_notes_history_created_at ON assessment_notes_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE assessment_notes_history ENABLE ROW LEVEL SECURITY;

-- Create policy for notes history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'assessment_notes_history'
    AND policyname = 'Allow all operations on notes history'
  ) THEN
    CREATE POLICY "Allow all operations on notes history" ON assessment_notes_history
      FOR ALL USING (true);
  END IF;
END $$;