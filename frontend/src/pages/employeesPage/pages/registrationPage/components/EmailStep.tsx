import React, { useState } from 'react';
import { useRegistration } from '../../../../../contexts/RegistrationContext';
import { endpoints } from '../../../../../configs/config';
import http from '../../../../../utils/https';

interface EmailCheckResponse {
  exists: boolean;
  message: string;
}

export default function EmailStep() {
  const { registrationData, update, nextStep } = useRegistration();
  const [email, setEmail] = useState(registrationData.email);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('请输入邮箱地址');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('请输入有效的邮箱地址');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    try {
      const response = await http.post<EmailCheckResponse>(
        endpoints.checkEmailEndpoint,
        { email }
      );

      if (response.data.exists) {
        setErrorMessage('该邮箱已被注册，请使用其他邮箱');
      } else {
        update({ email });
        nextStep();
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || '验证邮箱失败');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="step-content">
      <h3>步骤 1: 输入邮箱</h3>
      <p>请输入您的邮箱地址</p>
      
      <form onSubmit={handleSubmit} className="step-form">
        <div className="form-group">
          <label>邮箱地址*</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱地址"
            disabled={isValidating}
            autoFocus
          />
          {errorMessage && <span className="error">{errorMessage}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isValidating || !email}
          className="next-button"
        >
          {isValidating ? '验证中...' : '下一步'}
        </button>
      </form>
    </div>
  );
} 