import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import { Home, Person, Work, Home as HomeIcon, Business } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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

  const handleLogout = async () => {
    await logout();
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
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.key} onClick={() => handlePageNavigation(page.key)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {page.icon}
                      <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <StyledLogo
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
              }}
            >
              <Business sx={{ mr: 1 }} />
              Pilot Tech
            </StyledLogo>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <StyledNavButton
                  key={page.key}
                  onClick={() => handlePageNavigation(page.key)}
                  startIcon={page.icon}
                  disabled={
                    (page.key === "Onboarding Application" && 
                     (currentEmployee?.status === "Pending" || currentEmployee?.status === "Approved")) ||
                    (page.key === "Personal Information" && 
                     currentEmployee?.status === "Never Submitted") ||
                    (page.key === "Visa Status Management" && 
                     currentEmployee?.workAuthorization?.type !== "F1(CPT/OPT)") ||
                    (page.key === "Housing" && 
                     currentEmployee?.status !== "Approved")
                  }
                >
                  {page.name}
                </StyledNavButton>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="用户设置">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Badge 
                    overlap="circular" 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      currentEmployee?.status === "Pending" ? (
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: 'warning.main',
                            border: '2px solid white'
                          }} 
                        />
                      ) : null
                    }
                  >
                    <StyledAvatar
                      alt={user ? user.userName : "用户"}
                      src="/static/images/avatar/2.jpg"
                    >
                      {user ? user.userName.charAt(0).toUpperCase() : "U"}
                    </StyledAvatar>
                  </Badge>
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
                <MenuItem onClick={handleCloseUserMenu} disabled>
                  <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
                    {user?.userName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu} disabled>
                  <Typography sx={{ textAlign: "center", fontSize: '0.875rem', color: 'text.secondary' }}>
                    {user?.email}
                  </Typography>
                </MenuItem>
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={
                      setting === "退出登录" ? handleLogout : handleCloseUserMenu
                    }
                  >
                    <Typography sx={{ textAlign: "center", color: setting === "退出登录" ? 'error.main' : 'inherit' }}>
                      {setting}
                    </Typography>
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
