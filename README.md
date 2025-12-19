# CalSAWS Gap Analysis Tool

An interactive assessment tool for Monterey County Department of Social Services to evaluate CalSAWS system readiness for Enhanced Care Management (ECM) and Community Supports (CS) program compliance.

## Overview

This tool organizes 91+ data fields across a three-phase revenue cycle framework (Front, Middle, Back) and enables systematic assessment of each field's current status in CalSAWS:

- ✅ **Currently Captured** - Field already exists in CalSAWS
- ➕ **Needs to be Added** - New field required for ECM/CS compliance
- ❓ **Under Investigation** - Requires further review

## Key Features

### Three-Column Revenue Cycle Layout
- **Front**: Patient Registration & Intake (Demographics, Insurance, Signatures)
- **Middle**: Service Delivery & Documentation (Encounters, Care Plans, Service Notes)
- **Back**: Billing & Claims Processing (Provider Info, Codes, Claims Submission)

### Interactive Assessment Workflow
- Click any field to open detailed assessment panel
- View field metadata: HCFA box references, implementation notes, requirements
- Save assessment status with notes and CalSAWS field mappings

### Advanced Filtering
- **Primary Need**: Billing, Service Delivery, MCP Reporting
- **Likely Source**: Intake, Service Notes, Admin Panel, RCM Module
- **Field Requirement**: Always, Dependent, Other

### Progress Tracking
- Real-time completion statistics
- Visual progress indicators
- Status breakdown by assessment category

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone/Download the repository**
```bash
git clone <your-repo-url>
cd calsaws-gap-analysis
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Data Requirements

The application requires `Fields.csv` in the `/public` directory with these columns:
- Field Name
- Additional Note
- CM System Extract Requirement
- Case Management System
- Field Requirement
- HCFA Box #
- Likely Source
- Phase or Revenue Cycle
- Primary Need
- Program
- Short Description
- State

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Custom CSS with Health Co-Lab design system
- **Data Processing**: PapaParse for CSV handling
- **Future Backend**: Supabase integration planned

## Design System

### Colors
- **Primary**: Black (#000000) and White (#FFFFFF)
- **Accent**: Orange (#FF6909) for CTAs and active states
- **Status Colors**:
  - Green (#28A745) - Currently Captured
  - Orange (#FF6909) - Needs Addition
  - Blue (#007BFF) - Under Investigation
  - Gray (#6C757D) - Not Assessed

### Typography
- **Font**: Inter (clean, professional sans-serif)
- **Hierarchy**: Clear headings, readable body text
- **Accessibility**: WCAG AA compliant contrast ratios

## Project Structure

```
/src
  /components
    FieldCard.tsx           # Individual field display
    RevenueColumn.tsx       # Column layout for each phase
    FieldDetailModal.tsx    # Assessment overlay
    FilterPanel.tsx         # Filter controls
    ProgressTracker.tsx     # Progress statistics
    Footer.tsx             # Organization logos
  /types
    index.ts               # TypeScript interfaces
  /utils
    csvParser.ts           # Data processing utilities
  /styles
    index.css              # Global styles
  App.tsx                  # Main application
  index.tsx                # React entry point
```

## Assessment Partners

- **Monterey County Department of Social Services** - Primary stakeholder
- **Camden Coalition** - Healthcare integration expertise
- **The Health Co-Lab** - Technical implementation and design

## Future Enhancements

### Supabase Integration
- Persistent assessment storage
- Multi-user collaboration
- Audit trail and version history
- Export/reporting capabilities

### Advanced Features
- Bulk assessment operations
- Custom field categories
- Integration status tracking
- Compliance validation rules

## Development Guidelines

### Code Quality
- TypeScript for type safety
- Component-based architecture
- Responsive design principles
- Accessibility-first approach

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Support

For questions or issues:
1. Review this documentation
2. Check the Issues tab in the repository
3. Contact the development team

## License

This project is developed for Monterey County Department of Social Services internal use.

---

**Simple, valuable, actionable** - Following Health Co-Lab design principles for maximum user value.