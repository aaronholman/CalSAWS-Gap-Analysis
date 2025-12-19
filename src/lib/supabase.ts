import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Assessment {
  id?: string;
  field_name: string;
  status: 'not_assessed' | 'currently_captured' | 'needs_addition' | 'edit_requested' | 'investigation';
  calsaws_field?: string;
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
  assigned_to?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Field {
  id?: string;
  field_name: string;
  hcfa_box?: string;
  field_requirement?: string;
  short_description?: string;
  likely_source?: string;
  primary_need?: string;
  additional_note?: string;
  phase_or_revenue_cycle?: string;
  cm_system_extract_requirement?: string;
  case_management_system?: string;
  program?: string;
  state?: string;
  frequency_of_data_transfer?: string;
  source?: 'csv' | 'user_added';
  author: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotesHistoryEntry {
  id?: string;
  field_name: string;
  author: string;
  notes: string;
  assessment_status: string;
  created_at?: string;
}

// Assessment service functions
export const assessmentService = {
  // Load all assessments
  async loadAssessments() {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading assessments:', error);
      throw error;
    }

    return data || [];
  },

  // Save or update assessment
  async saveAssessment(assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>) {
    // Check if assessment already exists
    const { data: existing } = await supabase
      .from('assessments')
      .select('id')
      .eq('field_name', assessment.field_name)
      .single();

    if (existing) {
      // Update existing assessment
      const { data, error } = await supabase
        .from('assessments')
        .update({
          ...assessment,
          updated_at: new Date().toISOString()
        })
        .eq('field_name', assessment.field_name)
        .select()
        .single();

      if (error) {
        console.error('Error updating assessment:', error);
        throw error;
      }

      // Save note to history if notes exist (after assessment is saved)
      if (data && assessment.notes && assessment.author) {
        await this.saveNoteToHistory(
          assessment.field_name,
          assessment.author,
          assessment.notes,
          assessment.status
        );
      }

      return data;
    } else {
      // Create new assessment
      const { data, error } = await supabase
        .from('assessments')
        .insert([{
          ...assessment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment:', error);
        throw error;
      }

      // Save note to history if notes exist (after assessment is saved)
      if (data && assessment.notes && assessment.author) {
        await this.saveNoteToHistory(
          assessment.field_name,
          assessment.author,
          assessment.notes,
          assessment.status
        );
      }

      return data;
    }
  },

  // Delete assessment
  async deleteAssessment(fieldName: string) {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('field_name', fieldName);

    if (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  // Get assessment by field name
  async getAssessment(fieldName: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('field_name', fieldName)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting assessment:', error);
      throw error;
    }

    return data;
  },

  // Export assessments as CSV
  async exportAssessments() {
    const assessments = await this.loadAssessments();

    const csvContent = [
      ['Field Name', 'Status', 'CalSAWS Field', 'Notes', 'Priority', 'Assigned To', 'Last Updated'],
      ...assessments.map((assessment: Assessment) => [
        assessment.field_name,
        assessment.status,
        assessment.calsaws_field || '',
        assessment.notes || '',
        assessment.priority || '',
        assessment.assigned_to || '',
        assessment.updated_at || ''
      ])
    ].map(row => row.map((cell: string) => `"${cell}"`).join(',')).join('\n');

    return csvContent;
  },

  // Load notes history for a specific field
  async loadNotesHistory(fieldName: string) {
    const { data, error } = await supabase
      .from('assessment_notes_history')
      .select('*')
      .eq('field_name', fieldName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading notes history:', error);
      throw error;
    }

    return data || [];
  },

  // Save a note to history when assessment is saved
  async saveNoteToHistory(fieldName: string, author: string, notes: string, status: string) {
    if (!notes.trim()) return; // Don't save empty notes

    try {
      const { data, error } = await supabase
        .from('assessment_notes_history')
        .insert([{
          field_name: fieldName,
          author: author.trim(),
          notes: notes.trim(),
          assessment_status: status,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving note to history:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error saving note to history:', err);
      return null;
    }
  }
};

// Field service for managing user-added fields
export const fieldService = {
  // Load all fields from Supabase
  async loadFields(): Promise<Field[]> {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading fields:', error);
      throw error;
    }

    return data || [];
  },

  // Save a new field to Supabase
  async saveField(field: Omit<Field, 'id' | 'created_at' | 'updated_at'>): Promise<Field> {
    const { data, error } = await supabase
      .from('fields')
      .insert([{
        ...field,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving field:', error);
      throw error;
    }

    return data;
  },

  // Update an existing field
  async updateField(fieldName: string, updates: Partial<Field>): Promise<Field> {
    const { data, error } = await supabase
      .from('fields')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('field_name', fieldName)
      .select()
      .single();

    if (error) {
      console.error('Error updating field:', error);
      throw error;
    }

    return data;
  },

  // Delete a field
  async deleteField(fieldName: string) {
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('field_name', fieldName);

    if (error) {
      console.error('Error deleting field:', error);
      throw error;
    }
  },

  // Get field by name
  async getField(fieldName: string): Promise<Field | null> {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('field_name', fieldName)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting field:', error);
      throw error;
    }

    return data;
  }
};