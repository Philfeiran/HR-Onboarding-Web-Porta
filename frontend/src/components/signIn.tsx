import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';






// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// preview-end



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
        slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
      />
    </AppProvider>
    // preview-end
  );
}
