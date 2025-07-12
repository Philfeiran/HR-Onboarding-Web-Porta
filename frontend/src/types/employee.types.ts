export default interface Employee {
  _id?: string; // MongoDB ObjectId
  status?: "Never Submitted" | "Rejected" | "Pending" | "Approved";
  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;
  ssn?: string;
  gender?: string;
  email?: string;
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
  citizenshipStatus?: "Green Card" | "Citizen" | null;
  workAuthorization?: {
    type?: "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other";
    other?: string;
    startDate?: string;
    endDate?: string;
    optReceipt?: string; // OPT收据可能是一个字符串
  } | null; // 工作授权信息可能是一个对象或null
  driversLicense?: {
    driversLicenseNumber?: string;
    driversLicenseExpirationDate?: string;
    driversLicenseCopy?: string;
  } | null; // 可能是一个对象或null
  reference?: {
    referenceFirstName: string | undefined;
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
}
