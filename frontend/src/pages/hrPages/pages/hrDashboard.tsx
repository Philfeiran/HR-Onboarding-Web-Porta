// frontend/src/pages/HRDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../../contexts/AuthContext";
import NavBar from '../navBar/navBar';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
} from '@mui/material';

export const HRDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            HR管理面板
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            欢迎，{user?.userName}！
          </Typography>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              HR功能
            </Typography>
            <Stack direction="column" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/onboarding-review"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                审核入职申请
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                to="/employee-management"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'secondary.light',
                    color: 'secondary.contrastText',
                  },
                }}
              >
                员工管理
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
};
