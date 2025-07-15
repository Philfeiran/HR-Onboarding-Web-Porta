import React, { useState, useEffect } from 'react';
import NavBar from '../navBar/navBar';
import { endpoints } from '../../../configs/config';
import http from '../../../utils/https';
import {type Registration} from '../../../types/registration.types';
// import { OnboadingApplicationReview } from './OnboardingApplicationReview/OnboadingApplicationReview';


export const HiringManagement: React.FC = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [registrations, setRegistrations] = useState<Registration[]>([]);

    const fetchRegistrations = async () => {
        try {
            const response = await http.get<{result: Registration[]}>(endpoints.getAllRegistrationEndpoint);
            setRegistrations(response.data.result);
        } catch (error) {
            console.error('Failed to fetch registrations', error);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleSubmit = async () => {
        if (!name || !email) {
            alert('Please enter both name and email.');
            return;
        }

        try{
            const response = await http.post<{message: string}>(endpoints.sendEmailEndpoint, {email,name});
            alert('Email sent successfully');
            setName('');
            setEmail('');
            fetchRegistrations(); // Refresh the list
        }catch(error){
            console.error('Error sending email:', error);
            alert('Failed to send email');
        }
    }

    return (
        <div>
            <NavBar />
            <div style={{ padding: '20px' }}>
                <h1>Hiring Management</h1>

                <div style={{ marginBottom: '20px' }}>
                    <h2>Invite New Employee</h2>
                    <label>Employee Name: </label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Employee Name"
                    />
                    
                    <label style={{ marginLeft: '10px' }}>Email: </label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Employee Email"
                    />

                    <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Generate token and send email</button>
                </div>

                <hr />

                <div>
                    <h2>Registration History</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg.token}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{reg.name}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{reg.email}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{reg.status ? 'Completed' : 'Pending'}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {!reg.status ? 
                                        `${endpoints.registrationURL}${reg.token}` : 
                                        'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <OnboadingApplicationReview /> */}
        </div>
    )
}