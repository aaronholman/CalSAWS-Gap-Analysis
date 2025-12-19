const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Read the original CSV
const csvPath = path.join(__dirname, '..', 'public', 'Fields2.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
const parseResult = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true
});

// Convert headers to match database schema
const convertedData = parseResult.data.map(row => ({
  field_name: row['Field Name']?.trim() || '',
  hcfa_box: row['HCFA Box #']?.trim() || '',
  field_requirement: row['Field Requirement']?.trim() || '',
  short_description: row['Short Description']?.trim() || '',
  likely_source: row['Likely Source']?.trim() || '',
  primary_need: row['Primary Need']?.trim() || '',
  additional_note: row['Additional Note']?.trim() || '',
  phase_or_revenue_cycle: row['Phase or Revenue Cycle']?.trim() || '',
  cm_system_extract_requirement: row['CM System Extract Requirement']?.trim() || '',
  case_management_system: row['Case Management System']?.trim() || '',
  program: row['Program']?.trim() || '',
  state: row['State']?.trim() || '',
  frequency_of_data_transfer: row['Frequency of Data Transfer']?.trim() || '',
  source: 'csv',
  author: 'System Import'
})).filter(row => row.field_name); // Only include rows with field names

// Convert back to CSV with new headers
const convertedCsv = Papa.unparse(convertedData);

// Save the converted CSV
const outputPath = path.join(__dirname, '..', 'public', 'Fields2-converted.csv');
fs.writeFileSync(outputPath, convertedCsv);

console.log(`✅ Converted CSV saved to: ${outputPath}`);
console.log(`Rows converted: ${convertedData.length}`);
console.log('You can now import Fields2-converted.csv directly into Supabase!');