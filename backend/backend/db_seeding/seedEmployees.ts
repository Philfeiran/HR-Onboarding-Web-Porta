import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid"; // ✅ 引入 uuid
import type { Employee } from "../src/types/employee.types";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "EmployeeDatabase";
const COLLECTION_NAME = "EmployeeCollection";

// ✅ 添加 employeeId 字段
const seedData: Employee[] = [
  {
    employeeId: uuidv4(),
    status: "Pending",
    firstName: "Alice",
    lastName: "Smith",
    preferredName: "Ali",
    email: "alice.smith@example.com",
    dateOfBirth: "1990-01-15",
    phone: "555-1234",
    gender: "Female",
    ssn: "123-45-6789",
    citizenship: "US",
    visaStatus: "Citizen",
    currentAddress: "1234 Main St, New York, NY",
    car: "Toyota Corolla",
    profilePicture: "https://example.com/pfp/alice.jpg",
    driversLicense: {
      driversLicenseNumber: "NY1234567",
      driversLicenseExpirationDate: "2030-01-01",
      driversLicenseCopy: "https://example.com/dl/alice.pdf",
    },
    reference: {
      referenceFirstName: "John",
      referenceLastName: "Doe",
      referenceEmail: "john.doe@example.com",
      referencePhone: "555-4321",
      referenceRelationship: "Manager",
    },
    emergencyContacts: [
      {
        firstName: "Bob",
        lastName: "Smith",
        phone: "555-9876",
        email: "bob.smith@example.com",
        relationship: "Brother",
      },
    ],
    uploadedFiles: ["resume.pdf", "cover_letter.pdf"],
  },
  {
    employeeId: uuidv4(),
    status: "Approved",
    firstName: "Tom",
    lastName: "Brown",
    email: "tom.brown@example.com",
    citizenship: "Canada",
    visaStatus: "H1B",
    emergencyContacts: [],
    driversLicense: null,
    reference: null,
    uploadedFiles: [],
  },
];

async function seedEmployees() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection<Employee>(COLLECTION_NAME);

    await collection.deleteMany({});
    console.log("Old records cleared.");

    const result = await collection.insertMany(seedData);
    console.log(`Inserted ${result.insertedCount} employees`);
  } catch (err) {
    console.error("Failed to seed employees:", err);
  } finally {
    await client.close();
  }
}

seedEmployees();
