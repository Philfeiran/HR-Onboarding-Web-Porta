# Database Seeding

This directory contains scripts to populate the database with sample data for testing and development.

## Available Seed Scripts

### 1. Employee Data (`seedEmployees.ts`)
Populates the database with sample employee records including:
- Personal information
- Contact details
- Work authorization
- Emergency contacts
- Onboarding status

### 2. Housing Data (`seedHousing.ts`)
Populates the database with sample housing and facility report data including:
- Housing assignments for existing employees
- Roommate information
- Facility reports with various statuses
- Comments on facility reports

## Running the Seed Scripts

### Prerequisites
1. Make sure your MongoDB connection is properly configured
2. Set the `MONGODB_URI` environment variable
3. Ensure the database is accessible

### Commands

#### Seed Employees Only
```bash
npm run seed:employees
```

#### Seed Housing Only
```bash
npm run seed:housing
```

#### Seed All Data (Recommended)
```bash
npm run seed:all
```

This will run both employee and housing seeding in sequence.

## Sample Data Included

### Employees
- **Alice Johnson** (alice.johnson@example.com) - Status: Pending
- **David Lee** (david.lee@example.com) - Status: Approved  
- **Maria Gomez** (maria.gomez@example.com) - Status: Rejected

### Housing Assignments
- **Alice Johnson**: Pilot Tech Housing Complex, Apt 5B (2 roommates)
- **David Lee**: Tech Valley Apartments, Unit 12C (1 roommate)
- **Maria Gomez**: Innovation Heights, Suite 8D (no roommates)

### Facility Reports
- **Broken Air Conditioning** (Alice) - Status: Open
- **Leaking Faucet** (David) - Status: In Progress
- **Internet Issues** (Maria) - Status: Closed
- **Broken Window Lock** (Alice) - Status: Open
- **Noise Complaint** (David) - Status: In Progress

## Database Collections Used

- `EmployeeCollection` - Employee data
- `HousingCollection` - Housing assignments
- `FacilityReportsCollection` - Facility reports and comments

## Notes

- The scripts use the same database (`EmployeeDatabase`) for consistency
- All dates are set to realistic recent dates
- Sample data includes various scenarios (different statuses, roommates, etc.)
- Comments on facility reports demonstrate the communication flow between employees and HR

## Troubleshooting

If you encounter errors:

1. **Connection Issues**: Check your `MONGODB_URI` environment variable
2. **Permission Issues**: Ensure your MongoDB user has write permissions
3. **Duplicate Data**: The scripts will insert new records each time they run
4. **Type Errors**: Make sure all dependencies are installed (`npm install`)

## Customization

You can modify the seed data by editing the arrays in each seed file:
- `employeeSeed` in `seedEmployees.ts`
- `housingSeed` and `facilityReportsSeed` in `seedHousing.ts`

Remember to restart the seeding process after making changes. 