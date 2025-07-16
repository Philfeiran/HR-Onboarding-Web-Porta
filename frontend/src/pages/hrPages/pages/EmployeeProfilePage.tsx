import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { employeeService } from '../../../services/employeeService';
import type Employee from '../../../types/employee.types';

const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams(); // id is now _id
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    employeeService.getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to fetch employee data.');
        setEmployee(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!employee) return <div>No employee found.</div>;

  return (
    <div style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
      <h1>Employee Profile</h1>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 24, background: '#fafbfc' }}>
        <h2>{employee.firstName} {employee.lastName}</h2>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>SSN:</b> {employee.ssn}</p>
        <p><b>Phone:</b> {employee.workPhone || employee.cellPhone || 'N/A'}</p>
        <p><b>Work Authorization:</b> {employee.workAuthorization?.type || 'N/A'}</p>
        <p><b>Address:</b> {employee.currentAddress ? `${employee.currentAddress.building ? employee.currentAddress.building + ', ' : ''}${employee.currentAddress.street}, ${employee.currentAddress.city}, ${employee.currentAddress.state} ${employee.currentAddress.zip}` : 'N/A'}</p>
      </div>
    </div>
  );
};

export default EmployeeProfilePage; 