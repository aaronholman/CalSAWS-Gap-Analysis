import React from 'react';

const Footer: React.FC = () => {
  const partners = [
    {
      name: 'Monterey County Department of Social Services',
      logo: '/images/MCDSS.jpg',
      url: 'https://www.countyofmonterey.gov/government/departments-i-z/social-services'
    },
    {
      name: 'Camden Coalition',
      logo: '/images/Camden.png',
      url: 'https://camdenhealth.org/'
    },
    {
      name: 'The Health Co-Lab',
      logo: '/images/HCL.jpeg',
      url: 'https://thehealthcolab.com'
    }
  ];

  return (
    <footer style={{
      backgroundColor: '#F8F9FA',
      borderTop: '1px solid #E9ECEF',
      padding: 'var(--spacing-xl) 0',
      marginTop: 'var(--spacing-xl)'
    }}>
      <div className="container">
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {/* Assessment Partners */}
          <div className="text-center">
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-primary-black)'
            }}>
              Assessment Partners
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 'var(--spacing-xl)',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {partners.map((partner, index) => (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    opacity: 0.9,
                    padding: 'var(--spacing-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title={partner.name}
                  aria-label={`Visit ${partner.name} website`}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{
                      height: '50px',
                      maxWidth: '160px',
                      objectFit: 'contain'
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Health Co-Lab Information */}
          <div className="text-center">
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-primary-black)'
            }}>
              Built By The Health Co-Lab
            </h4>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#495057',
              marginBottom: 'var(--spacing-md)'
            }}>
              <p style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                Service Disabled Veteran Owned Small Business
              </p>
              <p style={{ margin: 0 }}>
                Mobilizing insight and developing simple technology solutions<br />
                to deliver maximum value in healthcare.
              </p>
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6C757D'
            }}>
              <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                <strong>Contact:</strong> info@thehealthcolab.com
              </div>
              <div>
                <strong>Web:</strong> <a
                  href="https://thehealthcolab.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-accent-orange)', textDecoration: 'none' }}
                >
                  thehealthcolab.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid #DEE2E6',
          paddingTop: 'var(--spacing-md)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#6C757D',
            lineHeight: '1.5'
          }}>
            CalSAWS Gap Analysis Tool for Enhanced Care Management & Community Supports
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;