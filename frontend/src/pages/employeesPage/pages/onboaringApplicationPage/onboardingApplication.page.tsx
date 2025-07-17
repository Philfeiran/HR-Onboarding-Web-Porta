import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { employeeService } from "../../../../services/employeeService";
import type { OnboardingFormData } from "./onboardingApplication.types";
import type Employee from "../../../../types/employee.types";
import EmployeeNavbar from "../../employeeNavbar/EmployeeNavbar";
import { NameSection } from "./components/NameSection";
import { ProfilePictureSection } from "./components/ProfilePictureSection";
import { AddressSection } from "./components/AddressSection";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { CarInfoSection } from "./components/CarInfoSection";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { CitizenshipSection } from "./components/CitizenshipSection";
import { DriversLicenseSection } from "./components/DriversLicenseSection";
import { ReferenceSection } from "./components/ReferenceSection";
import { EmergencyContactsSection } from "./components/EmergencyContactsSection";
import "./onboardingApplication.css";

export default function OnboardingApplicationPage(): React.ReactNode {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [optReceipt, setOptReceipt] = useState<File | null>(null);
  const [driversLicenseCopy, setDriversLicenseCopy] = useState<File | null>(null);

  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      preferredName: "",
      ssn: "",
      gender: undefined,
      dob: "",
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      cellPhone: "",
      workPhone: "",
      carMake: "",
      carModel: "",
      carColor: "",
      isPermanentResidentOrCitizen: "false",
      citizenshipStatus: undefined,
      workAuthorizationType: undefined,
      workAuthorizationOther: "",
      workAuthorizationStartDate: "",
      workAuthorizationEndDate: "",
      driversLicenseNumber: "",
      driversLicenseExpiration: "",
      referenceFirstName: "",
      referenceLastName: "",
      referenceMiddleName: "",
      referenceEmail: "",
      referencePhone: "",
      referenceRelationship: "",
      emergencyContacts: [
        {
          firstName: "",
          lastName: "",
          middleName: "",
          phone: "",
          email: "",
          relationship: "",
        },
      ],
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    console.log("表单数据:", data);
    console.log("头像文件:", profilePicture);
    console.log("OPT收据:", optReceipt);
    console.log("驾照副本:", driversLicenseCopy);
    const dataToSubmit: Employee = {
      status: "Pending",
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      preferredName: data.preferredName,
      // profilePicture: profilePicture
      //   ? URL.createObjectURL(profilePicture)
      //   : undefined,
      ssn: data.ssn,
      gender: data.gender,
      dateOfBirth: data.dob,
      currentAddress: {
        building: data.building,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
      cellPhone: data.cellPhone,
      workPhone: data.workPhone,
      car: {
        make: data.carMake,
        model: data.carModel,
        color: data.carColor,
      },
      citizenshipOrPR: data.isPermanentResidentOrCitizen,
      citizenshipStatus: data.citizenshipStatus,
      workAuthorization: {
        type: data.workAuthorizationType,
        other: data.workAuthorizationOther,
        startDate: data.workAuthorizationStartDate,
        endDate: data.workAuthorizationEndDate,
        // optReceipt: optReceipt ? URL.createObjectURL(optReceipt) : undefined,
      },
      driversLicense: {
        driversLicenseNumber: data.driversLicenseNumber,
        driversLicenseExpirationDate: data.driversLicenseExpiration,
        // driversLicenseCopy: driversLicenseCopy
        //   ? URL.createObjectURL(driversLicenseCopy)
        //   : undefined,
      },
      reference: {
        referenceFirstName: data.referenceFirstName,
        referenceLastName: data.referenceLastName,
        referenceMiddleName: data.referenceMiddleName,
        referenceEmail: data.referenceEmail,
        referencePhone: data.referencePhone,
        referenceRelationship: data.referenceRelationship,
      },
      emergencyContacts: data.emergencyContacts.map((contact) => ({
        firstName: contact.firstName,
        lastName: contact.lastName,
        middleName: contact.middleName,
        phone: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
      })),
    };
    console.log("提交的数据:", dataToSubmit);
    // 在这里处理表单提交
    try {
      await employeeService.submitOnboardingApplication(
        user?.email || "",
        dataToSubmit
      );

      console.log("提交成功");
    } catch (error) {
      console.error("提交出错", error);
    }
    methods.reset(); // 重置表单
    navigate("/employees");
  };

  return (
    <>
      <EmployeeNavbar />
      <div className="onboarding-application-page">
        <h1>入职申请表</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <NameSection />
            <ProfilePictureSection
              profilePicture={profilePicture}
              setProfilePicture={setProfilePicture}
            />
            <AddressSection />
            <ContactInfoSection />
            <CarInfoSection />
            <PersonalInfoSection />
            <CitizenshipSection setOptReceipt={setOptReceipt} />
            <DriversLicenseSection
              setDriversLicenseCopy={setDriversLicenseCopy}
            />
            <ReferenceSection />
            <EmergencyContactsSection />

            <div className="submit-section">
              <button type="submit" className="submit-button">
                提交申请
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
