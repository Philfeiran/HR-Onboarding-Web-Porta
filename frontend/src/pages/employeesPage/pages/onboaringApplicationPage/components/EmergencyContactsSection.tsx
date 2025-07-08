import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingApplication.types';

export function EmergencyContactsSection(): React.ReactNode {
  const { register, control, formState: { errors } } = useFormContext<OnboardingFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts',
  });

  return (
    <section>
      <h2>紧急联系人</h2>
      <p>至少需要一个紧急联系人</p>
      
      {fields.map((field, index) => (
        <div key={field.id}>
          <div>
            <h3>紧急联系人 {index + 1}</h3>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)}>
                删除
              </button>
            )}
          </div>
          
          <div>
            <div>
              <label>
                名字 <span>*</span>
              </label>
              <input {...register(`emergencyContacts.${index}.firstName`)} />
              {errors.emergencyContacts?.[index]?.firstName && (
                <p>{errors.emergencyContacts[index]?.firstName?.message}</p>
              )}
            </div>
            <div>
              <label>
                姓氏 <span>*</span>
              </label>
              <input {...register(`emergencyContacts.${index}.lastName`)} />
              {errors.emergencyContacts?.[index]?.lastName && (
                <p>{errors.emergencyContacts[index]?.lastName?.message}</p>
              )}
            </div>
            <div>
              <label>中间名</label>
              <input {...register(`emergencyContacts.${index}.middleName`)} />
            </div>
            <div>
              <label>
                电话 <span>*</span>
              </label>
              <input {...register(`emergencyContacts.${index}.phone`)} />
              {errors.emergencyContacts?.[index]?.phone && (
                <p>{errors.emergencyContacts[index]?.phone?.message}</p>
              )}
            </div>
            <div>
              <label>
                邮箱 <span>*</span>
              </label>
              <input type="email" {...register(`emergencyContacts.${index}.email`)} />
              {errors.emergencyContacts?.[index]?.email && (
                <p>{errors.emergencyContacts[index]?.email?.message}</p>
              )}
            </div>
            <div>
              <label>
                关系 <span>*</span>
              </label>
              <input {...register(`emergencyContacts.${index}.relationship`)} />
              {errors.emergencyContacts?.[index]?.relationship && (
                <p>{errors.emergencyContacts[index]?.relationship?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() =>
          append({
            firstName: '',
            lastName: '',
            middleName: '',
            phone: '',
            email: '',
            relationship: '',
          })
        }
      >
        添加紧急联系人
      </button>
    </section>
  );
} 