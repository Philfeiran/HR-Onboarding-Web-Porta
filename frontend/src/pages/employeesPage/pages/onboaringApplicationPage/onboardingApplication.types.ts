import { z } from 'zod';


export const onboardingApplicationSchema = z.object({
    // 姓名
    firstName: z.string().min(1, '名字是必填项'),
    lastName: z.string().min(1, '姓氏是必填项'),
    middleName: z.string().optional(),
    preferredName: z.string().optional(),
  
    // 地址
    building: z.string().optional(),
    street: z.string().min(1, '街道地址是必填项'),
    city: z.string().min(1, '城市是必填项'),
    state: z.string().min(1, '州/省是必填项'),
    zip: z.string().min(1, '邮政编码是必填项'),
  
    // 电话
    cellPhone: z.string().min(1, '手机号码是必填项'),
    workPhone: z.string().optional(),
  
    // 汽车信息
    carMake: z.string().optional(),
    carModel: z.string().optional(),
    carColor: z.string().optional(),
  
    // 个人信息
    ssn: z.string().min(1, 'SSN is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['male', 'female', 'I do not wish to answer'], {
      required_error: 'Gender is required',
    }),
  
    // 公民身份
      // Case 1: Permanent Resident or Citizen
    isPermanentResidentOrCitizen: z.string({
      required_error: 'Please select an option',
    }),
    citizenshipStatus: z.enum(['Green Card', 'Citizen']).optional(),

      // Case 2: Work Authorization
    workAuthorizationType: z.enum(['H1-B', 'L2', 'F1(CPT/OPT)', 'H4', 'Other']).optional(),

      // Case 3: Other Work Authorization
    workAuthorizationOther: z.string().optional(),


    workAuthorizationStartDate: z.string().optional(),
    workAuthorizationEndDate: z.string().optional(),
  
    // 驾照
    hasDriversLicense: z.string({
      required_error: 'Please select an option',
    }),
    driversLicenseNumber: z.string().optional(),
    driversLicenseExpiration: z.string().optional(),
  
    // 推荐人
    referenceFirstName: z.string().optional(),
    referenceLastName: z.string(),
    referenceMiddleName: z.string().optional(),
    referencePhone: z.string(),
    referenceEmail: z.string().email().or(z.literal('')),
    referenceRelationship: z.string(),
  
    // 紧急联系人
    emergencyContacts: z.array(z.object({
      firstName: z.string().min(1, '紧急联系人姓名是必填项'),
      lastName: z.string().min(1, '紧急联系人姓氏是必填项'),
      middleName: z.string().optional(),
      phone: z.string().min(1, '紧急联系人电话是必填项'),
      email: z.string().email('请输入有效的邮箱地址'),
      relationship: z.string().min(1, '关系是必填项'),
    })).min(1, '至少需要一个紧急联系人'),
});

export type OnboardingFormData = z.infer<typeof onboardingApplicationSchema>;