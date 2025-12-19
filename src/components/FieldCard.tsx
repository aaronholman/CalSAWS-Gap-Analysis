import React from 'react';
import { FieldData, AssessmentStatus } from '../types';

interface FieldCardProps {
  field: FieldData;
  assessmentStatus: AssessmentStatus;
  onClick: () => void;
}

const getStatusIndicator = (status: AssessmentStatus) => {
  switch (status) {
    case 'currently_captured':
      return (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-captured)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
          title="Currently Captured"
        />
      );
    case 'needs_addition':
      return (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-needs-addition)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
          title="Needs Addition"
        />
      );
    case 'edit_requested':
      return (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-edit-requested)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
          title="Edit Requested"
        />
      );
    case 'investigation':
      return (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-investigation)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
          title="Under Investigation"
        />
      );
    default:
      return null;
  }
};

const FieldCard: React.FC<FieldCardProps> = ({ field, assessmentStatus, onClick }) => {
  const fieldName = field['Field Name'];

  return (
    <div
      className="card mb-sm"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: 'var(--spacing-sm)',
        position: 'relative'
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open details for ${fieldName}`}
    >
      {/* Status indicator in top right corner */}
      {assessmentStatus !== 'not_assessed' && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 1
        }}>
          {getStatusIndicator(assessmentStatus)}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-sm)', paddingRight: '20px' }}>
        <h5 style={{
          margin: 0,
          fontSize: '14px',
          fontWeight: 500
        }}>
          {fieldName}
        </h5>
      </div>
    </div>
  );
};

export default FieldCard;