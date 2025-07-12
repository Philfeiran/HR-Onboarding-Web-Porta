import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees } from '../../../redux/slice/employeeSlice';
import type { Employee } from '../../../redux/slice/employeeSlice';
import type { RootState, AppDispatch } from '../../../redux/store';
import NavBar from '../navBar/navBar';

export const employeeProfiles: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error } = useSelector((state: RootState) => state.employee);
    const [searchTerm, setSearchTerm] = useState('');

    // 获取员工数据
    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    // 搜索功能 - 支持 firstName, lastName
    const filteredEmployees = useMemo(() => {
        if (!searchTerm.trim()) return employees;
        
        return employees.filter(employee => 
            (employee.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    // 按姓氏字母排序
    const sortedEmployees = useMemo(() => {
        return [...filteredEmployees].sort((a, b) => 
            (a.lastName || '').localeCompare(b.lastName || '')
        );
    }, [filteredEmployees]);

    // 打开员工详细信息（新标签页）
    const openEmployeeProfile = (employee: Employee) => {
        const profileData = {
            name: `${employee.firstName || ''} ${employee.lastName || ''}`,
            ssn: employee.ssn,
            email: employee.email,
        };
        
        // 创建新窗口显示员工详细信息
        const newWindow = window.open('', '_blank', 'width=600,height=400');
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Employee Profile - ${profileData.name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .profile-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
                            .profile-item { margin: 10px 0; }
                            .label { font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="profile-card">
                            <h1>Employee Profile</h1>
                            <div class="profile-item">
                                <span class="label">Name:</span> ${profileData.name}
                            </div>
                            <div class="profile-item">
                                <span class="label">SSN:</span> ${profileData.ssn}
                            </div>
                            <div class="profile-item">
                                <span class="label">Email:</span> ${profileData.email}
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }
    };

    // 渲染搜索结果状态
    const renderSearchResults = () => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        
        if (searchTerm && filteredEmployees.length === 0) {
            return <div>No employees found matching "{searchTerm}"</div>;
        }
        
        if (searchTerm && filteredEmployees.length === 1) {
            return <div>Found 1 employee matching "{searchTerm}"</div>;
        }
        
        if (searchTerm && filteredEmployees.length > 1) {
            return <div>Found {filteredEmployees.length} employees matching "{searchTerm}"</div>;
        }
        
        return null;
    };

    return (
        <div>
            <NavBar />
            <div style={{ padding: '20px' }}>
                <h1>Employee Profiles</h1>
                
                {/* 总员工数量 */}
                <div style={{ marginBottom: '20px' }}>
                    <h2>Total Employees: {employees.length}</h2>
                </div>

                {/* 搜索栏 */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search by first name or last name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                {/* 搜索结果状态 */}
                {renderSearchResults()}

                {/* 员工列表 */}
                <div style={{ marginTop: '20px' }}>
                    {loading ? (
                        <div>Loading employees...</div>
                    ) : error ? (
                        <div>Error loading employees: {error}</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        Full Name
                                    </th>
                            
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        SSN
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        Work Authorization Title
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        Phone Number
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEmployees.map((employee, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                            <button
                                                onClick={() => openEmployeeProfile(employee)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#007bff',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {employee.firstName || ''} {employee.lastName || ''}
                                            </button>
                                        </td>
                                        {/* SSN */}
                                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                            {employee.ssn}
                                        </td>
                                        {/* Work Authorization Title */}
                                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                            {employee.workAuthorizationTitle || 'N/A'}
                                        </td>
                                        {/* Phone Number */}
                                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                            {employee.phone || 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                            {employee.email}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};