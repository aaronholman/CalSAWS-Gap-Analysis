const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables.');
  console.error('Required: REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or REACT_APP_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importCSVToSupabase() {
  try {
    console.log('Starting CSV import to Supabase...');

    // Read CSV file
    const csvPath = path.join(__dirname, '..', 'public', 'Fields2.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Parse CSV
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors);
    }

    const csvData = parseResult.data.filter(row => row['Field Name']?.trim());
    console.log(`Found ${csvData.length} fields in CSV`);

    // Transform CSV data to match database schema
    const fieldsToInsert = csvData.map(row => ({
      field_name: row['Field Name']?.trim(),
      hcfa_box: row['HCFA Box #']?.trim() || null,
      field_requirement: row['Field Requirement']?.trim() || null,
      short_description: row['Short Description']?.trim() || null,
      likely_source: row['Likely Source']?.trim() || null,
      primary_need: row['Primary Need']?.trim() || null,
      additional_note: row['Additional Note']?.trim() || null,
      phase_or_revenue_cycle: row['Phase or Revenue Cycle']?.trim() || null,
      cm_system_extract_requirement: row['CM System Extract Requirement']?.trim() || null,
      case_management_system: row['Case Management System']?.trim() || null,
      program: row['Program']?.trim() || null,
      state: row['State']?.trim() || null,
      frequency_of_data_transfer: row['Frequency of Data Transfer']?.trim() || null,
      source: 'csv',
      author: 'System Import'
    })).filter(field => field.field_name); // Only include rows with field names

    console.log(`Prepared ${fieldsToInsert.length} fields for import`);

    // Clear existing CSV fields first
    console.log('Clearing existing CSV fields...');
    const { error: deleteError } = await supabase
      .from('fields')
      .delete()
      .eq('source', 'csv');

    if (deleteError) {
      console.warn('Warning: Could not clear existing CSV fields:', deleteError.message);
    }

    // Insert new fields in batches (Supabase has a limit)
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < fieldsToInsert.length; i += batchSize) {
      const batch = fieldsToInsert.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(fieldsToInsert.length/batchSize)} (${batch.length} records)...`);

      const { data, error } = await supabase
        .from('fields')
        .insert(batch)
        .select('field_name');

      if (error) {
        console.error('Error inserting batch:', error);
        // Continue with other batches
      } else {
        totalInserted += data.length;
        console.log(`Successfully inserted ${data.length} records`);
      }
    }

    console.log(`\n✅ Import completed!`);
    console.log(`Total fields imported: ${totalInserted}`);
    console.log(`\nNext steps:`);
    console.log(`1. Verify the import in your Supabase dashboard`);
    console.log(`2. The app will now load all fields from Supabase instead of CSV`);
    console.log(`3. You can now add, edit, or delete fields through the database`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importCSVToSupabase();