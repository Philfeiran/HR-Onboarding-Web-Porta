export default interface Employee {
  status?: "Never Submitted" | "Rejected" | "Pending" | "Approved";
  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;
  ssn?: string;
  gender?: string;
  email: string;
  dateOfBirth?: string;
  currentAddress?: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cellPhone?: string;
  workPhone?: string;
  car?: {
    make?: string;
    model?: string;
    color?: string;
  } | null; // 汽车信息可能是一个对象或null
  citizenshipOrPR?: string;
  visaStatus?: string;
  driversLicense?: {
    driversLicenseNumber?: string;
    driversLicenseExpirationDate?: string;
    driversLicenseCopy?: string;
  } | null; // 可能是一个对象或null
  reference?: {
    referenceFirstName: string;
    referenceLastName: string;
    referenceMiddleName?: string;
    referenceEmail: string;
    referencePhone: string;
    referenceRelationship: string;
  } | null; // 可能是一个对象或null
  emergencyContacts?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
    relationship: string;
  }[];
  uploadedFiles?: string[]; // 上传的文件列表
}
