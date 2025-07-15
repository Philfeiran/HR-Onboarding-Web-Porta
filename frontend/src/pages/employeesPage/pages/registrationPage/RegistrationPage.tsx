import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRegistration } from '../../../../contexts/RegistrationContext';
import { useAuth } from '../../../../contexts/AuthContext';
import TrueFocus from '../../../../components/TrueFocus';
import EmailStep from './components/EmailStep';
import UsernameStep from './components/UsernameStep';
import PasswordStep from './components/PasswordStep';
import { endpoints } from '../../../../configs/config';
import http from '../../../../utils/https';
import logo from '../../../../assets/logo1.png';
import './RegistrationPage.css';

interface TokenVerificationResponse {
  message: string;
  status: string;
}

interface RegistrationResponse {
  user: any;
  token: string;
}

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { currentStep, registrationData } = useRegistration();
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const token = searchParams.get('token');

  // 验证token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setErrorMessage('缺少注册token');
        setIsLoading(false);
        return;
      }

      try {
        const response = await http.post<TokenVerificationResponse>(
          endpoints.verifyTokenEndpoint,
          { token }
        );
        
        if (response.status === 200) {
          setTokenValid(true);
        } else {
          setErrorMessage(response.data.message || '无效的注册链接');
        }
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || '验证token失败');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleFinalSubmit = async (password: string) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await http.post<RegistrationResponse>(
        endpoints.registerEndpoint,
        {
          userName: registrationData.userName,
          email: registrationData.email,
          password: password,
          url_token: token
        }
      );

      // 注册成功后自动登录
      login({
        role: 'Employee',
        userName: registrationData.userName,
        email: registrationData.email
      });

      navigate('/employee');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || '注册失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep />;
      case 2:
        return <UsernameStep />;
      case 3:
        return <PasswordStep onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />;
      default:
        return <EmailStep />;
    }
  };

  if (isLoading) {
    return (
      <div className="registration-container">
        <div className="brand-section">
          <div className="brand-content">
            <TrueFocus 
              sentence="Pilot Technologies"
              manualMode={false}
              blurAmount={5}
              borderColor="#18b3fe"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
          </div>
          <div className="logo-container">
            <img src={logo} alt="logo" className="company-logo" />
          </div>
        </div>
        <div className="form-section">
          <div className="registration-card">
            <div className="loading">验证注册链接中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="registration-container">
        <div className="brand-section">
          <div className="brand-content">
            <TrueFocus 
              sentence="Pilot Technologies"
              manualMode={false}
              blurAmount={5}
              borderColor="#18b3fe"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
          </div>
          <div className="logo-container">
            <img src={logo} alt="logo" className="company-logo" />
          </div>
        </div>
        <div className="form-section">
          <div className="registration-card">
            <div className="error-message">
              <h2>注册链接无效</h2>
              <p>{errorMessage}</p>
              <button onClick={() => navigate('/login')}>返回登录</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="brand-section">
        <div className="brand-content">
          <TrueFocus 
            sentence="Pilot Technologies"
            manualMode={false}
            blurAmount={5}
            borderColor="#18b3fe"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>
        <div className="logo-container">
          <img src={logo} alt="logo" className="company-logo" />
        </div>
      </div>
      
      <div className="form-section">
        <div className="registration-card">
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          </div>
          
          <h2>员工注册</h2>
          
          {renderStep()}
          
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 