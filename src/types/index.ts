export interface FieldData {
  'Field Name': string;
  'Additional Note': string;
  'CM System Extract Requirement': string;
  'Case Management System': string;
  'Field Requirement': string;
  'HCFA Box #': string;
  'Likely Source': string;
  'Phase or Revenue Cycle': string;
  'Primary Need': string;
  'Program': string;
  'Short Description': string;
  'State': string;
  'Frequency of Data Transfer': string;
}

export type AssessmentStatus = 'not_assessed' | 'currently_captured' | 'needs_addition' | 'edit_requested' | 'investigation';

export interface FieldAssessment {
  fieldName: string;
  status: AssessmentStatus;
  calSAWSField?: string;
  notes?: string;
  lastUpdated: Date;
}

export interface FilterState {
  primaryNeed: {
    billing: boolean;
    serviceDelivery: boolean;
    mcpReporting: boolean;
  };
  likelySource: {
    intake: boolean;
    serviceNotes: boolean;
    adminPanel: boolean;
    rcmModule: boolean;
  };
  fieldRequirement: {
    always: boolean;
    dependent: boolean;
    other: boolean;
  };
  dataFrequency: {
    periodDependent: boolean;
    byPatient: boolean;
    byEncounter: boolean;
  };
}

export interface ProgressStats {
  total: number;
  assessed: number;
  currentlyCaptured: number;
  needsAddition: number;
  editRequested: number;
  underInvestigation: number;
  notAssessed: number;
  byPhase: {
    front: PhaseStats;
    middle: PhaseStats;
    back: PhaseStats;
  };
}

export interface PhaseStats {
  total: number;
  currentlyCaptured: number;
  needsAddition: number;
  editRequested: number;
  underInvestigation: number;
  notAssessed: number;
}