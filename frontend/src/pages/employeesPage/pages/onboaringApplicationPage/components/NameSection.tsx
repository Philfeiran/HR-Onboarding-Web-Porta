import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function NameSection(): React.ReactNode {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <section>
      <h2>个人姓名</h2>
      <div>
        <div>
          <label>
            名字 <span>*</span>
          </label>
          <input {...register('firstName')} />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>
        <div>
          <label>
            姓氏 <span>*</span>
          </label>
          <input {...register('lastName')} />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>
        <div>
          <label>中间名</label>
          <input {...register('middleName')} />
        </div>
        <div>
          <label>昵称</label>
          <input {...register('preferredName')} />
        </div>
      </div>
    </section>
  );
} 