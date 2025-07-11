// frontend/src/pages/HRDashboard.tsx
import React, { useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import EmployeeNavbar from "../../employeeNavbar/EmployeeNavbar";
import { fetchEmployeeByEmail } from "../../../../redux/slice/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import { Link } from "react-router-dom";

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { currentEmployee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    dispatch(fetchEmployeeByEmail(user?.email || ""));
  }, [dispatch]);

  return (
    <div>
      <EmployeeNavbar />
      <h1>员工面板</h1>
      <p>欢迎，{user?.userName}！</p>
      {currentEmployee?.status === "Never Submitted" && (
        <p>
          您还没有提交入职申请，请前往
          <Link to="/employee/onboarding-application">入职申请页面</Link>
          完成申请。
        </p>
      )}
      {currentEmployee?.status === "Pending" && (
        <p>
          您的入职申请正在审核中，请耐心等待。
        </p>
      )}
      {currentEmployee?.status === "Rejected" && (
        <p>
          您的入职申请被拒绝，原因为：{}，请使用<Link to="/employee/onboarding-application">入职申请页面</Link>重新提交入职申请：
        </p>
      )}
      {currentEmployee?.status === "Approved" && (
        <p>
          您的入职申请已被批准，请前往<Link to="/employee/profile">个人资料页面</Link>完善您的信息。
        </p>
      )}
      
    </div>
  );
};
