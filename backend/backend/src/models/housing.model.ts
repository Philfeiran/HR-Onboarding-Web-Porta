import type { HousingDetails, FacilityReport, FacilityReportComment } from "../types/housing.types";
import { getCollection } from "../db/dbService";
import { config } from "../config/loadConfig";
import { Collection, ObjectId } from 'mongodb';

export class HousingModel {
    private housingCollectionName: string;
    private facilityReportsCollectionName: string;
    private databaseName: string;
    private housingCollection!: Collection<HousingDetails>;
    private facilityReportsCollection!: Collection<FacilityReport>;

    constructor() {
        this.housingCollectionName = config.housingCollectionName || "houseCollection";
        this.facilityReportsCollectionName = config.facilityReportsCollectionName || "FacilityReportsCollection";
        this.databaseName = config.housingDatabaseName || "EmployeeDatabase";
        this.getCollections();
    }

    private async getCollections() {
        this.housingCollection = await getCollection(this.databaseName, this.housingCollectionName);
        this.facilityReportsCollection = await getCollection(this.databaseName, this.facilityReportsCollectionName);
    }

    // Housing Details Methods
    async createHousingDetails(housingDetails: HousingDetails) {
        const result = await this.housingCollection.insertOne(housingDetails);
        return result;
    }

    async getAllHousingDetails() {
        const result = await this.housingCollection.find({}).toArray();
        return result;
    }

    async getHousingDetailsByEmail(email: string) {
        const result = await this.housingCollection.findOne({ employeeEmail: email });
        return result;
    }

    async updateHousingDetailsByEmail(email: string, housingData: Partial<HousingDetails>) {
        const result = await this.housingCollection.updateOne(
            { employeeEmail: email },
            { $set: { ...housingData, updatedAt: new Date() } },
            { upsert: true }
        );
        return result;
    }

    // Facility Reports Methods
    async createFacilityReport(report: FacilityReport) {
        const result = await this.facilityReportsCollection.insertOne(report);
        return result;
    }

    async getAllFacilityReports() {
        const result = await this.facilityReportsCollection.find({}).toArray();
        return result;
    }

    async getFacilityReportsByEmployee(email: string) {
        const result = await this.facilityReportsCollection.find({ createdBy: email }).toArray();
        return result;
    }

    async getFacilityReportById(reportId: string) {
        // Try to find by string ID first, then by ObjectId
        let result = await this.facilityReportsCollection.findOne({ _id: reportId });
        if (!result) {
            try {
                const objectId = new ObjectId(reportId);
                result = await this.facilityReportsCollection.findOne({ _id: objectId });
            } catch (error) {
                // If reportId is not a valid ObjectId, return null
                return null;
            }
        }
        return result;
    }

    async updateFacilityReportStatus(reportId: string, status: "Open" | "In Progress" | "Closed") {
        // Try to update by string ID first, then by ObjectId
        let result = await this.facilityReportsCollection.updateOne(
            { _id: reportId },
            { $set: { status, updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
            try {
                const objectId = new ObjectId(reportId);
                result = await this.facilityReportsCollection.updateOne(
                    { _id: objectId },
                    { $set: { status, updatedAt: new Date() } }
                );
            } catch (error) {
                // If reportId is not a valid ObjectId, return the original result
                return result;
            }
        }
        return result;
    }

    async addCommentToReport(reportId: string, comment: FacilityReportComment) {
        // Try to update by string ID first, then by ObjectId
        let result = await this.facilityReportsCollection.updateOne(
            { _id: reportId },
            { 
                $push: { comments: comment },
                $set: { updatedAt: new Date() }
            }
        );
        
        if (result.matchedCount === 0) {
            try {
                const objectId = new ObjectId(reportId);
                result = await this.facilityReportsCollection.updateOne(
                    { _id: objectId },
                    { 
                        $push: { comments: comment },
                        $set: { updatedAt: new Date() }
                    }
                );
            } catch (error) {
                // If reportId is not a valid ObjectId, return the original result
                return result;
            }
        }
        return result;
    }
} 