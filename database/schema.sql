-- CalSAWS Gap Analysis Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('not_assessed', 'currently_captured', 'needs_addition', 'edit_requested', 'investigation')),
  calsaws_field VARCHAR(255),
  notes TEXT,
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  assigned_to VARCHAR(255),
  author VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on field_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessments_field_name ON assessments(field_name);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
-- For development/demo purposes, allowing all access
CREATE POLICY "Allow all operations on assessments" ON assessments
  FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for assessment statistics
CREATE OR REPLACE VIEW assessment_stats AS
SELECT
  COUNT(*) as total_fields,
  COUNT(CASE WHEN status = 'currently_captured' THEN 1 END) as currently_captured,
  COUNT(CASE WHEN status = 'needs_addition' THEN 1 END) as needs_addition,
  COUNT(CASE WHEN status = 'edit_requested' THEN 1 END) as edit_requested,
  COUNT(CASE WHEN status = 'investigation' THEN 1 END) as under_investigation,
  COUNT(CASE WHEN status = 'not_assessed' THEN 1 END) as not_assessed,
  COUNT(CASE WHEN status != 'not_assessed' THEN 1 END) as assessed,
  ROUND(
    COUNT(CASE WHEN status != 'not_assessed' THEN 1 END)::DECIMAL /
    COUNT(*)::DECIMAL * 100,
    1
  ) as completion_percentage
FROM assessments;

-- Create view for assessments with metadata
CREATE OR REPLACE VIEW assessment_details AS
SELECT
  a.*,
  CASE
    WHEN a.status = 'currently_captured' THEN 'Captured'
    WHEN a.status = 'needs_addition' THEN 'Needs Addition'
    WHEN a.status = 'edit_requested' THEN 'Edit Requested'
    WHEN a.status = 'investigation' THEN 'Under Investigation'
    ELSE 'Not Assessed'
  END as status_display,
  EXTRACT(DAYS FROM NOW() - a.updated_at) as days_since_update
FROM assessments a;

-- Add author column to existing table (migration)
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS author VARCHAR(255);

-- Create assessment_notes_history table for tracking notes over time
CREATE TABLE IF NOT EXISTS assessment_notes_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  notes TEXT NOT NULL,
  assessment_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (field_name) REFERENCES assessments(field_name) ON DELETE CASCADE
);

-- Create index for faster lookups by field name and date
CREATE INDEX IF NOT EXISTS idx_notes_history_field_name ON assessment_notes_history(field_name);
CREATE INDEX IF NOT EXISTS idx_notes_history_created_at ON assessment_notes_history(created_at DESC);

-- Insert sample data (optional - remove if not needed)
-- This can help test the integration
INSERT INTO assessments (field_name, status, notes, author) VALUES
  ('Patient''s Name', 'currently_captured', 'Already captured in CalSAWS patient registration', 'System'),
  ('Insurance Type', 'needs_addition', 'Need to add dropdown for insurance type selection', 'System'),
  ('Prior Authorization Number', 'investigation', 'Need to verify if this field exists in current workflow', 'System')
ON CONFLICT (field_name) DO NOTHING;