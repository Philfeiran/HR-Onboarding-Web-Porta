# Housing Feature Implementation

This document outlines the housing feature that has been added to the HR onboarding portal.

## Overview

The housing feature provides two main functionalities:
1. **Housing Details Management** - HR can assign housing to employees, and employees can view their assigned housing
2. **Facility Reports System** - Employees can report facility issues and communicate with HR through comments

## Features Implemented

### For Employees

#### 1. Housing Details View (`/employee/housing`)
- View assigned housing address (building, street, city, state, zip, apartment)
- View list of roommates with contact information
- Read-only access (employees cannot modify housing details)
- Shows assignment date and last update information

#### 2. Facility Reports (`/employee/facility-reports`)
- Create new facility reports with title and description
- View list of all reports submitted by the employee
- See report status (Open, In Progress, Closed)
- View creation date and comment count

#### 3. Facility Report Details (`/employee/facility-reports/:reportId`)
- View detailed report information
- See all comments on the report
- Add new comments to communicate with HR
- View comment timestamps and authors

### For HR

#### 1. Housing Management (`/hr/housing`)
- **Facility Reports Tab**: View all facility reports from all employees
- **Housing Assignments Tab**: Assign housing to employees (basic interface)
- Update facility report status (Open → In Progress → Closed)
- Add comments to facility reports

## Backend Implementation

### Database Collections
- `housing_details` - Stores employee housing assignments
- `facility_reports` - Stores facility reports and comments

### API Endpoints

#### Housing Details
- `GET /api/housing/details/:email` - Get housing details for employee
- `POST /api/housing/details` - Create housing assignment (HR only)
- `PUT /api/housing/details` - Update housing details (HR only)

#### Facility Reports
- `POST /api/housing/facility-reports` - Create new report (Employees only)
- `GET /api/housing/facility-reports/:email` - Get reports by employee
- `GET /api/housing/facility-reports/report/:reportId` - Get specific report
- `POST /api/housing/facility-reports/comment` - Add comment to report
- `PUT /api/housing/facility-reports/status` - Update report status (HR only)
- `GET /api/housing/facility-reports` - Get all reports (HR only)

### Data Models

#### HousingDetails
```typescript
interface HousingDetails {
  _id?: string;
  employeeEmail: string;
  address: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    apartment?: string;
  };
  roommates: Roommate[];
  assignedDate: Date;
  updatedAt: Date;
}
```

#### FacilityReport
```typescript
interface FacilityReport {
  _id?: string;
  title: string;
  description: string;
  createdBy: string; // employee email
  status: "Open" | "In Progress" | "Closed";
  createdAt: Date;
  updatedAt: Date;
  comments: FacilityReportComment[];
}
```

#### FacilityReportComment
```typescript
interface FacilityReportComment {
  _id?: string;
  reportId: string;
  description: string;
  createdBy: string; // user email
  createdAt: Date;
  updatedAt: Date;
}
```

## Frontend Implementation

### Components Created
1. `HousingPage.tsx` - Employee housing details view
2. `FacilityReportsPage.tsx` - Employee facility reports list
3. `FacilityReportDetailPage.tsx` - Individual report view with comments
4. `HousingManagement.tsx` - HR housing management interface

### Services
- `housingService.ts` - API calls for housing functionality

### Types
- `housing.types.ts` - TypeScript interfaces for housing data

### Routing
- Added housing routes to both employee and HR sections
- Updated navigation bars to include housing links

## Security & Permissions

- **Employees**: Can only view their own housing details and facility reports
- **HR**: Can view all housing assignments and facility reports, can update report status
- **Authentication**: All endpoints require valid JWT token
- **Role-based access**: Different permissions for HR vs Employee roles

## Environment Variables Required

Add these to your backend environment configuration:
```
HOUSING_COLLECTION_NAME=housing_details
HOUSING_DATABASE_NAME=your_database_name
FACILITY_REPORTS_COLLECTION_NAME=facility_reports
```

## Usage Instructions

### For Employees
1. Navigate to "住房" (Housing) to view assigned housing details
2. Navigate to "设施报告" (Facility Reports) to view/create facility reports
3. Click on any report to view details and add comments

### For HR
1. Navigate to "住房管理" (Housing Management) in HR dashboard
2. Use "Facility Reports" tab to view and manage all reports
3. Use "Housing Assignments" tab to assign housing to employees
4. Update report status and add comments as needed

## Future Enhancements

1. **Roommate Management**: Add/remove roommates from housing assignments
2. **Document Upload**: Allow employees to upload photos of facility issues
3. **Email Notifications**: Send notifications when reports are created/updated
4. **Housing Search**: Search and filter housing assignments
5. **Bulk Operations**: Assign housing to multiple employees at once
6. **Housing History**: Track changes to housing assignments over time

## Notes

- The housing feature is fully integrated with the existing authentication system
- All components use Material-UI for consistent styling
- The implementation follows the existing project patterns and conventions
- Error handling and loading states are implemented throughout
- The feature is responsive and works on mobile devices 