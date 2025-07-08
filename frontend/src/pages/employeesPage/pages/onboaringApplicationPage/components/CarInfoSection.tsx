import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function CarInfoSection(): React.ReactNode {
  const { register } = useFormContext<OnboardingFormData>();

  return (
    <section>
      <h2>汽车信息</h2>
      <div>
        <div>
          <label>品牌</label>
          <input {...register('carMake')} />
        </div>
        <div>
          <label>型号</label>
          <input {...register('carModel')} />
        </div>
        <div>
          <label>颜色</label>
          <input {...register('carColor')} />
        </div>
      </div>
    </section>
  );
} 