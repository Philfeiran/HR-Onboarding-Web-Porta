import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { housingService } from '../../../../services/housingService';
import type { FacilityReport } from '../../../../types/housing.types';
import NavBar from '../../navBar/navBar';
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
  Alert,
  CircularProgress,
  List,
  ListItem,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const HousingManagement: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<FacilityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FacilityReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const fetchedReports = await housingService.getAllFacilityReports();
      setReports(fetchedReports);
    } catch (err) {
      setError('Failed to load facility reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: "Open" | "In Progress" | "Closed") => {
    if (!selectedReport) return;

    try {
      await housingService.updateReportStatus({
        reportId: selectedReport._id!,
        status
      });
      
      setOpenStatusDialog(false);
      setSelectedReport(null);
      fetchReports(); // Refresh the list
    } catch (err) {
      setError('Failed to update report status');
      console.error('Error updating status:', err);
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
        <NavBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Facility Reports Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            All Facility Reports ({reports.length})
          </Typography>
        </Box>

        {reports.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No facility reports found.
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
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Created by: {report.createdBy}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {formatDate(report.createdAt)}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          Comments: {report.comments.length}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedReport(report);
                            setOpenStatusDialog(true);
                          }}
                        >
                          Update Status
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
                {index < reports.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Update Status Dialog */}
        <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Current Status: {selectedReport?.status}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value=""
                label="New Status"
                onChange={(e) => handleUpdateStatus(e.target.value as "Open" | "In Progress" | "Closed")}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStatusDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default HousingManagement; 