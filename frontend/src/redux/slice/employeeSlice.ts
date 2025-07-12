import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import http from "../../utils/https";
import { endpoints } from "../../configs/config";
import type Employee from "../../types/employee.types";

export const fetchEmployees = createAsyncThunk<
  Employee[], // 成功时返回的数据类型
  void, // 调用时不需要入参
  { rejectValue: string }
>(
  "employees/fetchEmployees", // 添加动作类型字符串
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get<Employee[]>(
        endpoints.getAllEmployeesEndpoint
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch employees");
    }
  }
);

export const fetchEmployeeByEmail = createAsyncThunk<
  Employee,            // ✅ 成功时返回的数据类型
  string,              // ✅ 入参类型：email
  { rejectValue: string }
>(
  "employees/fetchEmployeeByEmail", // ✅ Action type
  async (email, { rejectWithValue }) => {
    try {
      console.log(endpoints.getEmployeeByEmailEndpoint(email));
      const response = await http.get<Employee>(
        endpoints.getEmployeeByEmailEndpoint(email)
      );
      
      console.log("Fetched employee by email:", response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch employee by email");
    }
  }
);

interface EmployeeState {
  employees: Employee[];
  currentEmployee?: Employee | null; // 当前员工信息
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null, // 初始化为null
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    resetCurrentEmployee(state) {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== fetchEmployees ==========
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ========== fetchEmployeeByEmail ==========
      .addCase(fetchEmployeeByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentEmployee = null;
      })
      .addCase(fetchEmployeeByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentEmployee = null;
      });
  },
});

export const { resetCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
