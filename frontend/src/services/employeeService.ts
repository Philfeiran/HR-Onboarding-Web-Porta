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

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await http.get(`${endpoints.getAllEmployeesEndpoint}/id/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('无法获取员工信息');
    }
  },

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await http.post(endpoints.uploadFileEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 假设后端返回的数据结构是 { url: string } 或者直接是 url 字符串
      return response.data.url || response.data;
    } catch (error: any) {
      console.error("文件上传失败:", error);
      throw new Error("文件上传失败，请稍后重试");
    }
  },
};
