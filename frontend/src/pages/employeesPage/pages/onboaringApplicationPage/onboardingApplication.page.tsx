import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { onboardingApplicationSchema, type OnboardingFormData } from './onboardingApplication.types';
import "./onboardingApplication.css";

import { NameSection } from './components/NameSection';
import { ProfilePictureSection } from './components/ProfilePictureSection';
import { AddressSection } from './components/AddressSection';
import { ContactInfoSection } from './components/ContactInfoSection';
import { CarInfoSection } from './components/CarInfoSection';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { CitizenshipSection } from './components/CitizenshipSection';
import { DriversLicenseSection } from './components/DriversLicenseSection';
import { ReferenceSection } from './components/ReferenceSection';
import { EmergencyContactsSection } from './components/EmergencyContactsSection';

export default function OnboardingApplicationPage(): React.ReactNode {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [optReceipt, setOptReceipt] = useState<File | null>(null);
  const [driversLicenseCopy, setDriversLicenseCopy] = useState<File | null>(null);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingApplicationSchema),
    defaultValues: {
      emergencyContacts: [
        {
          firstName: '',
          lastName: '',
          middleName: '',
          phone: '',
          email: '',
          relationship: '',
        },
      ],
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    console.log('表单数据:', data);
    console.log('头像文件:', profilePicture);
    console.log('OPT收据:', optReceipt);
    console.log('驾照副本:', driversLicenseCopy);
    // 在这里处理表单提交
  };

  return (
    <div className='onboarding-application-page'>
      <h1>入职申请表</h1>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <NameSection />
          <ProfilePictureSection profilePicture={profilePicture} setProfilePicture={setProfilePicture} />
          <AddressSection />
          <ContactInfoSection />
          <CarInfoSection />
          <PersonalInfoSection />
          <CitizenshipSection setOptReceipt={setOptReceipt} />
          <DriversLicenseSection setDriversLicenseCopy={setDriversLicenseCopy} />
          <ReferenceSection />
          <EmergencyContactsSection />

          <div>
            <button type="submit">
              提交申请
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
} 

  

    




