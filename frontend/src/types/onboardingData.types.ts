export interface OnboardingName {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
}

export interface OnboardingAddress {
  building?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OnboardingPhone {
  cell: string;
  work?: string;
}

export interface OnboardingCar {
  make: string;
  model: string;
  color: string;
}

export interface OnboardingPersonalInfo {
  ssn: string;
  dob: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'I do not wish to answer';
}

export interface OnboardingWorkAuthorization {
  type: 'H1-B' | 'L2' | 'F1(CPT/OPT)' | 'H4' | 'Other';
  otherTitle?: string;
  optReceipt?: File | string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type CitizenshipStatus =
  | {
      isPermanentResidentOrCitizen: true;
      status: 'Green Card' | 'Citizen';
    }
  | {
      isPermanentResidentOrCitizen: false;
      workAuthorization: OnboardingWorkAuthorization;
    };

export interface OnboardingDriversLicense {
  number: string;
  expiration: string; // YYYY-MM-DD
  copy: File | string;
}

export interface OnboardingContact {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface OnboardingData {
  name: OnboardingName;
  profilePicture?: File | string;
  address: OnboardingAddress;
  phone: OnboardingPhone;
  car?: OnboardingCar;
  personalInfo: OnboardingPersonalInfo;
  citizenship: CitizenshipStatus;
  driversLicense?: OnboardingDriversLicense;
  reference?: OnboardingContact;
  emergencyContacts: [OnboardingContact, ...OnboardingContact[]];
} 