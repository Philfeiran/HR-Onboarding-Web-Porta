import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { housingService } from '../../../../services/housingService';
import type { FacilityReport, HousingDetails } from '../../../../types/housing.types';
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
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`housing-tabpanel-${index}`}
      aria-labelledby={`housing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HousingManagement: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<FacilityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openHousingDialog, setOpenHousingDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FacilityReport | null>(null);
  const [newHousingDetails, setNewHousingDetails] = useState({
    employeeEmail: '',
    address: {
      building: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      apartment: ''
    },
    roommates: []
  });

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

  const handleCreateHousing = async () => {
    try {
      await housingService.createHousingDetails({
        ...newHousingDetails,
        assignedDate: new Date(),
        updatedAt: new Date()
      });
      
      setOpenHousingDialog(false);
      setNewHousingDetails({
        employeeEmail: '',
        address: {
          building: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          apartment: ''
        },
        roommates: []
      });
    } catch (err) {
      setError('Failed to create housing assignment');
      console.error('Error creating housing:', err);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          Housing Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Facility Reports" />
            <Tab label="Housing Assignments" />
          </Tabs>
        </Box>

        {/* Facility Reports Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* Housing Assignments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Housing Assignments
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setOpenHousingDialog(true)}
            >
              Assign Housing
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                Housing assignment management interface will be implemented here.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Create Housing Assignment Dialog */}
        <Dialog open={openHousingDialog} onClose={() => setOpenHousingDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Assign Housing</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Employee Email"
              fullWidth
              variant="outlined"
              value={newHousingDetails.employeeEmail}
              onChange={(e) => setNewHousingDetails({ ...newHousingDetails, employeeEmail: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Building"
              fullWidth
              variant="outlined"
              value={newHousingDetails.address.building}
              onChange={(e) => setNewHousingDetails({
                ...newHousingDetails,
                address: { ...newHousingDetails.address, building: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Street"
              fullWidth
              variant="outlined"
              value={newHousingDetails.address.street}
              onChange={(e) => setNewHousingDetails({
                ...newHousingDetails,
                address: { ...newHousingDetails.address, street: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="City"
              fullWidth
              variant="outlined"
              value={newHousingDetails.address.city}
              onChange={(e) => setNewHousingDetails({
                ...newHousingDetails,
                address: { ...newHousingDetails.address, city: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="State"
              fullWidth
              variant="outlined"
              value={newHousingDetails.address.state}
              onChange={(e) => setNewHousingDetails({
                ...newHousingDetails,
                address: { ...newHousingDetails.address, state: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="ZIP Code"
              fullWidth
              variant="outlined"
              value={newHousingDetails.address.zip}
              onChange={(e) => setNewHousingDetails({
                ...newHousingDetails,
                address: { ...newHousingDetails.address, zip: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Apartment"
              fullWidth
              variant="outlined"
              value={newHousingDetails.address.apartment}
              onChange={(e) => setNewHousingDetails({
                ...newHousingDetails,
                address: { ...newHousingDetails.address, apartment: e.target.value }
              })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHousingDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateHousing}
              variant="contained"
              disabled={!newHousingDetails.employeeEmail || !newHousingDetails.address.street}
            >
              Assign Housing
            </Button>
          </DialogActions>
        </Dialog>

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