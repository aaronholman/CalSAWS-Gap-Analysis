import React, { useState } from 'react';
import { AssessmentStatus } from '../types';

interface NewFieldData {
  elementName: string;
  hcfaBox: string;
  fieldRequirement: string;
  shortDescription: string;
  likelySource: string;
  primaryNeed: string[];
  implementationNotes: string;
  phase: string;
  dataFrequency: string;
  assessmentStatus: AssessmentStatus;
  calSAWSField?: string;
  assessmentNotes?: string;
  author: string;
}

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: NewFieldData) => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<NewFieldData>({
    elementName: '',
    hcfaBox: '',
    fieldRequirement: 'Always',
    shortDescription: '',
    likelySource: 'Intake',
    primaryNeed: [],
    implementationNotes: '',
    phase: 'front',
    dataFrequency: 'Period Dependent',
    assessmentStatus: 'not_assessed',
    calSAWSField: '',
    assessmentNotes: '',
    author: ''
  });

  const primaryNeedOptions = [
    { value: 'billing', label: 'Billing' },
    { value: 'serviceDelivery', label: 'Service Delivery' },
    { value: 'mcpReporting', label: 'MCP Reporting' }
  ];

  const handlePrimaryNeedChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primaryNeed: checked
        ? [...prev.primaryNeed, value]
        : prev.primaryNeed.filter(item => item !== value)
    }));
  };

  const handleSubmit = () => {
    if (!formData.elementName.trim() || !formData.shortDescription.trim()) {
      alert('Please fill in at least Element Name and Short Description');
      return;
    }

    if (!formData.author.trim()) {
      alert('Please enter your name in the Author field');
      return;
    }

    onSave(formData);

    // Reset form
    setFormData({
      elementName: '',
      hcfaBox: '',
      fieldRequirement: 'Always',
      shortDescription: '',
      likelySource: 'Intake',
      primaryNeed: [],
      implementationNotes: '',
      phase: 'front',
      dataFrequency: 'Period Dependent',
      assessmentStatus: 'not_assessed',
      calSAWSField: '',
      assessmentNotes: '',
      author: ''
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
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-lg">
          <h3 style={{ margin: 0 }}>Add New Field</h3>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>

          {/* Basic Information Section */}
          <div style={{
            border: '1px solid #DEE2E6',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)'
          }}>
            <h4 className="mb-md">Field Information</h4>

            <div className="row mb-md">
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Element Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.elementName}
                    onChange={(e) => setFormData(prev => ({ ...prev, elementName: e.target.value }))}
                    placeholder="Enter field name"
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label className="form-label">HCFA Box #</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hcfaBox}
                    onChange={(e) => setFormData(prev => ({ ...prev, hcfaBox: e.target.value }))}
                    placeholder="e.g., 24A"
                  />
                </div>
              </div>
            </div>

            <div className="row mb-md">
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Field Requirement</label>
                  <select
                    className="form-input"
                    value={formData.fieldRequirement}
                    onChange={(e) => setFormData(prev => ({ ...prev, fieldRequirement: e.target.value }))}
                  >
                    <option value="Always">Always</option>
                    <option value="Dependent">Dependent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Phase</label>
                  <select
                    className="form-input"
                    value={formData.phase}
                    onChange={(e) => setFormData(prev => ({ ...prev, phase: e.target.value }))}
                  >
                    <option value="front">Front</option>
                    <option value="middle">Middle</option>
                    <option value="back">Back</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mb-md">
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Data Frequency</label>
                  <select
                    className="form-input"
                    value={formData.dataFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataFrequency: e.target.value }))}
                  >
                    <option value="Period Dependent">Period Dependent</option>
                    <option value="By Patient">By Patient</option>
                    <option value="By Encounter">By Encounter</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group mb-md">
              <label className="form-label">Short Description *</label>
              <textarea
                className="form-input form-textarea"
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Describe what this field captures"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="row mb-md">
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Likely Source</label>
                  <select
                    className="form-input"
                    value={formData.likelySource}
                    onChange={(e) => setFormData(prev => ({ ...prev, likelySource: e.target.value }))}
                  >
                    <option value="Intake">Intake</option>
                    <option value="Service Notes">Service Notes</option>
                    <option value="Admin Panel">Admin Panel</option>
                    <option value="RCM Module">RCM Module</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group mb-md">
              <label className="form-label">Primary Need (Multi-select)</label>
              <div style={{
                border: '1px solid #DEE2E6',
                borderRadius: 'var(--border-radius-sm)',
                padding: 'var(--spacing-md)',
                backgroundColor: '#F8F9FA'
              }}>
                {primaryNeedOptions.map(option => (
                  <label key={option.value} className="d-flex align-items-center gap-sm mb-sm" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.primaryNeed.includes(option.value)}
                      onChange={(e) => handlePrimaryNeedChange(option.value, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Implementation Notes</label>
              <textarea
                className="form-input form-textarea"
                value={formData.implementationNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, implementationNotes: e.target.value }))}
                placeholder="Any additional implementation details"
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          {/* Author Section */}
          <div style={{
            border: '1px solid #DEE2E6',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-lg)'
          }}>
            <h4 className="mb-md">Author Information</h4>

            <div className="form-group mb-md">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter your name"
                style={{
                  borderColor: !formData.author.trim() ? '#dc3545' : '#DEE2E6'
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '12px' }}>
                Required to track who added this field
              </small>
            </div>
          </div>

          {/* Assessment Section */}
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
                  checked={formData.assessmentStatus === 'currently_captured'}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentStatus: e.target.value as AssessmentStatus }))}
                />
                <span>Currently Captured</span>
              </label>

              {formData.assessmentStatus === 'currently_captured' && (
                <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                  <div className="form-group">
                    <label className="form-label">CalSAWS Field:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.calSAWSField}
                      onChange={(e) => setFormData(prev => ({ ...prev, calSAWSField: e.target.value }))}
                      placeholder="Enter existing CalSAWS field name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes:</label>
                    <textarea
                      className="form-input form-textarea"
                      value={formData.assessmentNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
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
                  checked={formData.assessmentStatus === 'needs_addition'}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentStatus: e.target.value as AssessmentStatus }))}
                />
                <span>Needs to be Added</span>
              </label>

              {formData.assessmentStatus === 'needs_addition' && (
                <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                  <div className="form-group">
                    <label className="form-label">Notes:</label>
                    <textarea
                      className="form-input form-textarea"
                      value={formData.assessmentNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
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
                  checked={formData.assessmentStatus === 'edit_requested'}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentStatus: e.target.value as AssessmentStatus }))}
                />
                <span>Edit to this field requested</span>
              </label>

              {formData.assessmentStatus === 'edit_requested' && (
                <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                  <div className="form-group">
                    <label className="form-label">Notes:</label>
                    <textarea
                      className="form-input form-textarea"
                      value={formData.assessmentNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
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
                  checked={formData.assessmentStatus === 'investigation'}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentStatus: e.target.value as AssessmentStatus }))}
                />
                <span>Unknown - Requires Investigation</span>
              </label>

              {formData.assessmentStatus === 'investigation' && (
                <div style={{ marginLeft: '24px', marginTop: 'var(--spacing-sm)' }}>
                  <div className="form-group">
                    <label className="form-label">Notes:</label>
                    <textarea
                      className="form-input form-textarea"
                      value={formData.assessmentNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
                      placeholder="What needs to be investigated? Who should review this?"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-md justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFieldModal;