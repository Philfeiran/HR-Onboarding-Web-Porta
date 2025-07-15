import React, { useState } from 'react';
import { useRegistration } from '../../../../../contexts/RegistrationContext';

interface PasswordStepProps {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
}

export default function PasswordStep({ onSubmit, isSubmitting }: PasswordStepProps) {
  const { registrationData, update, prevStep } = useRegistration();
  const [password, setPassword] = useState(registrationData.password);
  const [confirmPassword, setConfirmPassword] = useState(registrationData.confirmPassword);
  const [errorMessage, setErrorMessage] = useState('');

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setErrorMessage('请输入密码');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('密码至少6个字符');
      return;
    }

    if (!confirmPassword) {
      setErrorMessage('请确认密码');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('两次输入的密码不一致');
      return;
    }

    setErrorMessage('');
    update({ password, confirmPassword });
    onSubmit(password);
  };

  return (
    <div className="step-content">
      <h3>步骤 3: 设置密码</h3>
      <p>请设置您的登录密码</p>
      
      <form onSubmit={handleSubmit} className="step-form">
        <div className="form-group">
          <label>密码*</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码（至少6个字符）"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>确认密码*</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
            disabled={isSubmitting}
          />
        </div>

        {errorMessage && <span className="error">{errorMessage}</span>}

        <div className="button-group">
          <button 
            type="button" 
            onClick={prevStep}
            className="prev-button"
            disabled={isSubmitting}
          >
            上一步
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting || !password || !confirmPassword}
            className="submit-button"
          >
            {isSubmitting ? '注册中...' : '完成注册'}
          </button>
        </div>
      </form>
    </div>
  );
} 