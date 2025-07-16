// frontend/src/pages/HRDashboard.tsx
import React, { useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import EmployeeNavbar from "../../employeeNavbar/EmployeeNavbar";
import { fetchEmployeeByEmail } from "../../../../redux/slice/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Paper,
  LinearProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";

import {
  Person,
  Work,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Business,
  Home,
  Assignment,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../../themes/theme";

// 样式化的容器
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// 样式化的卡片
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
}));

// 样式化的状态芯片
const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 20,
  padding: '4px 8px',
}));

// 样式化的欢迎横幅
const WelcomeBanner = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: 16,
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

// 样式化的操作按钮
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-1px)',
  },
}));

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentEmployee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    dispatch(fetchEmployeeByEmail(user?.email || ""));
  }, [dispatch, user?.email]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Never Submitted":
        return <Schedule color="action" />;
      case "Pending":
        return <Warning color="warning" />;
      case "Approved":
        return <CheckCircle color="success" />;
      case "Rejected":
        return <Error color="error" />;
      default:
        return <Schedule color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Never Submitted":
        return "default";
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "Never Submitted":
        return "您还没有提交入职申请";
      case "Pending":
        return "您的入职申请正在审核中";
      case "Approved":
        return "您的入职申请已被批准";
      case "Rejected":
        return "您的入职申请被拒绝";
      default:
        return "状态未知";
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    
    if (currentEmployee?.status === "Never Submitted") {
      actions.push({
        title: "提交入职申请",
        description: "完成您的入职申请表格",
        icon: <Assignment />,
        color: "primary",
        path: "/employee/onboarding-application",
      });
    }

    if (currentEmployee?.status === "Rejected") {
      actions.push({
        title: "重新提交申请",
        description: "根据反馈重新提交入职申请",
        icon: <Assignment />,
        color: "primary",
        path: "/employee/onboarding-application",
      });
    }

    if (currentEmployee?.status === "Approved") {
      actions.push({
        title: "查看个人资料",
        description: "管理您的个人信息",
        icon: <Person />,
        color: "secondary",
        path: "/employee/personal-information",
      });
    }

    if (currentEmployee?.workAuthorization?.type === "F1(CPT/OPT)") {
      actions.push({
        title: "签证状态管理",
        description: "管理您的签证状态",
        icon: <Business />,
        color: "info",
        path: "/employee/visa-status",
      });
    }

    if (currentEmployee?.status === "Approved") {
      actions.push({
        title: "住房信息",
        description: "查看住房安排",
        icon: <Home />,
        color: "success",
        path: "/employee/housing",
      });
    }

    return actions;
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <EmployeeNavbar />
        <StyledContainer>
          <Box sx={{ width: '100%', mt: 4 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              正在加载您的信息...
            </Typography>
          </Box>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <EmployeeNavbar />
        <StyledContainer>
          <Alert severity="error" sx={{ mt: 4 }}>
            加载失败：{error}
          </Alert>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <EmployeeNavbar />
      <StyledContainer maxWidth="lg">
        {/* 欢迎横幅 */}
        <WelcomeBanner elevation={0}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {user?.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              欢迎回来，{user?.userName}！
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              这是您的员工仪表板，您可以在这里管理您的入职流程和个人信息。
            </Typography>
          </Box>
        </WelcomeBanner>

        <Grid container spacing={3}>
          {/* 状态卡片 */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {getStatusIcon(currentEmployee?.status || "Never Submitted")}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    申请状态
                  </Typography>
                </Box>
                <StatusChip
                  label={currentEmployee?.status || "Never Submitted"}
                  color={getStatusColor(currentEmployee?.status || "Never Submitted") as any}
                  variant="filled"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {getStatusMessage(currentEmployee?.status || "Never Submitted")}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* 个人信息卡片 */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    个人信息
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  邮箱：{user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  角色：{user?.role}
                </Typography>
                {currentEmployee?.workAuthorization && (
                  <Typography variant="body2" color="text.secondary">
                    工作授权：{currentEmployee.workAuthorization.type}
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* 快速操作卡片 */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Work color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    快速操作
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  根据您的当前状态，以下是可用的操作：
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {getAvailableActions().slice(0, 2).map((action, index) => (
                    <ActionButton
                      key={index}
                      variant="contained"
                      color={action.color as any}
                      startIcon={action.icon}
                      onClick={() => navigate(action.path)}
                      size="small"
                    >
                      {action.title}
                    </ActionButton>
                  ))}
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* 详细操作列表 */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  可用操作
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {getAvailableActions().map((action, index) => (
                    <ListItem
                      key={index}
                      component={Button}
                      onClick={() => navigate(action.path)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        p: 2,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        {action.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={action.title}
                        secondary={action.description}
                        primaryTypographyProps={{
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                  {getAvailableActions().length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="暂无可用操作"
                        secondary="请等待系统更新您的状态"
                        primaryTypographyProps={{
                          color: 'text.secondary',
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
};
