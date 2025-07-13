import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import type { HousingDetails, FacilityReport } from "../src/types/housing.types";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const HOUSING_DATABASE_NAME = "EmployeeDatabase"; // Using same database as employees
const HOUSING_COLLECTION_NAME = "houseCollection";
const FACILITY_REPORTS_COLLECTION_NAME = "FacilityReportsCollection";

const housingSeed: HousingDetails[] = [
  {
    employeeEmail: "alice.johnson@example.com",
    address: {
      building: "Pilot Tech Housing Complex",
      street: "123 Innovation Drive",
      city: "Boston",
      state: "MA",
      zip: "02115",
      apartment: "Apt 5B",
    },
    roommates: [
      {
        firstName: "Sarah",
        lastName: "Chen",
        middleName: "Ming",
        phone: "617-555-9876",
        email: "sarah.chen@example.com",
      },
      {
        firstName: "Michael",
        lastName: "Rodriguez",
        phone: "617-555-8765",
        email: "michael.rodriguez@example.com",
      },
    ],
    assignedDate: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    employeeEmail: "david.lee@example.com",
    address: {
      building: "Tech Valley Apartments",
      street: "456 Silicon Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      apartment: "Unit 12C",
    },
    roommates: [
      {
        firstName: "Jennifer",
        lastName: "Kim",
        phone: "415-555-6543",
        email: "jennifer.kim@example.com",
      },
    ],
    assignedDate: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    employeeEmail: "maria.gomez@example.com",
    address: {
      building: "Innovation Heights",
      street: "789 Tech Boulevard",
      city: "New York",
      state: "NY",
      zip: "10001",
      apartment: "Suite 8D",
    },
    roommates: [],
    assignedDate: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
];

const facilityReportsSeed: FacilityReport[] = [
  {
    _id: "1",
    title: "Broken Air Conditioning",
    description: "The air conditioning unit in the living room is not working properly. It's making strange noises and not cooling effectively. The temperature is currently 78°F and it's very uncomfortable.",
    createdBy: "alice.johnson@example.com",
    status: "Open",
    createdAt: new Date("2024-03-15T10:30:00Z"),
    updatedAt: new Date("2024-03-15T10:30:00Z"),
    comments: [
      {
        reportId: "1",
        description: "Thank you for reporting this issue. We have scheduled a maintenance technician to visit on March 18th between 2-4 PM. Please ensure someone is available to let them in.",
        createdBy: "hr@pilottech.com",
        createdAt: new Date("2024-03-15T14:20:00Z"),
        updatedAt: new Date("2024-03-15T14:20:00Z"),
      },
      {
        reportId: "1",
        description: "Perfect, I'll be home during that time. Thank you for the quick response!",
        createdBy: "alice.johnson@example.com",
        createdAt: new Date("2024-03-15T15:45:00Z"),
        updatedAt: new Date("2024-03-15T15:45:00Z"),
      },
    ],
  },
  {
    _id: "2",
    title: "Leaking Faucet in Kitchen",
    description: "The kitchen faucet has been dripping continuously for the past week. It's wasting water and the constant dripping sound is annoying. The leak seems to be coming from the base of the faucet.",
    createdBy: "david.lee@example.com",
    status: "In Progress",
    createdAt: new Date("2024-03-10T09:15:00Z"),
    updatedAt: new Date("2024-03-12T16:30:00Z"),
    comments: [
      {
        reportId: "2",
        description: "We've identified the issue and ordered the necessary replacement parts. The plumber will be available on March 14th to fix this.",
        createdBy: "hr@pilottech.com",
        createdAt: new Date("2024-03-11T11:00:00Z"),
        updatedAt: new Date("2024-03-11T11:00:00Z"),
      },
      {
        reportId: "2",
        description: "Update: The plumber has been scheduled for March 14th at 10 AM. Please ensure access to the kitchen area.",
        createdBy: "hr@pilottech.com",
        createdAt: new Date("2024-03-12T16:30:00Z"),
        updatedAt: new Date("2024-03-12T16:30:00Z"),
      },
    ],
  },
  {
    _id: "3",
    title: "Internet Connection Issues",
    description: "The WiFi connection has been very slow and unstable for the past few days. It frequently disconnects and the download speed is extremely slow. This is affecting my ability to work from home.",
    createdBy: "maria.gomez@example.com",
    status: "Closed",
    createdAt: new Date("2024-03-05T13:45:00Z"),
    updatedAt: new Date("2024-03-08T17:20:00Z"),
    comments: [
      {
        reportId: "3",
        description: "We've contacted the internet service provider. They will send a technician to check the connection on March 7th.",
        createdBy: "hr@pilottech.com",
        createdAt: new Date("2024-03-06T10:15:00Z"),
        updatedAt: new Date("2024-03-06T10:15:00Z"),
      },
      {
        reportId: "3",
        description: "The technician came and replaced the router. The connection is now working perfectly. Thank you for your help!",
        createdBy: "maria.gomez@example.com",
        createdAt: new Date("2024-03-08T17:20:00Z"),
        updatedAt: new Date("2024-03-08T17:20:00Z"),
      },
    ],
  },
  {
    _id: "4",
    title: "Broken Window Lock",
    description: "The lock on the bedroom window is broken and won't secure properly. This is a security concern, especially since the window is on the ground floor.",
    createdBy: "alice.johnson@example.com",
    status: "Open",
    createdAt: new Date("2024-03-18T08:30:00Z"),
    updatedAt: new Date("2024-03-18T08:30:00Z"),
    comments: [],
  },
  {
    _id: "5",
    title: "Noise from Upstairs Neighbors",
    description: "The neighbors upstairs are making excessive noise late at night (after 11 PM). This is happening almost every night and is affecting my sleep schedule.",
    createdBy: "david.lee@example.com",
    status: "In Progress",
    createdAt: new Date("2024-03-16T22:15:00Z"),
    updatedAt: new Date("2024-03-17T14:00:00Z"),
    comments: [
      {
        reportId: "5",
        description: "We've contacted the property management about the noise complaint. They will address this with the upstairs tenants.",
        createdBy: "hr@pilottech.com",
        createdAt: new Date("2024-03-17T14:00:00Z"),
        updatedAt: new Date("2024-03-17T17:14:00Z"),
      },
    ],
  },
];

async function seedHousing() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(HOUSING_DATABASE_NAME);
    
    // Seed housing details
    const housingCollection = db.collection<HousingDetails>(HOUSING_COLLECTION_NAME);
    const housingResult = await housingCollection.insertMany(housingSeed);
    console.log(`Inserted ${housingResult.insertedCount} housing assignments`);
    
    // Seed facility reports
    const facilityReportsCollection = db.collection<FacilityReport>(FACILITY_REPORTS_COLLECTION_NAME);
    const reportsResult = await facilityReportsCollection.insertMany(facilityReportsSeed);
    console.log(`Inserted ${reportsResult.insertedCount} facility reports`);
    
    console.log("Housing seeding completed successfully!");
  } catch (err) {
    console.error("Failed to seed housing data:", err);
  } finally {
    await client.close();
  }
}

seedHousing(); 