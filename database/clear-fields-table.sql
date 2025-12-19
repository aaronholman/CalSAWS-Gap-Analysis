-- Clear all data from fields table before importing fresh CSV data
-- Run this in Supabase SQL Editor before importing the CSV

DELETE FROM fields;

-- Reset the auto-increment ID sequence (optional)
-- This ensures new imports start with clean IDs
SELECT setval(pg_get_serial_sequence('fields', 'id'), 1, false);