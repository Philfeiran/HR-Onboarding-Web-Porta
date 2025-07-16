export interface Roommate {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email?: string;
}

export interface HousingDetails {
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

export interface FacilityReportComment {
  _id?: string;
  reportId: string;
  description: string;
  createdBy: string; // email of the user
  createdAt: Date;
  updatedAt: Date;
}

export interface FacilityReport {
  _id?: string;
  title: string;
  description: string;
  createdBy: string; // email of the employee
  status: "Open" | "In Progress" | "Closed";
  createdAt: Date;
  updatedAt: Date;
  comments: FacilityReportComment[];
}

export interface CreateFacilityReportRequest {
  title: string;
  description: string;
  employeeEmail: string;
}

export interface AddCommentRequest {
  reportId: string;
  description: string;
  userEmail: string;
}

export interface UpdateReportStatusRequest {
  reportId: string;
  status: "Open" | "In Progress" | "Closed";
} 