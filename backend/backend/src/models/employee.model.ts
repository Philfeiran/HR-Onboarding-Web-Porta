import type Employee from "../types/employee.types";
import { getCollection } from "../db/dbService";
import { config } from "../config/loadConfig";
import {Collection, ObjectId} from 'mongodb';


export class EmployeeModel{
    private collectionName: string;
    private databaseName:string;
    private collection!: Collection<Employee>;

    constructor(){
        this.collectionName = config.employeeCollectionName!;
        this.databaseName = config.employeeDatabaseName!;
        this.getCollection();
    }

    private async getCollection(){
        this.collection = await getCollection(this.databaseName,this.collectionName);
    }

    async createEmployee(employee:Employee){
        const result = await this.collection.insertOne(employee);
        return result;
    }

    async getAllEmployee(){
        const result = await this.collection.find({}).toArray();
        return result
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

    // HR相关方法
    // 根据状态获取申请
    async getApplicationsByStatus(status: "Pending" | "Approved" | "Rejected") {
        const result = await this.collection.find({ status }).toArray();
        return result;
    }

    // 更新申请状态
    async updateApplicationStatus(email: string, status: "Pending" | "Approved" | "Rejected", reviewedBy: string) {
        const result = await this.collection.updateOne(
            { email },
            { 
                $set: { 
                    status,
                    statusUpdatedAt: new Date(),
                    "hrFeedback.reviewedBy": reviewedBy,
                    "hrFeedback.reviewedAt": new Date(),
                    "hrFeedback.updatedAt": new Date()
                }
            }
        );
        return result;
    }

    // 添加HR反馈
    async addHRFeedback(email: string, comment: string, reviewedBy: string) {
        const result = await this.collection.updateOne(
            { email },
            { 
                $set: { 
                    "hrFeedback.comment": comment,
                    "hrFeedback.reviewedBy": reviewedBy,
                    "hrFeedback.reviewedAt": new Date(),
                    "hrFeedback.updatedAt": new Date()
                }
            }
        );
        return result;
    }

    // 获取所有onboarding申请（包含基本信息用于HR查看）
    async getAllOnboardingApplications() {
        const result = await this.collection.find(
            { status: { $in: ["Pending", "Approved", "Rejected"] } },
            { 
                projection: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    status: 1,
                    submittedAt: 1,
                    statusUpdatedAt: 1,
                    hrFeedback: 1
                }
            }
        ).toArray();
        return result;
    }

}

