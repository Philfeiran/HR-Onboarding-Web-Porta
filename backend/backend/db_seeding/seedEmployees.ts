import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid"; // ✅ 引入 uuid
import type Employee from "../src/types/employee.types";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "EmployeeDatabase";
const COLLECTION_NAME = "EmployeeCollection";

const employeeSeed: Employee[] = [
  {
    status: "Pending",
    firstName: "Alice",
    lastName: "Johnson",
    middleName: "Marie",
    preferredName: "Ali",
    profilePicture: "https://example.com/profiles/alice.jpg",
    ssn: "123-45-6789",
    gender: "Female",
    email: "alice.johnson@example.com",
    dateOfBirth: "1990-05-20",
    currentAddress: {
      building: "Apt 5B",
      street: "123 Main St",
      city: "Boston",
      state: "MA",
      zip: "02115",
    },
    cellPhone: "617-555-1234",
    workPhone: "617-555-4321",
    car: {
      make: "Toyota",
      model: "Camry",
      color: "Blue",
    },
    citizenshipOrPR: "USA",
    citizenshipStatus: "Citizen",
    workAuthorization: null, // 已是Citizen，不需要工作授权
    driversLicense: {
      driversLicenseNumber: "S1234567",
      driversLicenseExpirationDate: "2028-06-30",
      driversLicenseCopy: "https://example.com/licenses/alice_dl.jpg",
    },
    reference: {
      referenceFirstName: "Mark",
      referenceLastName: "Smith",
      referenceEmail: "mark.smith@example.com",
      referencePhone: "781-555-7890",
      referenceRelationship: "Former Manager",
    },
    emergencyContacts: [
      {
        firstName: "Bob",
        lastName: "Johnson",
        phone: "617-555-6789",
        email: "bob.johnson@example.com",
        relationship: "Brother",
      },
    ],
  },
  {
    status: "Approved",
    firstName: "David",
    lastName: "Lee",
    preferredName: "Dave",
    gender: "Male",
    email: "david.lee@example.com",
    dateOfBirth: "1988-03-14",
    currentAddress: {
      building: "",
      street: "456 Elm St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
    },
    cellPhone: "415-555-5678",
    car: null, // 没有车辆
    citizenshipOrPR: "China",
    citizenshipStatus: null,
    workAuthorization: {
      type: "F1(CPT/OPT)",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      optReceipt: "https://example.com/opt/receipt_david.pdf",
    },
    driversLicense: null,
    reference: null,
    emergencyContacts: [],
  },
  {
    status: "Rejected",
    firstName: "Maria",
    lastName: "Gomez",
    email: "maria.gomez@example.com",
    dateOfBirth: "1995-11-02",
    currentAddress: {
      street: "789 Pine St",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    cellPhone: "212-555-1111",
    citizenshipOrPR: "Mexico",
    citizenshipStatus: null,
    workAuthorization: {
      type: "Other",
      other: "O-1",
      startDate: "2023-09-01",
      endDate: "2026-09-01",
    },
    emergencyContacts: [
      {
        firstName: "Carlos",
        lastName: "Gomez",
        phone: "212-555-2222",
        email: "carlos.gomez@example.com",
        relationship: "Father",
      },
      {
        firstName: "Luisa",
        lastName: "Gomez",
        phone: "212-555-3333",
        email: "luisa.gomez@example.com",
        relationship: "Mother",
      },
    ],
  },
];

async function seedEmployees() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection<Employee>(COLLECTION_NAME);
    const result = await collection.insertMany(employeeSeed);
    console.log(`Inserted ${result.insertedCount} employees`);
  } catch (err) {
    console.error("Failed to seed employees:", err);
  } finally {
    await client.close();
  }
}

seedEmployees();
