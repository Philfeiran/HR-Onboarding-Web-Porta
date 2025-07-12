import { AppProvider } from '@toolpad/core/AppProvider';

import { useTheme } from '@mui/material/styles';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';






// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// preview-end

// const providers = [
//   { id: 'credentials', name: 'Email and Password' },
//   { id: 'google',      name: 'Sign in with Google' },
//   { id: 'github',      name: 'Sign in with GitHub' },
// ];




export default function CredentialsSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {login} = useAuth();

  const signIn: (provider: AuthProvider, formData: FormData) => void = async (
    provider,
    formData,
  ) => {
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      const result = await authService.login({ email, password });
      
      login(result)
      if(result.role === 'HR'){
        navigate('/hr')
      }else if(result.role === 'Employee'){
        navigate('/employee')
      }
      
    } catch (error) {
      alert(`登录失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ 
          emailField: { autoFocus: false }
          , form: { noValidate: true }
          // ,forgotPasswordLink: { href: '/forgot' }
          
          ,rememberMe:        { label: '下次自动登录' }
          // ,submitButton: { fullWidth: true, variant: 'contained' }
        }}
      />
    </AppProvider>
    // preview-end
  );
}
