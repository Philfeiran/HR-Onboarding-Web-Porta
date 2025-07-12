export const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl)
const authRoute = `${backendUrl}/api/auth`;
const employeeRoute = `${backendUrl}/api/employees`;
const registrationRoute = `${backendUrl}/api/registration`;

export const endpoints = {
    
    // Endpoints
    loginEndpoint: `${authRoute}/login`,
    registerEndpoint: `${authRoute}/register`,


    //employee
    getAllEmployeesEndpoint: `${employeeRoute}`,
    getEmployeeByEmailEndpoint: (email: string) => `${employeeRoute}/${email}`,
    submitOnboardingApplicationEndpoint: `${employeeRoute}/onboarding-application`,
    updateEmployeesPersonalInformationEndpoint: `${employeeRoute}/personal-information`,

    //registration
    getTokenEndpoint: `${registrationRoute}/create`,
    verifyTokenEndpoint: `${registrationRoute}/verify`,
    setTokenStatusEndpoint: `${registrationRoute}/setStatus`,

    getAllRegistrationEndpoint: `${registrationRoute}`,

    registrationURL: `http://localhost:5173/registration?token=`,
}

console.log(endpoints)