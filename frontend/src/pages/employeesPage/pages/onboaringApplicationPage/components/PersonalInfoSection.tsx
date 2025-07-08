import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function PersonalInfoSection(): React.ReactNode {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <section>
      <h2>个人信息</h2>
      <div>
        <div>
          <label>
            SSN <span>*</span>
          </label>
          <input {...register('ssn')} />
          {errors.ssn && <p>{errors.ssn.message}</p>}
        </div>
        <div>
          <label>
            出生日期 <span>*</span>
          </label>
          <input type="date" {...register('dob')} />
          {errors.dob && <p>{errors.dob.message}</p>}
        </div>
        <div>
          <label>
            性别 <span>*</span>
          </label>
          <select {...register('gender')}>
            <option value="">请选择</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="I do not wish to answer">不愿回答</option>
          </select>
          {errors.gender && <p>{errors.gender.message}</p>}
        </div>
      </div>
    </section>
  );
} 