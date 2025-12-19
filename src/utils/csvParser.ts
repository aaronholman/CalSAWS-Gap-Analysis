import Papa from 'papaparse';
import { FieldData } from '../types';

export const parseFieldsCSV = async (csvPath: string): Promise<FieldData[]> => {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();

    const result = Papa.parse<FieldData>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Clean up header names to match our interface
        return header.trim();
      }
    });

    if (result.errors.length > 0) {
      console.warn('CSV parsing errors:', result.errors);
    }

    return result.data.filter(row => row['Field Name']?.trim());
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw new Error('Failed to load field data');
  }
};

export const groupFieldsByPhase = (fields: FieldData[]) => {
  return fields.reduce((groups, field) => {
    const phase = field['Phase or Revenue Cycle']?.toLowerCase().trim() || 'other';
    if (!groups[phase]) {
      groups[phase] = [];
    }
    groups[phase].push(field);
    return groups;
  }, {} as Record<string, FieldData[]>);
};

export const filterFields = (fields: FieldData[], filters: any) => {
  return fields.filter(field => {
    // Primary Need filter
    const primaryNeeds = field['Primary Need']?.toLowerCase() || '';
    const needsMatch =
      (!filters.primaryNeed.billing || primaryNeeds.includes('billing')) &&
      (!filters.primaryNeed.serviceDelivery || primaryNeeds.includes('service delivery')) &&
      (!filters.primaryNeed.mcpReporting || primaryNeeds.includes('mcp reporting'));

    // Likely Source filter
    const source = field['Likely Source']?.toLowerCase() || '';
    const sourceMatch =
      (!filters.likelySource.intake || source.includes('intake')) &&
      (!filters.likelySource.serviceNotes || source.includes('service notes')) &&
      (!filters.likelySource.adminPanel || source.includes('admin panel')) &&
      (!filters.likelySource.rcmModule || source.includes('rcm module'));

    // Field Requirement filter
    const requirement = field['Field Requirement']?.toLowerCase() || '';
    const requirementMatch =
      (!filters.fieldRequirement.always || requirement.includes('always')) &&
      (!filters.fieldRequirement.dependent || requirement.includes('dependent')) &&
      (!filters.fieldRequirement.other || requirement.includes('other'));

    // Data Frequency filter
    const frequency = field['Frequency of Data Transfer']?.toLowerCase() || '';
    const frequencyMatch =
      (!filters.dataFrequency.periodDependent || frequency.includes('period dependent')) &&
      (!filters.dataFrequency.byPatient || frequency.includes('by patient')) &&
      (!filters.dataFrequency.byEncounter || frequency.includes('by encounter'));

    return needsMatch && sourceMatch && requirementMatch && frequencyMatch;
  });
};