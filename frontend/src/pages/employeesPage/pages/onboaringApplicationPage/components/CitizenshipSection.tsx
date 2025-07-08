import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

interface CitizenshipSectionProps {
  setOptReceipt: (file: File | null) => void;
}

export function CitizenshipSection({ setOptReceipt }: CitizenshipSectionProps): React.ReactNode {
  const { register, watch } = useFormContext<OnboardingFormData>();
  const isPermanentResidentOrCitizen = watch('isPermanentResidentOrCitizen');
  const workAuthorizationType = watch('workAuthorizationType');

  return (
    <section>
      <h2>公民身份</h2>
      <div>
        <div>
          <label>
            您是美国公民或永久居民吗？ <span>*</span>
          </label>
          <div>
            <label>
              <input type="radio" {...register('isPermanentResidentOrCitizen')} value="true" />
              是的
            </label>
            <label>
              <input type="radio" {...register('isPermanentResidentOrCitizen')} value="false" />
              不是
            </label>
          </div>
        </div>

        {isPermanentResidentOrCitizen === 'true' && (
          <div>
            <label>
              选择您的身份 <span>*</span>
            </label>
            <select {...register('citizenshipStatus')}>
              <option value="">请选择</option>
              <option value="Green Card">绿卡</option>
              <option value="Citizen">公民</option>
            </select>
          </div>
        )}

        {isPermanentResidentOrCitizen === 'false' && (
          <div>
            <div>
              <label>
                您的工作授权是什么？ <span>*</span>
              </label>
              <select {...register('workAuthorizationType')}>
                <option value="">请选择</option>
                <option value="H1-B">H1-B</option>
                <option value="L2">L2</option>
                <option value="F1(CPT/OPT)">F1(CPT/OPT)</option>
                <option value="H4">H4</option>
                <option value="Other">其他</option>
              </select>
            </div>

            {workAuthorizationType === 'Other' && (
              <div>
                <label>请指定签证类型</label>
                <input {...register('workAuthorizationOther')} />
              </div>
            )}

            {workAuthorizationType === 'F1(CPT/OPT)' && (
              <div>
                <label>上传OPT收据</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setOptReceipt(e.target.files?.[0] || null)}
                />
              </div>
            )}

            <div>
              <div>
                <label>开始日期</label>
                <input type="date" {...register('workAuthorizationStartDate')} />
              </div>
              <div>
                <label>结束日期</label>
                <input type="date" {...register('workAuthorizationEndDate')} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 