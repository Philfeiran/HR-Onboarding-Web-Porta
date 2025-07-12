import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import http from '../../utils/https';
import { endpoints } from '../../configs/config';

export interface Employee {
  firstName: string;
  lastName: string;
  ssn: string;
  email: string;
  phone?: string;
  workAuthorizationTitle?: string;
}

export const fetchEmployees = createAsyncThunk<
  Employee[],         // 成功时返回的数据类型
  void,               // 调用时不需要入参
  { rejectValue: string }
>(
  'employees/fetchEmployees',  // 添加动作类型字符串
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get<Employee[]>(endpoints.getAllEmployeesEndpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch employees');
    }
  }
);

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default employeeSlice.reducer;