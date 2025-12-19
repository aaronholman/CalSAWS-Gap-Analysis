const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Read the converted CSV
const csvPath = path.join(__dirname, '..', 'public', 'Fields2-converted.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
const parseResult = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true
});

console.log(`Original rows: ${parseResult.data.length}`);

// Remove duplicates by field_name, keeping the first occurrence
const seen = new Set();
const uniqueData = parseResult.data.filter(row => {
  if (!row.field_name || !row.field_name.trim()) {
    return false; // Skip empty field names
  }

  const fieldName = row.field_name.trim();
  if (seen.has(fieldName)) {
    console.log(`Removing duplicate: ${fieldName}`);
    return false;
  }

  seen.add(fieldName);
  return true;
});

console.log(`After deduplication: ${uniqueData.length} rows`);
console.log(`Removed: ${parseResult.data.length - uniqueData.length} duplicates`);

// Convert back to CSV
const cleanCsv = Papa.unparse(uniqueData);

// Save the clean CSV
const outputPath = path.join(__dirname, '..', 'public', 'Fields2-clean.csv');
fs.writeFileSync(outputPath, cleanCsv);

console.log(`✅ Clean CSV saved to: ${outputPath}`);
console.log('You can now import Fields2-clean.csv into Supabase!');