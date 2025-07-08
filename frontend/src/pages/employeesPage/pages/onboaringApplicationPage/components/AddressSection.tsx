import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function AddressSection(): React.ReactNode {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <section>
      <h2>当前地址</h2>
      <div>
        <div>
          <label>楼号/公寓号</label>
          <input {...register('building')} />
        </div>
        <div>
          <label>
            街道地址 <span>*</span>
          </label>
          <input {...register('street')} />
          {errors.street && <p>{errors.street.message}</p>}
        </div>
        <div>
          <label>
            城市 <span>*</span>
          </label>
          <input {...register('city')} />
          {errors.city && <p>{errors.city.message}</p>}
        </div>
        <div>
          <label>
            州/省 <span>*</span>
          </label>
          <input {...register('state')} />
          {errors.state && <p>{errors.state.message}</p>}
        </div>
        <div>
          <label>
            邮政编码 <span>*</span>
          </label>
          <input {...register('zip')} />
          {errors.zip && <p>{errors.zip.message}</p>}
        </div>
      </div>
    </section>
  );
} 