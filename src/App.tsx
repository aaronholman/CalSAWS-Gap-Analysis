import React, { useState, useEffect } from 'react';
import { FieldData, AssessmentStatus, FilterState, ProgressStats } from './types';
import { parseFieldsCSV, groupFieldsByPhase, filterFields } from './utils/csvParser';
import { assessmentService, Assessment } from './lib/supabase';
import FilterPanel from './components/FilterPanel';
import ProgressTracker from './components/ProgressTracker';
import RevenueColumn from './components/RevenueColumn';
import FieldDetailModal from './components/FieldDetailModal';
import AlignmentModal from './components/AlignmentModal';
import AddFieldModal from './components/AddFieldModal';
import Footer from './components/Footer';
import './styles/index.css';

const App: React.FC = () => {
  const [fields, setFields] = useState<FieldData[]>([]);
  const [filteredFields, setFilteredFields] = useState<FieldData[]>([]);
  const [groupedFields, setGroupedFields] = useState<Record<string, FieldData[]>>({});
  const [assessments, setAssessments] = useState<Record<string, AssessmentStatus>>({});
  const [assessmentDetails, setAssessmentDetails] = useState<Record<string, Assessment>>({});
  const [filters, setFilters] = useState<FilterState>({
    primaryNeed: { billing: false, serviceDelivery: false, mcpReporting: false },
    likelySource: { intake: false, serviceNotes: false, adminPanel: false, rcmModule: false },
    fieldRequirement: { always: false, dependent: false, other: false },
    dataFrequency: { periodDependent: false, byPatient: false, byEncounter: false }
  });
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlignmentModalOpen, setIsAlignmentModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<'front' | 'middle' | 'back'>('front');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV data and assessments on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load CSV data
        const fieldsData = await parseFieldsCSV('/Fields2.csv');
        setFields(fieldsData);
        setFilteredFields(fieldsData);
        setGroupedFields(groupFieldsByPhase(fieldsData));

        // Load assessments from Supabase
        try {
          const assessmentData = await assessmentService.loadAssessments();
          const assessmentMap: Record<string, AssessmentStatus> = {};
          const assessmentDetailMap: Record<string, Assessment> = {};

          assessmentData.forEach((assessment: Assessment) => {
            assessmentMap[assessment.field_name] = assessment.status;
            assessmentDetailMap[assessment.field_name] = assessment;
          });

          setAssessments(assessmentMap);
          setAssessmentDetails(assessmentDetailMap);
        } catch (assessmentError) {
          console.warn('Could not load assessments from database:', assessmentError);
          // Continue without assessments - they can be created later
        }

      } catch (err) {
        setError('Failed to load field data. Please check that Fields2.csv is available.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters when filters or fields change
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(category =>
      Object.values(category).some(value => value)
    );

    if (!hasActiveFilters) {
      setFilteredFields(fields);
      setGroupedFields(groupFieldsByPhase(fields));
    } else {
      const filtered = filterFields(fields, filters);
      setFilteredFields(filtered);
      setGroupedFields(groupFieldsByPhase(filtered));
    }
  }, [fields, filters]);

  // Calculate progress statistics
  const progressStats: ProgressStats = React.useMemo(() => {
    const total = fields.length;
    const assessmentValues = Object.values(assessments);
    const currentlyCaptured = assessmentValues.filter(status => status === 'currently_captured').length;
    const needsAddition = assessmentValues.filter(status => status === 'needs_addition').length;
    const editRequested = assessmentValues.filter(status => status === 'edit_requested').length;
    const underInvestigation = assessmentValues.filter(status => status === 'investigation').length;
    const assessed = currentlyCaptured + needsAddition + editRequested + underInvestigation;
    const notAssessed = total - assessed;

    // Calculate phase-specific statistics
    const calculatePhaseStats = (phaseFields: FieldData[]) => {
      const phaseFieldNames = phaseFields.map(f => f['Field Name']);
      const phaseAssessments = phaseFieldNames.map(name => assessments[name] || 'not_assessed');

      return {
        total: phaseFields.length,
        currentlyCaptured: phaseAssessments.filter(status => status === 'currently_captured').length,
        needsAddition: phaseAssessments.filter(status => status === 'needs_addition').length,
        editRequested: phaseAssessments.filter(status => status === 'edit_requested').length,
        underInvestigation: phaseAssessments.filter(status => status === 'investigation').length,
        notAssessed: phaseAssessments.filter(status => status === 'not_assessed').length
      };
    };

    const frontFields = fields.filter(f => f['Phase or Revenue Cycle']?.toLowerCase().trim() === 'front');
    const middleFields = fields.filter(f => f['Phase or Revenue Cycle']?.toLowerCase().trim() === 'middle');
    const backFields = fields.filter(f => f['Phase or Revenue Cycle']?.toLowerCase().trim() === 'back');

    return {
      total,
      assessed,
      currentlyCaptured,
      needsAddition,
      editRequested,
      underInvestigation,
      notAssessed,
      byPhase: {
        front: calculatePhaseStats(frontFields),
        middle: calculatePhaseStats(middleFields),
        back: calculatePhaseStats(backFields)
      }
    };
  }, [fields, assessments]);

  const handleFieldClick = (field: FieldData) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  const handleAlignmentClick = (phase: 'front' | 'middle' | 'back') => {
    setSelectedPhase(phase);
    setIsAlignmentModalOpen(true);
  };

  const handleAssessmentSave = async (assessment: {
    status: AssessmentStatus;
    calSAWSField?: string;
    notes?: string;
    author?: string;
  }) => {
    if (selectedField) {
      try {
        // Save to Supabase
        const savedAssessment = await assessmentService.saveAssessment({
          field_name: selectedField['Field Name'],
          status: assessment.status,
          calsaws_field: assessment.calSAWSField,
          notes: assessment.notes,
          author: assessment.author
        });

        // Update local state
        setAssessments(prev => ({
          ...prev,
          [selectedField['Field Name']]: assessment.status
        }));

        setAssessmentDetails(prev => ({
          ...prev,
          [selectedField['Field Name']]: savedAssessment
        }));

      } catch (error) {
        console.error('Failed to save assessment:', error);
        // Still update local state as fallback
        setAssessments(prev => ({
          ...prev,
          [selectedField['Field Name']]: assessment.status
        }));
      }
    }
  };

  const handleAddField = async (fieldData: any) => {
    try {
      // Create new field object matching FieldData structure
      const newField: FieldData = {
        'Field Name': fieldData.elementName,
        'HCFA Box #': fieldData.hcfaBox,
        'Field Requirement': fieldData.fieldRequirement,
        'Short Description': fieldData.shortDescription,
        'Likely Source': fieldData.likelySource,
        'Primary Need': fieldData.primaryNeed.join(', '),
        'Additional Note': fieldData.implementationNotes,
        'Phase or Revenue Cycle': fieldData.phase,
        'CM System Extract Requirement': '',
        'Case Management System': '',
        'Program': '',
        'State': '',
        'Frequency of Data Transfer': fieldData.dataFrequency
      };

      // Add to local state
      const updatedFields = [...fields, newField];
      setFields(updatedFields);
      setFilteredFields(updatedFields);
      setGroupedFields(groupFieldsByPhase(updatedFields));

      // Save assessment if provided
      if (fieldData.assessmentStatus !== 'not_assessed') {
        await assessmentService.saveAssessment({
          field_name: fieldData.elementName,
          status: fieldData.assessmentStatus,
          calsaws_field: fieldData.calSAWSField,
          notes: fieldData.assessmentNotes,
          author: fieldData.author
        });

        // Update local assessment state
        setAssessments(prev => ({
          ...prev,
          [fieldData.elementName]: fieldData.assessmentStatus
        }));
      }

    } catch (error) {
      console.error('Failed to add field:', error);
      alert('Failed to add field. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Loading CalSAWS Gap Analysis Tool...</h2>
        <div style={{ marginTop: '2rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E9ECEF',
            borderTop: '4px solid var(--color-accent-orange)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2 style={{ color: 'var(--color-needs-addition)' }}>Error Loading Data</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // Get counts for each phase
  const frontFields = groupedFields['front'] || [];
  const middleFields = groupedFields['middle'] || [];
  const backFields = groupedFields['back'] || [];

  const totalFrontFields = fields.filter(f => f['Phase or Revenue Cycle']?.toLowerCase().trim() === 'front').length;
  const totalMiddleFields = fields.filter(f => f['Phase or Revenue Cycle']?.toLowerCase().trim() === 'middle').length;
  const totalBackFields = fields.filter(f => f['Phase or Revenue Cycle']?.toLowerCase().trim() === 'back').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#F8F9FA',
        borderBottom: '1px solid #E9ECEF',
        padding: 'var(--spacing-lg) 0'
      }}>
        <div className="container">
          <h1 style={{
            textAlign: 'center',
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 700
          }}>
            CalSAWS and ECM / CS Integration Overview
          </h1>
          <p style={{
            textAlign: 'center',
            margin: 'var(--spacing-sm) 0 0 0',
            color: 'var(--color-not-assessed)',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            This tool has been designed to present the necessary data elements for ECM and CS service delivery and billing. Data elements have been organized across three primary "phases" of a programs revenue cycle: the Front end, or an area commonly referred to as 'patient access' or 'patient registration', the middle, or the phase where services are actually delivered to a patient or client, and the back where data is assembled, transformed, and ultimately submitted to payers (in this case Medicaid Managed Care Plans) for payment and management in the event that a claim is rejected or denied.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--spacing-xl) 0' }}>
        <div className="container">
          {/* Two-Column Layout: Filters and Progress */}
          <div className="row mb-xl">
            <div className="col" style={{ flex: '0 0 40%', maxWidth: '40%' }}>
              {/* Filter Panel */}
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            </div>
            <div className="col" style={{ flex: '0 0 60%', maxWidth: '60%' }}>
              {/* Progress Tracker */}
              <ProgressTracker stats={progressStats} />
            </div>
          </div>

          {/* Three-Column Layout */}
          <div className="row">
            <RevenueColumn
              title="Front"
              phase="front"
              fields={frontFields}
              assessments={assessments}
              onFieldClick={handleFieldClick}
              onAlignmentClick={handleAlignmentClick}
              totalCount={totalFrontFields}
              visibleCount={frontFields.length}
            />

            <RevenueColumn
              title="Middle"
              phase="middle"
              fields={middleFields}
              assessments={assessments}
              onFieldClick={handleFieldClick}
              onAlignmentClick={handleAlignmentClick}
              totalCount={totalMiddleFields}
              visibleCount={middleFields.length}
            />

            <RevenueColumn
              title="Back"
              phase="back"
              fields={backFields}
              assessments={assessments}
              onFieldClick={handleFieldClick}
              onAlignmentClick={handleAlignmentClick}
              totalCount={totalBackFields}
              visibleCount={backFields.length}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add Field Button */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 999
      }}>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddFieldModalOpen(true)}
          style={{
            borderRadius: '50px',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          + Add Field
        </button>
      </div>

      {/* Field Detail Modal */}
      {selectedField && (
        <FieldDetailModal
          field={selectedField}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedField(null);
          }}
          currentAssessment={
            assessmentDetails[selectedField['Field Name']] || {
              status: assessments[selectedField['Field Name']] || 'not_assessed'
            }
          }
          onSave={handleAssessmentSave}
        />
      )}

      {/* Alignment Modal */}
      <AlignmentModal
        isOpen={isAlignmentModalOpen}
        onClose={() => setIsAlignmentModalOpen(false)}
        phase={selectedPhase}
      />

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onSave={handleAddField}
      />

      {/* Loading Animation Keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default App;