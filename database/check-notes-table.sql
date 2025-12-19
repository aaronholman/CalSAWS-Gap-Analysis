-- Check if assessment_notes_history table exists and its structure
-- Run this in Supabase SQL Editor to debug notes history issue

-- Check if table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'assessment_notes_history';

-- Check table structure if it exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'assessment_notes_history'
ORDER BY ordinal_position;

-- Check existing data
SELECT COUNT(*) as total_records
FROM assessment_notes_history;