import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Business from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import Work from "@mui/icons-material/Work";
import Person from "@mui/icons-material/Person";
import Home from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { styled } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../themes/theme";

// 样式化的AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
}));

// 样式化的Logo
const StyledLogo = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", sans-serif',
  fontWeight: 700,
  letterSpacing: '.1rem',
  color: 'inherit',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

// 样式化的导航按钮
const StyledNavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  borderRadius: 8,
  padding: '8px 16px',
  margin: '0 4px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'none',
    },
  },
}));

// 样式化的头像
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  border: '2px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
  },
}));

const pages = [
  { name: "首页", icon: <HomeIcon />, key: "Home" },
  { name: "入职申请", icon: <Work />, key: "Onboarding Application" },
  { name: "个人信息", icon: <Person />, key: "Personal Information" },
  { name: "签证管理", icon: <Business />, key: "Visa Status Management" },
  { name: "住房", icon: <Home />, key: "Housing" },
  { name: "设施报告", icon: <Home />, key: "Facility Reports" },
];

const settings = ["退出登录"];

function EmployeeNavbar() {
  const { user, logout } = useAuth();
  const { currentEmployee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorElUser(null);
  };

  // 处理页面跳转
  const handlePageNavigation = (page: string) => {
    handleCloseNavMenu();
    console.log("Navigating to:", page);
    switch (page) {
      case "Home":
        navigate("/employee");
        break;
      case "Onboarding Application":
        navigate("/employee/onboarding-application");
        break;
      case "Personal Information":
        navigate("/employee/personal-information");
        break;
      case "Visa Status Management":
        navigate("/employee/visa-status");
        break;
      case "Housing":
        navigate("/employee/housing");
        break;
      case "Facility Reports":
        navigate("/employee/facility-reports");
        break;
      default:
        break;
    }
  };

  // 获取状态徽章
  const getStatusBadge = () => {
    if (!currentEmployee || !currentEmployee.status) return null;
    
    const statusColors: Record<string, "default" | "warning" | "success" | "error"> = {
      "Never Submitted": "default",
      "Pending": "warning",
      "Approved": "success",
      "Rejected": "error",
    };

    return (
      <Badge 
        badgeContent={currentEmployee.status} 
        color={statusColors[currentEmployee.status] || "default"}
        variant="dot"
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <StyledLogo
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
              }}
            >
              <Business sx={{ mr: 1 }} />
              Pilot Technologies
            </StyledLogo>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="导航菜单"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.key}
                    onClick={() => handlePageNavigation(page.key)}
                    disabled={
                      (page.key === "Onboarding Application" &&
                        currentEmployee?.status !== "Never Submitted") ||
                      (page.key === "Personal Information" &&
                        currentEmployee?.status === "Never Submitted") ||
                      (page.key === "Visa Status Management" &&
                        currentEmployee?.workAuthorization?.type && 
                        currentEmployee.workAuthorization.type !== "F1(CPT/OPT)") ||
                      (page.key === "Housing" &&
                        currentEmployee?.status === "Never Submitted")
                    }
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Business
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Pilot
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <StyledNavButton
                  key={page.key}
                  onClick={() => handlePageNavigation(page.key)}
                  disabled={
                    (page.key === "Onboarding Application" &&
                      currentEmployee?.status !== "Never Submitted") ||
                    (page.key === "Personal Information" &&
                      currentEmployee?.status === "Never Submitted") ||
                    (page.key === "Visa Status Management" &&
                      currentEmployee?.workAuthorization?.type && 
                      currentEmployee.workAuthorization.type !== "F1(CPT/OPT)") ||
                    (page.key === "Housing" &&
                      currentEmployee?.status === "Never Submitted")
                  }
                >
                  {page.icon}
                  {page.name}
                </StyledNavButton>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="打开设置">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <StyledAvatar>
                    <img
                      src={currentEmployee?.profilePicture || "/default-avatar.png"}
                      alt="用户头像"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </StyledAvatar>
                  {getStatusBadge()}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleLogout}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
    </ThemeProvider>
  );
}

export default EmployeeNavbar;
