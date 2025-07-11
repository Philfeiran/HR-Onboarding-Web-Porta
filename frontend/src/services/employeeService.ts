import http from "../utils/https";
import { endpoints } from "../configs/config";
import type Employee from "../types/employee.types";

export const employeeService = {
  async submitOnboardingApplication(
    email: string,
    dataToSubmit: Partial<Employee>
  ): Promise<void> {
    try {
      const response = await http.post(
        endpoints.submitOnboardingApplicationEndpoint,
        { email, dataToSubmit }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("提交失败，请稍后重试");
    }
  },

  async updateEmployeePersonalInformationByEmail(
    email: string,
    dataToUpdate: Partial<Employee>
  ): Promise<void> {
    try {
      const response = await http.put(
        endpoints.updateEmployeesPersonalInformationEndpoint,
        { email, dataToUpdate }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("更新个人信息失败，请稍后重试");
    }
  },
};
