import React from 'react';

interface AlignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: 'front' | 'middle' | 'back';
}

const AlignmentModal: React.FC<AlignmentModalProps> = ({ isOpen, onClose, phase }) => {
  if (!isOpen) return null;

  const getPhaseContent = () => {
    switch (phase) {
      case 'front':
        return {
          title: 'Front End (Patient Access)',
          content: 'The Front End phase, often referred to as Patient Access, focuses on the administrative tasks that occur before or during a patient\'s arrival (from a revenue cycle perspective: to ensure financial clearance). Primary activities include scheduling appointments, registering patients by collecting demographic data, and verifying insurance eligibility and benefits. Designated staff in this phase also will need to obtain necessary prior authorizations from payers (Managed Care Plans) to prevent downstream claim denials.'
        };
      case 'middle':
        return {
          title: 'Middle (Service Delivery)',
          content: 'The Middle phase is where services are actually performed based on the program the patient / client is enrolled in and their individual needs. This is an area where certain unstructured data (e.g. clinical or encounter notes) need to be captured to support service delivery, while other structured data elements (e.g the type of encounter that took place) also need to be captured in order to support back-end billing operations.'
        };
      case 'back':
        return {
          title: 'Back End (Business and Billing Office)',
          content: 'The Back End phase, often called the Business Office, manages the final claims process and revenue collection after patient / client services have been delivered. Key tasks include scrubbing and submitting claims to insurance payers, posting payments to patient accounts, and managing accounts receivable (AR). This functional area also handles denial management by investigating and appealing rejected claims.'
        };
      default:
        return { title: '', content: '' };
    }
  };

  const { title, content } = getPhaseContent();

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
          <h3 style={{ margin: 0 }}>Alignment Description Between Program and Revenue Cycle</h3>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ lineHeight: '1.6' }}>
          <div className="mb-lg">
            <h4 style={{
              color: 'var(--color-primary-black)',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.1rem'
            }}>
              {title}
            </h4>
            <p style={{ marginBottom: 0, color: '#495057' }}>
              {content}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlignmentModal;