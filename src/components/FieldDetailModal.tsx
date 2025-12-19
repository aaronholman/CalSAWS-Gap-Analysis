import React, { useState, useEffect } from 'react';
import { FieldData, AssessmentStatus } from '../types';
import { Assessment, NotesHistoryEntry, assessmentService } from '../lib/supabase';

interface FieldDetailModalProps {
  field: FieldData;
  isOpen: boolean;
  onClose: () => void;
  currentAssessment?: Assessment | {
    status: AssessmentStatus;
    calsaws_field?: string;
    notes?: string;
    author?: string;
  };
  onSave: (assessment: {
    status: AssessmentStatus;
    calSAWSField?: string;
    notes?: string;
    author?: string;
  }) => void;
}

const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
  field,
  isOpen,
  onClose,
  currentAssessment,
  onSave
}) => {
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>(
    currentAssessment?.status || 'not_assessed'
  );
  const [calSAWSField, setCalSAWSField] = useState(currentAssessment?.calsaws_field || '');
  const [notes, setNotes] = useState(currentAssessment?.notes || '');
  const [author, setAuthor] = useState(currentAssessment?.author || '');
  const [showNotesHistory, setShowNotesHistory] = useState(false);
  const [notesHistory, setNotesHistory] = useState<NotesHistoryEntry[]>([]);

  // Load notes history when modal opens
  useEffect(() => {
    const loadNotesHistory = async () => {
      if (field && isOpen) {
        try {
          const history = await assessmentService.loadNotesHistory(field['Field Name']);
          setNotesHistory(history);
        } catch (error) {
          console.error('Error loading notes history:', error);
          setNotesHistory([]);
        }
      }
    };

    loadNotesHistory();
  }, [field, isOpen]);

  // Update state when currentAssessment changes
  useEffect(() => {
    setAssessmentStatus(currentAssessment?.status || 'not_assessed');
    setCalSAWSField(currentAssessment?.calsaws_field || '');
    setNotes(currentAssessment?.notes || '');
    setAuthor(currentAssessment?.author || '');
    setShowNotesHistory(false);
  }, [currentAssessment]);

  const handleSave = async () => {
    if (!author.trim()) {
      alert('Please enter your name in the Author field');
      return;
    }

    // Save note to history if there are notes
    if (notes.trim()) {
      try {
        await assessmentService.saveNoteToHistory(
          field['Field Name'],
          author.trim(),
          notes.trim(),
          assessmentStatus
        );
        // Reload notes history
        const history = await assessmentService.loadNotesHistory(field['Field Name']);
        setNotesHistory(history);
      } catch (error) {
        console.error('Error saving note to history:', error);
      }
    }

    onSave({
      status: assessmentStatus,
      calSAWSField: assessmentStatus === 'currently_captured' ? calSAWSField : undefined,
      notes: notes,
      author: author.trim()
    });
    onClose();
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--color-primary-white)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--spacing-xl)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-lg">
          <h3 style={{ margin: 0 }}>{field['Field Name']}</h3>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            ✕
          </button>
        </div>

        {/* Field Details */}
        <div className="mb-lg">
          <div className="row mb-md">
            <div className="col">
              <strong>HCFA Box #:</strong> {field['HCFA Box #'] || 'N/A'}
            </div>
            <div className="col">
              <strong>Field Requirement:</strong> {field['Field Requirement']}
            </div>
          </div>

          <div className="mb-md">
            <strong>Short Description:</strong>
            <div className="mt-sm">{field['Short Description']}</div>
          </div>

          <div className="row mb-md">
            <div className="col">
              <strong>Likely Source:</strong> {field['Likely Source']}
            </div>
            <div className="col">
              <strong>Primary Need:</strong> {field['Primary Need']}
            </div>
          </div>

          <div className="row mb-md">
            <div className="col">
              <strong>Data Frequency:</strong> {field['Frequency of Data Transfer'] || 'Not specified'}
            </div>
          </div>

          {field['Additional Note'] && (
            <div className="mb-md">
              <strong>Implementation Notes:</strong>
              <div className="mt-sm" style={{
                backgroundColor: '#F8F9FA',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {field['Additional Note']}
              </div>
            </div>
          )}
        </div>

        {/* Assessment Panel */}
        <div style={{
          border: '1px solid #DEE2E6',
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--spacing-lg)'
        }}>
          <h4 className="mb-md">Assessment Status for CalSAWS</h4>

          {/* Currently Captured Option */}
          <div className="mb-md">
            <label className="d-flex align-items-center gap-sm" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="assessment"
                value="currently_captured"
                checked={assessmentStatus === 'currently_captured'}
                onChange={(e) => setAssessmentStatus(e.target.value as AssessmentStatus)}
              />
              <span>Currently Captured</span>
            </label>

            {assessmentStatus === 'currently_captured' && (
              <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                <div className="form-group">
                  <label className="form-label">CalSAWS Field:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={calSAWSField}
                    onChange={(e) => setCalSAWSField(e.target.value)}
                    placeholder="Enter existing CalSAWS field name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes:</label>
                  <textarea
                    className="form-input form-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes about this mapping"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Needs to be Added Option */}
          <div className="mb-md">
            <label className="d-flex align-items-center gap-sm" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="assessment"
                value="needs_addition"
                checked={assessmentStatus === 'needs_addition'}
                onChange={(e) => setAssessmentStatus(e.target.value as AssessmentStatus)}
              />
              <span>Needs to be Added</span>
            </label>

            {assessmentStatus === 'needs_addition' && (
              <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                <div className="form-group">
                  <label className="form-label">Notes:</label>
                  <textarea
                    className="form-input form-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Implementation details, priority, effort estimates, etc."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Edit Requested Option */}
          <div className="mb-md">
            <label className="d-flex align-items-center gap-sm" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="assessment"
                value="edit_requested"
                checked={assessmentStatus === 'edit_requested'}
                onChange={(e) => setAssessmentStatus(e.target.value as AssessmentStatus)}
              />
              <span>Edit to this field requested</span>
            </label>

            {assessmentStatus === 'edit_requested' && (
              <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                <div className="form-group">
                  <label className="form-label">Notes:</label>
                  <textarea
                    className="form-input form-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What changes are requested? Who requested them?"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Investigation Required Option */}
          <div className="mb-md">
            <label className="d-flex align-items-center gap-sm" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="assessment"
                value="investigation"
                checked={assessmentStatus === 'investigation'}
                onChange={(e) => setAssessmentStatus(e.target.value as AssessmentStatus)}
              />
              <span>Unknown - Requires Investigation</span>
            </label>

            {assessmentStatus === 'investigation' && (
              <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                <div className="form-group">
                  <label className="form-label">Notes:</label>
                  <textarea
                    className="form-input form-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What needs to be investigated? Who should review this?"
                  />
                </div>
              </div>
            )}
          </div>

          {/* View Notes Toggle */}
          <div className="form-group mb-md">
            <label className="d-flex align-items-center gap-sm" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showNotesHistory}
                onChange={(e) => setShowNotesHistory(e.target.checked)}
              />
              <span className="form-label" style={{ margin: 0 }}>View Notes History ({notesHistory.length})</span>
            </label>

            {showNotesHistory && (
                <div style={{
                  marginTop: 'var(--spacing-md)',
                  border: '1px solid #DEE2E6',
                  borderRadius: 'var(--border-radius-sm)',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}>
                    <thead style={{ backgroundColor: '#F8F9FA', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{
                          padding: 'var(--spacing-sm)',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '1px solid #DEE2E6',
                          width: '20%'
                        }}>
                          Name
                        </th>
                        <th style={{
                          padding: 'var(--spacing-sm)',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '1px solid #DEE2E6',
                          width: '20%'
                        }}>
                          Date
                        </th>
                        <th style={{
                          padding: 'var(--spacing-sm)',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '1px solid #DEE2E6',
                          width: '60%'
                        }}>
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {notesHistory.length === 0 ? (
                        <tr>
                          <td colSpan={3} style={{
                            padding: 'var(--spacing-md)',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            color: '#6c757d'
                          }}>
                            No notes history yet. Add a comment above to start tracking notes.
                          </td>
                        </tr>
                      ) : (
                        notesHistory.map((note) => (
                        <tr key={note.id}>
                          <td style={{
                            padding: 'var(--spacing-sm)',
                            borderBottom: '1px solid #F8F9FA',
                            verticalAlign: 'top'
                          }}>
                            {note.author}
                          </td>
                          <td style={{
                            padding: 'var(--spacing-sm)',
                            borderBottom: '1px solid #F8F9FA',
                            verticalAlign: 'top',
                            whiteSpace: 'nowrap'
                          }}>
                            {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{
                            padding: 'var(--spacing-sm)',
                            borderBottom: '1px solid #F8F9FA',
                            verticalAlign: 'top',
                            wordBreak: 'break-word'
                          }}>
                            {note.notes}
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          {/* Author Input */}
          <div className="form-group mb-md">
            <label className="form-label">Author *</label>
            <input
              type="text"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name"
              style={{
                borderColor: !author.trim() ? '#dc3545' : '#DEE2E6'
              }}
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Required to track who made this assessment
            </small>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-md justify-content-end">
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save and Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FieldDetailModal;