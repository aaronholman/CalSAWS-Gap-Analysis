import React from 'react';
import { ProgressStats } from '../types';

interface ProgressTrackerProps {
  stats: ProgressStats;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats }) => {
  const progressPercentage = stats.total > 0 ? Math.round((stats.assessed / stats.total) * 100) : 0;

  return (
    <div style={{
      backgroundColor: 'var(--color-primary-white)',
      border: '1px solid #E9ECEF',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)',
      height: '320px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h3 style={{ margin: 0, marginBottom: 'var(--spacing-md)', fontSize: '1.25rem', textAlign: 'center' }}>
        Data Field Tracking: {stats.assessed} of {stats.total} fields
      </h3>

      {/* Two-Column Layout */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', alignItems: 'center' }}>
        {/* First Column: Overall Progress */}
        <div style={{ flex: '0 0 auto' }}>
          {/* Legend and Stacked Bar Layout */}
          <div className="d-flex gap-md">
              {/* Legend - Left side */}
              <div style={{
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px'
              }}>
                <div style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  border: '2px solid var(--color-not-assessed)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Not Assessed ({stats.notAssessed})
                </div>
                <div style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  border: '2px solid var(--color-investigation)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Under Investigation ({stats.underInvestigation})
                </div>
                <div style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  border: '2px solid var(--color-edit-requested)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Edit Requested ({stats.editRequested})
                </div>
                <div style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  border: '2px solid var(--color-needs-addition)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Needs Addition ({stats.needsAddition})
                </div>
                <div style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  border: '2px solid var(--color-captured)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Currently Captured ({stats.currentlyCaptured})
                </div>
              </div>

              {/* Single Stacked Vertical Bar Chart - Right side */}
              <div style={{
                width: '60px',
                height: '240px',
                border: '1px solid #DEE2E6',
                borderRadius: 'var(--border-radius-sm)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column-reverse',
                backgroundColor: '#F8F9FA'
              }}>
                {/* Currently Captured - Bottom section */}
                {stats.currentlyCaptured > 0 && (
                  <div
                    style={{
                      height: `${stats.total > 0 ? (stats.currentlyCaptured / stats.total) * 100 : 0}%`,
                      backgroundColor: 'var(--color-captured)',
                      transition: 'height 0.3s ease'
                    }}
                  />
                )}

                {/* Edit Requested */}
                {stats.editRequested > 0 && (
                  <div
                    style={{
                      height: `${stats.total > 0 ? (stats.editRequested / stats.total) * 100 : 0}%`,
                      backgroundColor: 'var(--color-edit-requested)',
                      transition: 'height 0.3s ease'
                    }}
                  />
                )}

                {/* Needs Addition */}
                {stats.needsAddition > 0 && (
                  <div
                    style={{
                      height: `${stats.total > 0 ? (stats.needsAddition / stats.total) * 100 : 0}%`,
                      backgroundColor: 'var(--color-needs-addition)',
                      transition: 'height 0.3s ease'
                    }}
                  />
                )}

                {/* Under Investigation */}
                {stats.underInvestigation > 0 && (
                  <div
                    style={{
                      height: `${stats.total > 0 ? (stats.underInvestigation / stats.total) * 100 : 0}%`,
                      backgroundColor: 'var(--color-investigation)',
                      transition: 'height 0.3s ease'
                    }}
                  />
                )}

                {/* Not Assessed - Top section */}
                {stats.notAssessed > 0 && (
                  <div
                    style={{
                      height: `${stats.total > 0 ? (stats.notAssessed / stats.total) * 100 : 0}%`,
                      backgroundColor: 'var(--color-not-assessed)',
                      transition: 'height 0.3s ease'
                    }}
                  />
                )}
              </div>
            </div>
        </div>

        {/* Second Column: Phase Breakdown Table */}
        <div style={{ flex: '0 0 auto' }}>
          <table style={{
            width: 'auto',
            height: '240px',
            borderCollapse: 'collapse',
            fontSize: '12px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'left',
                  fontWeight: 600,
                  border: '1px solid #DEE2E6'
                }}>
                  Phase
                </th>
                <th style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  fontWeight: 600,
                  border: '1px solid #DEE2E6',
                  fontSize: '11px'
                }}>
                  Currently Captured
                </th>
                <th style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  fontWeight: 600,
                  border: '1px solid #DEE2E6',
                  fontSize: '11px'
                }}>
                  Edit Requested
                </th>
                <th style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  fontWeight: 600,
                  border: '1px solid #DEE2E6',
                  fontSize: '11px'
                }}>
                  Needs Addition
                </th>
                <th style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  fontWeight: 600,
                  border: '1px solid #DEE2E6',
                  fontSize: '11px'
                }}>
                  Under Investigation
                </th>
                <th style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  fontWeight: 600,
                  border: '1px solid #DEE2E6',
                  fontSize: '11px'
                }}>
                  Not Assessed
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  fontWeight: 500,
                  border: '1px solid #DEE2E6'
                }}>
                  Front
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-captured)'
                }}>
                  {stats.byPhase.front.currentlyCaptured}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-edit-requested)'
                }}>
                  {stats.byPhase.front.editRequested}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-needs-addition)'
                }}>
                  {stats.byPhase.front.needsAddition}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-investigation)'
                }}>
                  {stats.byPhase.front.underInvestigation}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-not-assessed)'
                }}>
                  {stats.byPhase.front.notAssessed}
                </td>
              </tr>
              <tr>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  fontWeight: 500,
                  border: '1px solid #DEE2E6'
                }}>
                  Middle
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-captured)'
                }}>
                  {stats.byPhase.middle.currentlyCaptured}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-edit-requested)'
                }}>
                  {stats.byPhase.middle.editRequested}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-needs-addition)'
                }}>
                  {stats.byPhase.middle.needsAddition}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-investigation)'
                }}>
                  {stats.byPhase.middle.underInvestigation}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-not-assessed)'
                }}>
                  {stats.byPhase.middle.notAssessed}
                </td>
              </tr>
              <tr>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  fontWeight: 500,
                  border: '1px solid #DEE2E6'
                }}>
                  Back
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-captured)'
                }}>
                  {stats.byPhase.back.currentlyCaptured}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-edit-requested)'
                }}>
                  {stats.byPhase.back.editRequested}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-needs-addition)'
                }}>
                  {stats.byPhase.back.needsAddition}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-investigation)'
                }}>
                  {stats.byPhase.back.underInvestigation}
                </td>
                <td style={{
                  padding: 'var(--spacing-xs)',
                  textAlign: 'center',
                  border: '1px solid #DEE2E6',
                  color: 'var(--color-not-assessed)'
                }}>
                  {stats.byPhase.back.notAssessed}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;