import type Employee from "../types/employee.types";
import { getCollection } from "../db/dbService";
import { config } from "../config/loadConfig";
import { Collection, ObjectId } from "mongodb";

export class EmployeeModel {
  private collectionName: string;
  private databaseName: string;
  private collection!: Collection<Employee>;

  constructor() {
    this.collectionName = config.employeeCollectionName!;
    this.databaseName = config.employeeDatabaseName!;
    this.getCollection();
  }

  private async getCollection() {
    this.collection = await getCollection(
      this.databaseName,
      this.collectionName
    );
  }

  async createEmployee(employee: Employee) {
    const result = await this.collection.insertOne(employee);
    return result;
  }

  async getAllEmployee() {
    const result = await this.collection.find({}).toArray();
    return result;
  }

  async getEmployeeByEmail(email: string) {
    const result = await this.collection.findOne({ email });
    return result;
  }

  async updateEmployeeByEmail(email: string, employeeData: Partial<Employee>) {
    const result = await this.collection.updateOne(
      { email },
      { $set: employeeData },
      { upsert: true }
    );
    return result;
  }

  async getEmployeeById(id: string) {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    return result;
  }
}
