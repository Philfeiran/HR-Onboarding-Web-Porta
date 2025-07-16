export const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl)
const authRoute = `${backendUrl}/api/auth`;
const employeeRoute = `${backendUrl}/api/employees`;
const registrationRoute = `${backendUrl}/api/registration`;
const housingRoute = `${backendUrl}/api/housing`;
const fileRoute = `${backendUrl}/api/files`;

export const endpoints = {
    
    // Endpoints
    loginEndpoint: `${authRoute}/login`,
    registerEndpoint: `${authRoute}/register`,
    checkEmailEndpoint: `${authRoute}/check-email`,
    checkUsernameEndpoint: `${authRoute}/check-username`,


    //employee
    getAllEmployeesEndpoint: `${employeeRoute}`,
    getEmployeeByEmailEndpoint: (email: string) => `${employeeRoute}/${email}`,
    submitOnboardingApplicationEndpoint: `${employeeRoute}/onboarding-application`,
    updateEmployeesPersonalInformationEndpoint: `${employeeRoute}/personal-information`,


    // HR Onboarding Management
    getAllOnboardingApplicationsEndpoint: `${employeeRoute}/hr/onboarding-applications`,
    getApplicationsByStatusEndpoint: (status: string) => `${employeeRoute}/hr/applications/${status}`,
    approveApplicationEndpoint: `${employeeRoute}/hr/approve`,
    rejectApplicationEndpoint: `${employeeRoute}/hr/reject`,
    addHRFeedbackEndpoint: `${employeeRoute}/hr/feedback`,
    updateApplicationStatusEndpoint: `${employeeRoute}/hr/application-status`,

    //registration
    getTokenEndpoint: `${registrationRoute}/create`,
    verifyTokenEndpoint: `${registrationRoute}/verify`,
    setTokenStatusEndpoint: `${registrationRoute}/setStatus`,

    getAllRegistrationEndpoint: `${registrationRoute}`,
    

    //send email
    sendEmailEndpoint: `${registrationRoute}/sendEmail`,


    // Housing endpoints
    getHousingDetailsEndpoint: (email: string) => `${housingRoute}/details/${email}`,
    createHousingDetailsEndpoint: `${housingRoute}/details`,
    updateHousingDetailsEndpoint: `${housingRoute}/details`,
    createFacilityReportEndpoint: `${housingRoute}/facility-reports`,
    getFacilityReportsByEmployeeEndpoint: (email: string) => `${housingRoute}/facility-reports/${email}`,
    getFacilityReportByIdEndpoint: (reportId: string) => `${housingRoute}/facility-reports/report/${reportId}`,
    addCommentToReportEndpoint: `${housingRoute}/facility-reports/comment`,
    updateReportStatusEndpoint: `${housingRoute}/facility-reports/status`,
    getAllFacilityReportsEndpoint: `${housingRoute}/facility-reports`,

    registrationURL: `http://localhost:5173/registration?token=`,

    //file upload endpoints
    uploadFileEndpoint: `${fileRoute}/upload`,
    getUserFilesEndpoint: (username: string) => `${fileRoute}/user/${username}/files`,
}

console.log(endpoints)