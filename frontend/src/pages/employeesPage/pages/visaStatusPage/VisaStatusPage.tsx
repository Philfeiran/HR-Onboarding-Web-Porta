import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import EmployeeNavbar from '../../employeeNavbar/EmployeeNavbar';
import { visaStatusService } from '../../../../services/visaStatusService';
import type { VisaStatusData, DocumentType } from '../../../../types/visaStatus.types';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Upload,
  Download,
  Description,
  Assignment,
  School,
  Work,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../../themes/theme';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

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

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 20,
  padding: '4px 8px',
}));

const DocumentStep = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: '1px solid rgba(0, 0, 0, 0.1)',
}));

const VisaStatusPage: React.FC = () => {
  const { user } = useAuth();
  const [visaStatus, setVisaStatus] = useState<VisaStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<DocumentType | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchVisaStatus();
    }
  }, [user?.email]);

  const fetchVisaStatus = async () => {
    try {
      setLoading(true);
      const data = await visaStatusService.getVisaStatus(user!.email);
      setVisaStatus(data);
    } catch (err) {
      setError('Failed to load visa status');
      console.error('Error fetching visa status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = (documentType: DocumentType) => {
    setCurrentDocumentType(documentType);
    setUploadDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentDocumentType || !user?.email) return;

    try {
      setUploading(currentDocumentType);
      await visaStatusService.uploadDocument({
        documentType: currentDocumentType,
        file: selectedFile,
        employeeId: user.email,
      });
      
      // Refresh visa status
      await fetchVisaStatus();
      
      // Reset state
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setCurrentDocumentType(null);
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setUploading(null);
    }
  };

  const handleDownloadI983Template = async (templateType: 'empty' | 'sample') => {
    try {
      const blob = await visaStatusService.downloadI983Template(templateType);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `I-983-${templateType}-template.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download template');
      console.error('Error downloading template:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'rejected':
        return <Error color="error" />;
      default:
        return <Warning color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getNextStepMessage = (documentType: DocumentType, status: string) => {
    switch (documentType) {
      case 'optReceipt':
        if (status === 'pending') return 'Waiting for HR to approve your OPT Receipt';
        if (status === 'approved') return 'Please upload a copy of your OPT EAD';
        if (status === 'rejected') return 'Please review HR feedback and resubmit';
        return 'Please upload your OPT Receipt';
      
      case 'optEad':
        if (status === 'pending') return 'Waiting for HR to approve your OPT EAD';
        if (status === 'approved') return 'Please download and fill out the I-983 form';
        if (status === 'rejected') return 'Please review HR feedback and resubmit';
        return 'Please upload your OPT EAD';
      
      case 'i983':
        if (status === 'pending') return 'Waiting for HR to approve and sign your I-983';
        if (status === 'approved') return 'Please send the I-983 along with all necessary documents to your school and upload the new I-20';
        if (status === 'rejected') return 'Please review HR feedback and resubmit';
        return 'Please download, fill out, and upload the I-983 form';
      
      case 'i20':
        if (status === 'pending') return 'Waiting for HR to approve your I-20';
        if (status === 'approved') return 'All documents have been approved';
        if (status === 'rejected') return 'Please review HR feedback and resubmit';
        return 'Please upload your new I-20';
      
      default:
        return '';
    }
  };

  const canUploadDocument = (documentType: DocumentType) => {
    if (!visaStatus?.optVisaStatus) return false;

    const documents = visaStatus.optVisaStatus;
    
    switch (documentType) {
      case 'optReceipt':
        return documents.optReceipt.status === 'not_submitted' || documents.optReceipt.status === 'rejected';
      case 'optEad':
        return documents.optReceipt.status === 'approved' && 
               (documents.optEad.status === 'not_submitted' || documents.optEad.status === 'rejected');
      case 'i983':
        return documents.optEad.status === 'approved' && 
               (documents.i983.status === 'not_submitted' || documents.i983.status === 'rejected');
      case 'i20':
        return documents.i983.status === 'approved' && 
               (documents.i20.status === 'not_submitted' || documents.i20.status === 'rejected');
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <EmployeeNavbar />
        <StyledContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
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
            {error}
          </Alert>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  // If user doesn't have OPT visa, show message
  if (!visaStatus || visaStatus.workAuthorizationType !== 'F1(CPT/OPT)') {
    return (
      <ThemeProvider theme={theme}>
        <EmployeeNavbar />
        <StyledContainer>
          <Alert severity="info" sx={{ mt: 4 }}>
            Visa Status Management is only available for OPT visa holders. 
            If you believe this is an error, please contact HR.
          </Alert>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  const { optVisaStatus } = visaStatus;

  // Early return if optVisaStatus is not available
  if (!optVisaStatus) {
    return (
      <ThemeProvider theme={theme}>
        <EmployeeNavbar />
        <StyledContainer>
          <Alert severity="error" sx={{ mt: 4 }}>
            Unable to load visa status information. Please contact HR.
          </Alert>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <EmployeeNavbar />
      <StyledContainer maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Visa Status Management
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Track the status of your OPT visa documents and required next steps.
        </Typography>

        <Grid container spacing={3}>
          {/* OPT Receipt */}
          <Grid size={12}>
            <DocumentStep>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Description color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  OPT Receipt
                </Typography>
                <StatusChip
                  label={optVisaStatus.optReceipt.status}
                  color={getStatusColor(optVisaStatus.optReceipt.status) as any}
                  variant="filled"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getNextStepMessage('optReceipt', optVisaStatus.optReceipt.status)}
              </Typography>

              {optVisaStatus.optReceipt.status === 'rejected' && optVisaStatus.optReceipt.hrFeedback && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <strong>HR Feedback:</strong> {optVisaStatus.optReceipt.hrFeedback}
                </Alert>
              )}

              {canUploadDocument('optReceipt') && (
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => handleUploadClick('optReceipt')}
                  disabled={uploading === 'optReceipt'}
                >
                  {uploading === 'optReceipt' ? 'Uploading...' : 'Upload OPT Receipt'}
                </Button>
              )}
            </DocumentStep>
          </Grid>

          {/* OPT EAD */}
          <Grid size={12}>
            <DocumentStep>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Work color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  OPT EAD
                </Typography>
                <StatusChip
                  label={optVisaStatus.optEad.status}
                  color={getStatusColor(optVisaStatus.optEad.status) as any}
                  variant="filled"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getNextStepMessage('optEad', optVisaStatus.optEad.status)}
              </Typography>

              {optVisaStatus.optEad.status === 'rejected' && optVisaStatus.optEad.hrFeedback && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <strong>HR Feedback:</strong> {optVisaStatus.optEad.hrFeedback}
                </Alert>
              )}

              {canUploadDocument('optEad') && (
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => handleUploadClick('optEad')}
                  disabled={uploading === 'optEad'}
                >
                  {uploading === 'optEad' ? 'Uploading...' : 'Upload OPT EAD'}
                </Button>
              )}
            </DocumentStep>
          </Grid>

          {/* I-983 */}
          <Grid size={12}>
            <DocumentStep>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Assignment color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  I-983 Training Plan
                </Typography>
                <StatusChip
                  label={optVisaStatus.i983.status}
                  color={getStatusColor(optVisaStatus.i983.status) as any}
                  variant="filled"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getNextStepMessage('i983', optVisaStatus.i983.status)}
              </Typography>

              {optVisaStatus.i983.status === 'rejected' && optVisaStatus.i983.hrFeedback && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <strong>HR Feedback:</strong> {optVisaStatus.i983.hrFeedback}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownloadI983Template('empty')}
                >
                  Download Empty Template
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownloadI983Template('sample')}
                >
                  Download Sample Template
                </Button>
              </Box>

              {canUploadDocument('i983') && (
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => handleUploadClick('i983')}
                  disabled={uploading === 'i983'}
                >
                  {uploading === 'i983' ? 'Uploading...' : 'Upload I-983'}
                </Button>
              )}
            </DocumentStep>
          </Grid>

          {/* I-20 */}
          <Grid size={12}>
            <DocumentStep>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <School color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  I-20
                </Typography>
                <StatusChip
                  label={optVisaStatus.i20.status}
                  color={getStatusColor(optVisaStatus.i20.status) as any}
                  variant="filled"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getNextStepMessage('i20', optVisaStatus.i20.status)}
              </Typography>

              {optVisaStatus.i20.status === 'rejected' && optVisaStatus.i20.hrFeedback && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <strong>HR Feedback:</strong> {optVisaStatus.i20.hrFeedback}
                </Alert>
              )}

              {canUploadDocument('i20') && (
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => handleUploadClick('i20')}
                  disabled={uploading === 'i20'}
                >
                  {uploading === 'i20' ? 'Uploading...' : 'Upload I-20'}
                </Button>
              )}
            </DocumentStep>
          </Grid>
        </Grid>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Upload {currentDocumentType?.toUpperCase()} Document
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <input
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                id="document-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="document-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Select File
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpload} 
              variant="contained"
              disabled={!selectedFile || uploading !== null}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default VisaStatusPage; 