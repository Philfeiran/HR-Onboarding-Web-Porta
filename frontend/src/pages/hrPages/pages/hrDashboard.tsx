// frontend/src/pages/HRDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../../contexts/AuthContext";
import NavBar from '../navBar/navBar';

export const HRDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <NavBar/>
      <h1>HR管理面板</h1>
      <p>欢迎，{user?.userName}！</p>
      
      <div>
        <h2>HR功能</h2>
        <Link to="/onboarding-review">审核入职申请</Link>
        <Link to="/employee-management">员工管理</Link>
      </div>
    </div>
  );
};