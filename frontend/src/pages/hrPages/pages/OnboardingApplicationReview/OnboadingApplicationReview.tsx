import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Link,
  Tooltip,
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import { CheckCircle, Cancel, Schedule, Visibility, Person, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { endpoints } from '../../../../configs/config';
import http from '../../../../utils/https';
import { useAuth } from '../../../../contexts/AuthContext';

// 类型定义
interface OnboardingApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  // submittedAt: string;
  // statusUpdatedAt: string;
  hrFeedback?: {
    comment: string;
    reviewedBy: string;
    reviewedAt: string;
  };
}

interface ApplicationDetail {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  profilePicture?: string;
  currentAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cellPhone?: string;
  citizenshipStatus?: string;
  emergencyContacts?: Array<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
  submittedAt: string;
  hrFeedback?: {
    comment: string;
    reviewedBy: string;
    reviewedAt: string;
  };
}

interface UserFile {
  Key: string;
  LastModified: string;
  Size: number;
  ETag: string;
  StorageClass: string;
  url?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  fontWeight: 'bold',
  ...(status === 'Pending' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
  }),
  ...(status === 'Approved' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  }),
  ...(status === 'Rejected' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  }),
}));

const OnboardingApplicationReview: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetail | null>(null);
  const [applicationFiles, setApplicationFiles] = useState<UserFile[]>([]);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [rejectingApplication, setRejectingApplication] = useState<OnboardingApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const statusLabels = ['Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get<{
        message: string;
        applications: OnboardingApplication[];
      }>(endpoints.getAllOnboardingApplicationsEndpoint);
      setApplications(response.data.applications);
    } catch (err: any) {
      setError(err.response?.data?.error || '获取申请列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDetail = async (email: string) => {
    try {
      const response = await http.get<ApplicationDetail>(endpoints.getEmployeeByEmailEndpoint(email));
      setSelectedApplication(response.data);
      
      // 获取用户文件
      const fileName = email;
      try {
        const filesResponse = await http.get<{
          message: string;
          files: UserFile[];
        }>(endpoints.getUserFilesEndpoint(fileName));
        setApplicationFiles(filesResponse.data.files);
      } catch (fileErr) {
        console.error('获取文件列表失败:', fileErr);
        setApplicationFiles([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '获取申请详情失败');
    }
  };

  const handleViewApplication = async (application: OnboardingApplication) => {
    await fetchApplicationDetail(application.email);
    setOpenDetailDialog(true);
  };

  const handleApprove = async (application: OnboardingApplication) => {
    setActionLoading(true);
    try {
      await http.post(endpoints.approveApplicationEndpoint, {
        email: application.email,
        reviewedBy: user?.email || user?.userName,
        comment: '申请已批准',
      });
      setSuccess('申请批准成功');
      await fetchApplications();
    } catch (err: any) {
      setError(err.response?.data?.error || '申请批准失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (application: OnboardingApplication) => {
    setRejectingApplication(application);
    setOpenRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingApplication) return;
    
    setActionLoading(true);
    try {
      await http.post(endpoints.rejectApplicationEndpoint, {
        email: rejectingApplication.email,
        reviewedBy: user?.email || user?.userName,
        comment: rejectFeedback || '申请被拒绝',
      });
      setSuccess('申请拒绝成功');
      setOpenRejectDialog(false);
      setRejectFeedback('');
      setRejectingApplication(null);
      await fetchApplications();
    } catch (err: any) {
      setError(err.response?.data?.error || '申请拒绝失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Schedule color="warning" />;
      case 'Approved': return <CheckCircle color="success" />;
      case 'Rejected': return <Cancel color="error" />;
      default: return <Schedule />;
    }
  };

  const getFilteredApplications = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderApplicationList = (status: string) => {
    const filteredApps = getFilteredApplications(status);
    
    if (filteredApps.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              暂无{status === 'Pending' ? '待审批' : status === 'Approved' ? '已批准' : '已拒绝'}的申请
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <div>
        {filteredApps.map((application) => (
          <StyledCard key={application._id}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6">
                      {application.firstName} {application.lastName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {application.email}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <StatusChip
                    status={application.status}
                    icon={getStatusIcon(application.status)}
                    label={application.status}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewApplication(application)}
                    >
                      查看申请
                    </Button>
                    {status === 'Pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={actionLoading}
                          onClick={() => handleApprove(application)}
                        >
                          批准
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          disabled={actionLoading}
                          onClick={() => handleReject(application)}
                        >
                          拒绝
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
              {application.hrFeedback && (
                <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>HR反馈:</strong> {application.hrFeedback.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    审核人: {application.hrFeedback.reviewedBy} | 
                    审核时间: {formatDate(application.hrFeedback.reviewedAt)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        ))}
      </div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        入职申请审核
      </Typography>

      {/* 错误和成功提示 */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* 加载状态 */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`待审批 (${getFilteredApplications('Pending').length})`} />
          <Tab label={`已批准 (${getFilteredApplications('Approved').length})`} />
          <Tab label={`已拒绝 (${getFilteredApplications('Rejected').length})`} />
        </Tabs>
      </Box>

      {/* 标签页内容 */}
      <TabPanel value={tabValue} index={0}>
        {renderApplicationList('Pending')}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderApplicationList('Approved')}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderApplicationList('Rejected')}
      </TabPanel>

      {/* 申请详情对话框 */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          申请详情
          {selectedApplication && (
            <StatusChip
              status={selectedApplication.status}
              icon={getStatusIcon(selectedApplication.status)}
              label={selectedApplication.status}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>基本信息</Typography>
                <Typography><strong>姓名:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</Typography>
                <Typography><strong>邮箱:</strong> {selectedApplication.email}</Typography>
                <Typography><strong>手机:</strong> {selectedApplication.cellPhone || '未提供'}</Typography>
                <Typography><strong>公民身份:</strong> {selectedApplication.citizenshipStatus || '未提供'}</Typography>
                <Typography><strong>提交时间:</strong> {formatDate(selectedApplication.submittedAt)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>地址信息</Typography>
                {selectedApplication.currentAddress ? (
                  <Typography>
                    {selectedApplication.currentAddress.street}<br/>
                    {selectedApplication.currentAddress.city}, {selectedApplication.currentAddress.state} {selectedApplication.currentAddress.zip}
                  </Typography>
                ) : (
                  <Typography color="text.secondary">未提供地址信息</Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>紧急联系人</Typography>
                {selectedApplication.emergencyContacts && selectedApplication.emergencyContacts.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>姓名</TableCell>
                          <TableCell>关系</TableCell>
                          <TableCell>电话</TableCell>
                          <TableCell>邮箱</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedApplication.emergencyContacts.map((contact, index) => (
                          <TableRow key={index}>
                            <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                            <TableCell>{contact.relationship}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="text.secondary">未提供紧急联系人信息</Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>上传文件</Typography>
                {applicationFiles.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>文件名</TableCell>
                          <TableCell>S3 URL</TableCell>
                          <TableCell>大小</TableCell>
                          <TableCell>上传时间</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applicationFiles.map((file, index) => (
                          <TableRow key={index}>
                            <TableCell>{file.Key.split('/').pop()}</TableCell>
                            <TableCell sx={{ maxWidth: 200, p: 0 }}>
                              <Link
                                href={file.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{
                                  display: 'block',
                                  p: 1,
                                }}
                              >
                                <Tooltip title={file.url} placement="top" arrow>
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {file.url}
                                  </Typography>
                                </Tooltip>
                              </Link>
                            </TableCell>
                            <TableCell>{formatFileSize(file.Size)}</TableCell>
                            <TableCell>{formatDate(file.LastModified)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="text.secondary">未上传文件</Typography>
                )}
              </Grid>

              {selectedApplication.hrFeedback && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>HR反馈</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" gutterBottom>
                      {selectedApplication.hrFeedback.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      审核人: {selectedApplication.hrFeedback.reviewedBy} | 
                      审核时间: {formatDate(selectedApplication.hrFeedback.reviewedAt)}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>关闭</Button>
          {selectedApplication?.status === 'Pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                disabled={actionLoading}
                                 onClick={() => selectedApplication && handleApprove(selectedApplication as OnboardingApplication)}
              >
                批准申请
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={actionLoading}
                                 onClick={() => selectedApplication && handleReject(selectedApplication as OnboardingApplication)}
              >
                拒绝申请
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* 拒绝申请对话框 */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>拒绝申请</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            您确定要拒绝 {rejectingApplication?.firstName} {rejectingApplication?.lastName} 的申请吗？
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="拒绝反馈（可选）"
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="请输入拒绝申请的原因或需要改进的地方..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>取消</Button>
          <Button
            variant="contained"
            color="error"
            disabled={actionLoading}
            onClick={handleRejectConfirm}
          >
            {actionLoading ? <CircularProgress size={20} /> : '确认拒绝'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OnboardingApplicationReview;







