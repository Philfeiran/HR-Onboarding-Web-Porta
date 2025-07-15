import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface RegistrationData {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationContextType {
    registrationData: RegistrationData;
    currentStep: number;
    update: (vals: Partial<RegistrationData>) => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistration = () => {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
}

export function RegistrationProvider({ children }: { children: ReactNode }) {
    const [registrationData, setRegistrationData] = useState<RegistrationData>({
        email: '',
        userName: '',
        password: '',
        confirmPassword: ''
    });

    const [currentStep, setCurrentStep] = useState(1);

    const update = (vals: Partial<RegistrationData>) => {
        setRegistrationData(prev => ({
          ...prev,
          ...vals,
        }));
      };

    const setStep = (step: number) => {
        setCurrentStep(step);
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    return (
        <RegistrationContext.Provider value={{ 
            registrationData, 
            currentStep, 
            update, 
            setStep,
            nextStep,
            prevStep
        }}>
            {children}
        </RegistrationContext.Provider>
    );
}
    