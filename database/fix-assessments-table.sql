-- Fix assessments table to add missing author column
-- Run this in Supabase SQL Editor

-- Add author column if it doesn't exist
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS author VARCHAR(255);

-- Check current structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'assessments'
ORDER BY ordinal_position;