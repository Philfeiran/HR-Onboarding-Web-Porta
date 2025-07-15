import React, { useState } from 'react';
import { useRegistration } from '../../../../../contexts/RegistrationContext';
import { endpoints } from '../../../../../configs/config';
import http from '../../../../../utils/https';

interface UsernameCheckResponse {
  exists: boolean;
  message: string;
}

export default function UsernameStep() {
  const { registrationData, update, nextStep, prevStep } = useRegistration();
  const [userName, setUserName] = useState(registrationData.userName);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateUsername = (username: string) => {
    return username.length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName) {
      setErrorMessage('请输入用户名');
      return;
    }

    if (!validateUsername(userName)) {
      setErrorMessage('用户名至少2个字符');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    try {
      const response = await http.post<UsernameCheckResponse>(
        endpoints.checkUsernameEndpoint,
        { userName }
      );

      if (response.data.exists) {
        setErrorMessage('该用户名已被使用，请选择其他用户名');
      } else {
        update({ userName });
        nextStep();
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || '验证用户名失败');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="step-content">
      <h3>步骤 2: 选择用户名</h3>
      <p>请选择一个唯一的用户名</p>
      
      <form onSubmit={handleSubmit} className="step-form">
        <div className="form-group">
          <label>用户名*</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="请输入用户名"
            disabled={isValidating}
            autoFocus
          />
          {errorMessage && <span className="error">{errorMessage}</span>}
        </div>

        <div className="button-group">
          <button 
            type="button" 
            onClick={prevStep}
            className="prev-button"
            disabled={isValidating}
          >
            上一步
          </button>
          <button 
            type="submit" 
            disabled={isValidating || !userName}
            className="next-button"
          >
            {isValidating ? '验证中...' : '下一步'}
          </button>
        </div>
      </form>
    </div>
  );
} 