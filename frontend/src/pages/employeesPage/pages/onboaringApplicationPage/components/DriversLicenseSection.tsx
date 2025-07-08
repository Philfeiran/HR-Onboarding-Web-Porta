import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

interface DriversLicenseSectionProps {
  setDriversLicenseCopy: (file: File | null) => void;
}

export function DriversLicenseSection({ setDriversLicenseCopy }: DriversLicenseSectionProps): React.ReactNode {
  const { register, watch } = useFormContext<OnboardingFormData>();
  const hasDriversLicense = watch('hasDriversLicense');

  return (
    <section>
      <h2>驾照信息</h2>
      <div>
        <div>
          <label>
            您有驾照吗？ <span>*</span>
          </label>
          <div>
            <label>
              <input type="radio" {...register('hasDriversLicense')} value="true" />
              是的
            </label>
            <label>
              <input type="radio" {...register('hasDriversLicense')} value="false" />
              没有
            </label>
          </div>
        </div>

        {hasDriversLicense === 'true' && (
          <div>
            <div>
              <div>
                <label>驾照号码</label>
                <input {...register('driversLicenseNumber')} />
              </div>
              <div>
                <label>到期日期</label>
                <input type="date" {...register('driversLicenseExpiration')} />
              </div>
            </div>
            <div>
              <label>上传驾照副本</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDriversLicenseCopy(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 