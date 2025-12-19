import React, { useState } from 'react';
import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const [showLikelySourceDropdown, setShowLikelySourceDropdown] = useState(false);
  const [showFieldRequirementDropdown, setShowFieldRequirementDropdown] = useState(false);
  const [showDataFrequencyDropdown, setShowDataFrequencyDropdown] = useState(false);

  const handleToggle = (category: keyof FilterState, key: string) => {
    onFilterChange({
      ...filters,
      [category]: {
        ...filters[category],
        [key]: !(filters[category] as any)[key]
      }
    });
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(category =>
      Object.values(category).some(value => value)
    );
  };

  const clearAllFilters = () => {
    onFilterChange({
      primaryNeed: { billing: false, serviceDelivery: false, mcpReporting: false },
      likelySource: { intake: false, serviceNotes: false, adminPanel: false, rcmModule: false },
      fieldRequirement: { always: false, dependent: false, other: false },
      dataFrequency: { periodDependent: false, byPatient: false, byEncounter: false }
    });
  };

  const getActiveCount = (category: any) => {
    return Object.values(category).filter(Boolean).length;
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-primary-white)',
      border: '1px solid #E9ECEF',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)',
      height: '320px'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-md">
        <h3 style={{ margin: 0, fontSize: '1.25rem', width: '100%', textAlign: 'center' }}>Filter Options</h3>
        {hasActiveFilters() && (
          <button
            className="btn btn-secondary"
            onClick={clearAllFilters}
            style={{ fontSize: '14px', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Primary Need Filters - Keep as buttons */}
      <div className="mb-lg">
        <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Primary Need</h4>
        <div className="d-flex gap-sm" style={{ flexWrap: 'wrap' }}>
          <button
            className={`toggle ${filters.primaryNeed.billing ? 'active' : ''}`}
            onClick={() => handleToggle('primaryNeed', 'billing')}
          >
            Billing
          </button>
          <button
            className={`toggle ${filters.primaryNeed.serviceDelivery ? 'active' : ''}`}
            onClick={() => handleToggle('primaryNeed', 'serviceDelivery')}
          >
            Service Delivery
          </button>
          <button
            className={`toggle ${filters.primaryNeed.mcpReporting ? 'active' : ''}`}
            onClick={() => handleToggle('primaryNeed', 'mcpReporting')}
          >
            MCP Reporting
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="row mb-lg" style={{ gap: 'var(--spacing-md)' }}>
        {/* Likely Source Multi-Select Dropdown */}
        <div className="col">
          <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Likely Source</h4>
          <div style={{ position: 'relative' }}>
            <button
              className="form-input d-flex justify-content-between align-items-center"
              onClick={() => setShowLikelySourceDropdown(!showLikelySourceDropdown)}
              style={{
                backgroundColor: 'var(--color-primary-white)',
                border: '1px solid #DEE2E6',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <span>
                {getActiveCount(filters.likelySource) > 0
                  ? `${getActiveCount(filters.likelySource)} selected`
                  : 'Select'
                }
              </span>
              <span style={{ transform: showLikelySourceDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                ▼
              </span>
            </button>

            {showLikelySourceDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-primary-white)',
                border: '1px solid #DEE2E6',
                borderTop: 'none',
                borderRadius: '0 0 var(--border-radius-sm) var(--border-radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 1000
              }}>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.likelySource.intake}
                    onChange={() => handleToggle('likelySource', 'intake')}
                  />
                  <span>Intake</span>
                </label>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.likelySource.serviceNotes}
                    onChange={() => handleToggle('likelySource', 'serviceNotes')}
                  />
                  <span>Service Notes</span>
                </label>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.likelySource.adminPanel}
                    onChange={() => handleToggle('likelySource', 'adminPanel')}
                  />
                  <span>Admin Panel</span>
                </label>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.likelySource.rcmModule}
                    onChange={() => handleToggle('likelySource', 'rcmModule')}
                  />
                  <span>RCM Module</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Field Requirement Multi-Select Dropdown */}
        <div className="col">
          <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Field Requirement</h4>
          <div style={{ position: 'relative' }}>
            <button
              className="form-input d-flex justify-content-between align-items-center"
              onClick={() => setShowFieldRequirementDropdown(!showFieldRequirementDropdown)}
              style={{
                backgroundColor: 'var(--color-primary-white)',
                border: '1px solid #DEE2E6',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <span>
                {getActiveCount(filters.fieldRequirement) > 0
                  ? `${getActiveCount(filters.fieldRequirement)} selected`
                  : 'Select'
                }
              </span>
              <span style={{ transform: showFieldRequirementDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                ▼
              </span>
            </button>

            {showFieldRequirementDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-primary-white)',
                border: '1px solid #DEE2E6',
                borderTop: 'none',
                borderRadius: '0 0 var(--border-radius-sm) var(--border-radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 1000
              }}>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.fieldRequirement.always}
                    onChange={() => handleToggle('fieldRequirement', 'always')}
                  />
                  <span>Always</span>
                </label>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.fieldRequirement.dependent}
                    onChange={() => handleToggle('fieldRequirement', 'dependent')}
                  />
                  <span>Dependent</span>
                </label>
                <label className="d-flex align-items-center gap-sm p-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.fieldRequirement.other}
                    onChange={() => handleToggle('fieldRequirement', 'other')}
                  />
                  <span>Other</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Data Frequency Filter */}
        <div className="col">
          <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Data Frequency</h4>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="form-input"
              style={{
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--color-primary-white)',
                width: '100%'
              }}
              onClick={() => setShowDataFrequencyDropdown(!showDataFrequencyDropdown)}
            >
              <span style={{ color: Object.values(filters.dataFrequency).some(v => v) ? 'var(--color-text-primary)' : '#6c757d' }}>
                {
                  Object.values(filters.dataFrequency).some(v => v)
                  ? `${Object.entries(filters.dataFrequency).filter(([_, selected]) => selected).length} selected`
                  : 'Select'
                }
              </span>
              <span style={{ transform: showDataFrequencyDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                ▼
              </span>
            </button>

            {showDataFrequencyDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-primary-white)',
                border: '1px solid #DEE2E6',
                borderTop: 'none',
                borderRadius: '0 0 var(--border-radius-sm) var(--border-radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 1000
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F8F9FA'
                }}>
                  <input
                    type="checkbox"
                    checked={filters.dataFrequency.periodDependent}
                    onChange={() => handleToggle('dataFrequency', 'periodDependent')}
                  />
                  <span>Period Dependent</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F8F9FA'
                }}>
                  <input
                    type="checkbox"
                    checked={filters.dataFrequency.byPatient}
                    onChange={() => handleToggle('dataFrequency', 'byPatient')}
                  />
                  <span>By Patient</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filters.dataFrequency.byEncounter}
                    onChange={() => handleToggle('dataFrequency', 'byEncounter')}
                  />
                  <span>By Encounter</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;