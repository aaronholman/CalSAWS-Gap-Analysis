-- Add fields table for Supabase-only architecture
-- Run this if you only need to add the fields table to existing database

-- Create fields table for storing all field data (CSV imports + user additions)
CREATE TABLE IF NOT EXISTS fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name VARCHAR(255) NOT NULL UNIQUE,
  hcfa_box VARCHAR(50),
  field_requirement VARCHAR(100),
  short_description TEXT,
  likely_source VARCHAR(255),
  primary_need TEXT,
  additional_note TEXT,
  phase_or_revenue_cycle VARCHAR(50),
  cm_system_extract_requirement VARCHAR(255),
  case_management_system VARCHAR(255),
  program VARCHAR(255),
  state VARCHAR(255),
  frequency_of_data_transfer VARCHAR(255),
  source VARCHAR(20) DEFAULT 'user_added' CHECK (source IN ('csv', 'user_added')),
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_field_name ON fields(field_name);
CREATE INDEX IF NOT EXISTS idx_fields_source ON fields(source);
CREATE INDEX IF NOT EXISTS idx_fields_phase ON fields(phase_or_revenue_cycle);

-- Enable Row Level Security
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;

-- Create policy for fields table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'fields'
    AND policyname = 'Allow all operations on fields'
  ) THEN
    CREATE POLICY "Allow all operations on fields" ON fields
      FOR ALL USING (true);
  END IF;
END $$;

-- Create trigger for automatic timestamp updates
-- First ensure the update function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to fields table
DROP TRIGGER IF EXISTS update_fields_updated_at ON fields;
CREATE TRIGGER update_fields_updated_at
  BEFORE UPDATE ON fields
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();