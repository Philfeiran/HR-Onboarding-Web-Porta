import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function ReferenceSection(): React.ReactNode {
  const { register } = useFormContext<OnboardingFormData>();

  return (
    <section>
      <h2>推荐人（可选）</h2>
      <p>谁推荐您到这家公司？（只能有一个推荐人）</p>
      <div>
        <div>
          <label>名字</label>
          <input {...register('referenceFirstName')} />
        </div>
        <div>
          <label>姓氏</label>
          <input {...register('referenceLastName')} />
        </div>
        <div>
          <label>中间名</label>
          <input {...register('referenceMiddleName')} />
        </div>
        <div>
          <label>电话</label>
          <input {...register('referencePhone')} />
        </div>
        <div>
          <label>邮箱</label>
          <input type="email" {...register('referenceEmail')} />
        </div>
        <div>
          <label>关系</label>
          <input {...register('referenceRelationship')} />
        </div>
      </div>
    </section>
  );
} 