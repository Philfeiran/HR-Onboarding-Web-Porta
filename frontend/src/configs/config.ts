export const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl)
const authRoute = `${backendUrl}/api/auth`;
const employeeRoute = `${backendUrl}/api/employees`;
const registrationRoute = `${backendUrl}/api/registration`;
const housingRoute = `${backendUrl}/api/housing`;
const visaStatusRoute = `${backendUrl}/api/visa-status`;

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

    //registration
    sendEmailEndpoint: `${registrationRoute}/sendEmail`,
    verifyTokenEndpoint: `${registrationRoute}/verify`,
    setTokenStatusEndpoint: `${registrationRoute}/setStatus`,

    getAllRegistrationEndpoint: `${registrationRoute}`,

    // Housing endpoints
    getHousingDetailsEndpoint: (email: string) => `${housingRoute}/details/${email}`,
    getAllHousingDetailsEndpoint: `${housingRoute}/details`,
    createHousingDetailsEndpoint: `${housingRoute}/details`,
    updateHousingDetailsEndpoint: `${housingRoute}/details`,
    createFacilityReportEndpoint: `${housingRoute}/facility-reports`,
    getFacilityReportsByEmployeeEndpoint: (email: string) => `${housingRoute}/facility-reports/${email}`,
    getFacilityReportByIdEndpoint: (reportId: string) => `${housingRoute}/facility-reports/report/${reportId}`,
    addCommentToReportEndpoint: `${housingRoute}/facility-reports/comment`,
    updateReportStatusEndpoint: `${housingRoute}/facility-reports/status`,
    getAllFacilityReportsEndpoint: `${housingRoute}/facility-reports`,

    // Visa Status endpoints
    getVisaStatusEndpoint: (employeeId: string) => `${visaStatusRoute}/${employeeId}`,
    getVisaStatusByEmailEndpoint: (email: string) => `${visaStatusRoute}/email/${email}`,
    createVisaStatusEndpoint: `${visaStatusRoute}`,
    uploadDocumentEndpoint: `${visaStatusRoute}/upload`,
    approveDocumentEndpoint: `${visaStatusRoute}/approve`,
    getPendingDocumentsEndpoint: `${visaStatusRoute}/pending`,
    getAllVisaStatusesEndpoint: `${visaStatusRoute}`,

    registrationURL: `http://localhost:5173/registration?token=`,
}

console.log(endpoints)