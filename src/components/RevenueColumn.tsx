import React from 'react';
import { FieldData, AssessmentStatus } from '../types';
import FieldCard from './FieldCard';

interface RevenueColumnProps {
  title: string;
  phase: 'front' | 'middle' | 'back';
  fields: FieldData[];
  assessments: Record<string, AssessmentStatus>;
  onFieldClick: (field: FieldData) => void;
  onAlignmentClick: (phase: 'front' | 'middle' | 'back') => void;
  totalCount: number;
  visibleCount: number;
}

const RevenueColumn: React.FC<RevenueColumnProps> = ({
  title,
  phase,
  fields,
  assessments,
  onFieldClick,
  onAlignmentClick,
  totalCount,
  visibleCount
}) => {
  return (
    <div className="col col-3">
      <div style={{
        backgroundColor: '#F8F9FA',
        border: '1px solid #E9ECEF',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-lg)',
        minHeight: '600px'
      }}>
        {/* Column Header */}
        <div className="text-center mb-lg">
          <h2 style={{
            fontSize: 'var(--font-size-header)',
            fontWeight: 700,
            color: 'var(--color-primary-black)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            {title}
          </h2>
          <div className="text-small text-muted">
            {visibleCount} of {totalCount} fields
          </div>
          <div style={{ marginTop: 'var(--spacing-sm)' }}>
            <button
              onClick={() => onAlignmentClick(phase)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent-orange)',
                fontSize: '12px',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E55A08';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-orange)';
              }}
            >
              Alignment description between program and revenue cycle
            </button>
          </div>
        </div>

        {/* Field Cards */}
        <div>
          {fields.map((field, index) => (
            <FieldCard
              key={`${field['Field Name']}-${index}`}
              field={field}
              assessmentStatus={assessments[field['Field Name']] || 'not_assessed'}
              onClick={() => onFieldClick(field)}
            />
          ))}
        </div>

        {fields.length === 0 && (
          <div
            className="text-center text-muted"
            style={{
              padding: 'var(--spacing-xl)',
              fontStyle: 'italic'
            }}
          >
            No fields match current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueColumn;