// import React, { useState } from 'react';

// // 1. 定义类型
// type ApplicationStatus = 'pending' | 'rejected' | 'approved';

// interface Application {
//   id: string;
//   fullName: string;
//   email: string;
//   status: ApplicationStatus;
//   applicationUrl: string;
//   feedback?: string;
// }

// interface DashboardProps {
//   applications: Application[];
// }

// // 2. 子组件：渲染三个区块
// const ApplicationDashboard: React.FC<DashboardProps> = ({ applications }) => {
//   const [apps, setApps] = useState(applications);

//   const handleApprove = (id: string) => {
//     setApps(apps.map(a => a.id === id ? { ...a, status: 'approved' } : a));
//   };

//   const handleReject = (id: string) => {
//     const feedback = window.prompt('请输入反馈意见') || '';
//     setApps(apps.map(a =>
//       a.id === id ? { ...a, status: 'rejected', feedback } : a
//     ));
//   };

//   const renderList = (status: ApplicationStatus) => {
//     return (
//       <section style={{ marginBottom: 24 }}>
//         <h2 style={{ textTransform: 'capitalize' }}>{status}</h2>
//         {apps.filter(a => a.status === status).map(a => (
//           <div key={a.id}
//                style={{
//                  display: 'flex',
//                  alignItems: 'center',
//                  marginBottom: 8,
//                }}>
//             <div style={{ flex: 1 }}>
//               <div><strong>{a.fullName}</strong></div>
//               <div>{a.email}</div>
//             </div>
//             <button
//               style={{ marginRight: 8 }}
//               onClick={() => window.open(a.applicationUrl, '_blank')}>
//               View Application
//             </button>
//             {status === 'pending' && (
//               <>
//                 <button
//                   style={{ marginRight: 4 }}
//                   onClick={() => handleApprove(a.id)}>
//                   Approve
//                 </button>
//                 <button onClick={() => handleReject(a.id)}>
//                   Reject
//                 </button>
//               </>
//             )}
//           </div>
//         ))}
//       </section>
//     );
//   };

//   return (
//     <div style={{ padding: 16 }}>
//       {renderList('pending')}
//       {renderList('rejected')}
//       {renderList('approved')}
//     </div>
//   );
// };


// // 3. 父组件：提供 Mock 数据 并渲染 Dashboard
// const App: React.FC = () => {
//   const mockApplications: Application[] = [
//     {
//       id: '1',
//       fullName: 'Alice Johnson',
//       email: 'alice@example.com',
//       status: 'pending',
//       applicationUrl: 'https://example.com/form/1',
//     },
//     {
//       id: '2',
//       fullName: 'Bob Smith',
//       email: 'bob@example.com',
//       status: 'rejected',
//       applicationUrl: 'https://example.com/form/2',
//       feedback: '请补充教育经历',
//     },
//     {
//       id: '3',
//       fullName: 'Charlie Lee',
//       email: 'charlie@example.com',
//       status: 'approved',
//       applicationUrl: 'https://example.com/form/3',
//     },
//     {
//       id: '4',
//       fullName: 'Dana White',
//       email: 'dana@example.com',
//       status: 'pending',
//       applicationUrl: 'https://example.com/form/4',
//     },
//   ];

//   return <ApplicationDashboard applications={mockApplications} />;
// };

// export default OnboadingApplicationReview;







