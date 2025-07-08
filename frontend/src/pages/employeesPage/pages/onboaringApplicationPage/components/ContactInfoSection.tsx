import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function ContactInfoSection(): React.ReactNode {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <section>
      <h2>电话号码</h2>
      <div>
        <div>
          <label>
            手机号码 <span>*</span>
          </label>
          <input {...register('cellPhone')} />
          {errors.cellPhone && <p>{errors.cellPhone.message}</p>}
        </div>
        <div>
          <label>工作电话</label>
          <input {...register('workPhone')} />
        </div>
      </div>
    </section>
  );
} 