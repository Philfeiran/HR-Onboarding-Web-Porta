import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import NavBar from '../../navBar/navBar';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Visibility,
  ThumbUp,
  ThumbDown,
  Business,
  Person,
  Email,
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

const DocumentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: '1px solid rgba(0, 0, 0, 0.1)',
}));

const VisaStatusManagement: React.FC = () => {
  const { user } = useAuth();
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const data = await visaStatusService.getPendingDocuments();
      // Ensure data is always an array
      setPendingDocuments(Array.isArray(data) ? data : []);
      
      // If no data returned (API not implemented), show mock data for development
      if (!Array.isArray(data) || data.length === 0) {
        console.log('No data returned from API, showing mock data for development');
        const mockData = [
          {
            employeeId: 'emp001',
            employeeName: 'Alice Johnson',
            employeeEmail: 'alice.johnson@example.com',
            documentType: 'optReceipt',
            status: 'pending',
            uploadedAt: new Date().toISOString(),
          },
          {
            employeeId: 'emp002',
            employeeName: 'David Lee',
            employeeEmail: 'david.lee@example.com',
            documentType: 'optEad',
            status: 'pending',
            uploadedAt: new Date().toISOString(),
          },
          {
            employeeId: 'emp003',
            employeeName: 'Maria Gomez',
            employeeEmail: 'maria.gomez@example.com',
            documentType: 'i983',
            status: 'pending',
            uploadedAt: new Date().toISOString(),
          },
        ];
        setPendingDocuments(mockData);
      }
    } catch (err) {
      console.log('API error, showing mock data for development');
      // Show mock data for development when API is not available
      const mockData = [
        {
          employeeId: 'emp001',
          employeeName: 'Alice Johnson',
          employeeEmail: 'alice.johnson@example.com',
          documentType: 'optReceipt',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
        },
        {
          employeeId: 'emp002',
          employeeName: 'David Lee',
          employeeEmail: 'david.lee@example.com',
          documentType: 'optEad',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
        },
        {
          employeeId: 'emp003',
          employeeName: 'Maria Gomez',
          employeeEmail: 'maria.gomez@example.com',
          documentType: 'i983',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
        },
      ];
      setPendingDocuments(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (document: any) => {
    // In a real implementation, this would open the document for viewing
    console.log('Viewing document:', document);
    // For now, just show an alert
    alert(`Viewing ${document.documentType} for ${document.employeeName}`);
  };

  const handleApproveReject = (document: any, action: 'approve' | 'reject') => {
    setSelectedDocument(document);
    setApprovalDialogOpen(true);
  };

  const handleSubmitApproval = async () => {
    if (!selectedDocument || !feedback.trim()) return;

    try {
      setApproving(true);
      const approvalRequest = {
        documentType: selectedDocument.documentType,
        status: (feedback.toLowerCase().includes('reject') ? 'rejected' : 'approved') as 'approved' | 'rejected',
        feedback: feedback,
        employeeId: selectedDocument.employeeId,
      };
      console.log('Sending approval request:', approvalRequest);
      console.log('Selected document:', selectedDocument);
      await visaStatusService.approveDocument(approvalRequest);
      
      // Refresh the list
      await fetchPendingDocuments();
      
      // Reset state
      setApprovalDialogOpen(false);
      setSelectedDocument(null);
      setFeedback('');
    } catch (err) {
      setError('Failed to update document status');
      console.error('Error updating document status:', err);
    } finally {
      setApproving(false);
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

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'optReceipt':
        return 'OPT Receipt';
      case 'optEad':
        return 'OPT EAD';
      case 'i983':
        return 'I-983 Training Plan';
      case 'i20':
        return 'I-20';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <NavBar />
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
        <NavBar />
        <StyledContainer>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <StyledContainer maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Visa Status Management
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Review and approve employee visa documents for OPT visa holders.
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Schedule color="warning" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pending Documents
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {Array.isArray(pendingDocuments) ? pendingDocuments.length : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Documents awaiting review
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Business color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    OPT Employees
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {Array.isArray(pendingDocuments) ? new Set(pendingDocuments.map(doc => doc.employeeId)).size : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employees with pending documents
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ready to Review
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {Array.isArray(pendingDocuments) ? pendingDocuments.filter(doc => doc.status === 'pending').length : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Documents ready for approval
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Pending Documents Table */}
          <Grid size={12}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Pending Documents
                </Typography>
                
                {!Array.isArray(pendingDocuments) || pendingDocuments.length === 0 ? (
                  <Alert severity="info">
                    No pending documents to review at this time.
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Employee</strong></TableCell>
                          <TableCell><strong>Document Type</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Submitted</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(pendingDocuments) ? pendingDocuments : []).map((document, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {document.employeeName || document.employeeId}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {document.employeeEmail || document.employeeId}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getDocumentTypeName(document.documentType)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <StatusChip
                                label={document.status}
                                color={getStatusColor(document.status) as any}
                                variant="filled"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Document">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDocument(document)}
                                    color="primary"
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                                                 <Tooltip title="Approve">
                                   <IconButton
                                     size="small"
                                     onClick={() => handleApproveReject(document, 'approve')}
                                     color="success"
                                   >
                                     <ThumbUp />
                                   </IconButton>
                                 </Tooltip>
                                 <Tooltip title="Reject">
                                   <IconButton
                                     size="small"
                                     onClick={() => handleApproveReject(document, 'reject')}
                                     color="error"
                                   >
                                     <ThumbDown />
                                   </IconButton>
                                 </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Approval Dialog */}
        <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Review Document
          </DialogTitle>
          <DialogContent>
            {selectedDocument && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Employee:</strong> {selectedDocument.employeeName || selectedDocument.employeeId}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Document:</strong> {getDocumentTypeName(selectedDocument.documentType)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Status:</strong> {selectedDocument.status}
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Feedback (required)"
                  variant="outlined"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback for approval or rejection..."
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitApproval} 
              variant="contained"
              disabled={!feedback.trim() || approving}
            >
              {approving ? 'Processing...' : 'Submit Review'}
            </Button>
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default VisaStatusManagement; 