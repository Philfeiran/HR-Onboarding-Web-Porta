import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HRDashboard } from './pages/hrPages/pages/hrDashboard';
import { employeeProfiles as EmployeeProfiles } from './pages/hrPages/pages/employeeProfiles';
import LoginPage from './pages/loginPage';
import { HiringManagement } from './pages/hrPages/pages/hiringManagement';
import HousingManagement from './pages/hrPages/pages/housingManagement/HousingManagement';
import HousingAssignment from './pages/hrPages/pages/housingAssignment/HousingAssignment';
import RegistrationPage from './pages/employeesPage/pages/registration';
import OnboardingApplicationPage from './pages/employeesPage/pages/onboaringApplicationPage/onboardingApplication.page';
import { EmployeeDashboardPage } from './pages/employeesPage/pages/employeeDashBoardPage/EmployeeDashboardPage';
import PersonalInformationPage from './pages/employeesPage/pages/personalInformationPage/PersonalInformationPage';
import HousingPage from './pages/employeesPage/pages/housingPage/HousingPage';
import FacilityReportsPage from './pages/employeesPage/pages/facilityReportsPage/FacilityReportsPage';
import FacilityReportDetailPage from './pages/employeesPage/pages/facilityReportDetailPage/FacilityReportDetailPage';

function App() {
  const {isAuthenticated,user} = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated?<Navigate to={user?.role === 'HR' ? "/hr" : "/employee"} replace/>:<LoginPage/>}/>

      <Route path="/registration" element={<RegistrationPage />} />

      <Route path="/hr" element={<ProtectedRoute requiredRole="HR"><HRDashboard/></ProtectedRoute>}/>
      <Route path="/hr/employees" element={<ProtectedRoute requiredRole="HR"><EmployeeProfiles/></ProtectedRoute>}/>
      <Route path="/hr/hiring" element={<ProtectedRoute requiredRole="HR"><HiringManagement/></ProtectedRoute>}/>
      <Route path="/hr/housing" element={<ProtectedRoute requiredRole="HR"><HousingManagement/></ProtectedRoute>}/>
      <Route path="/hr/housing-assignment" element={<ProtectedRoute requiredRole="HR"><HousingAssignment/></ProtectedRoute>}/>
     
      {/* 员工端路由 */}
      <Route 
        path="/employee" 
        element={<ProtectedRoute requiredRole='Employee'><EmployeeDashboardPage /></ProtectedRoute>}
      />
      <Route 
        path="/employee/onboarding-application" 
        element={<ProtectedRoute requiredRole='Employee'><OnboardingApplicationPage/></ProtectedRoute>}
      />
      <Route 
        path="/employee/personal-information" 
        element={<ProtectedRoute requiredRole='Employee'><PersonalInformationPage/></ProtectedRoute>}
      />
      <Route 
        path="/employee/housing" 
        element={<ProtectedRoute requiredRole='Employee'><HousingPage/></ProtectedRoute>}
      />
      <Route 
        path="/employee/facility-reports" 
        element={<ProtectedRoute requiredRole='Employee'><FacilityReportsPage/></ProtectedRoute>}
      />
      <Route 
        path="/employee/facility-reports/:reportId" 
        element={<ProtectedRoute requiredRole='Employee'><FacilityReportDetailPage/></ProtectedRoute>}
      />

      {/* 默认路由 */} 
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? (user?.role === 'HR' ? "/hr" : "/employee") : "/login"} replace />} 
      />
      
      {/* 404处理 */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? (user?.role === 'HR' ? "/hr" : "/employee") : "/login"} replace />} 
      />
    </Routes>
  )
}

export default App
