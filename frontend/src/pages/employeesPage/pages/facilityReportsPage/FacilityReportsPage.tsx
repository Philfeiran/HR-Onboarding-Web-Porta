import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { housingService } from '../../../../services/housingService';
import type { FacilityReport } from '../../../../types/housing.types';
import EmployeeNavbar from '../../employeeNavbar/EmployeeNavbar';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const FacilityReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<FacilityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchReports();
  }, [user?.email]);

  const fetchReports = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const fetchedReports = await housingService.getFacilityReportsByEmployee(user.email);
      setReports(fetchedReports);
    } catch (err) {
      setError('Failed to load facility reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!user?.email || !newReport.title || !newReport.description) return;

    try {
      await housingService.createFacilityReport({
        title: newReport.title,
        description: newReport.description,
        employeeEmail: user.email
      });
      
      setOpenDialog(false);
      setNewReport({ title: '', description: '' });
      fetchReports(); // Refresh the list
    } catch (err) {
      setError('Failed to create facility report');
      console.error('Error creating report:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'error';
      case 'In Progress':
        return 'warning';
      case 'Closed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <EmployeeNavbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <EmployeeNavbar />
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            Facility Reports
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create New Report
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {reports.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No facility reports found. Create your first report to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <List>
            {reports.map((report, index) => (
              <React.Fragment key={report._id || index}>
                <ListItem>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6">
                          {report.title}
                        </Typography>
                        <Chip 
                          label={report.status} 
                          color={getStatusColor(report.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {report.description}
                      </Typography>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Created: {formatDate(report.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Comments: {report.comments.length}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
                {index < reports.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Create Report Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Facility Report</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={newReport.title}
              onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newReport.description}
              onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateReport}
              variant="contained"
              disabled={!newReport.title || !newReport.description}
            >
              Create Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default FacilityReportsPage; 