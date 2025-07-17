import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { housingService } from '../../../../services/housingService';
import { employeeService } from '../../../../services/employeeService';
import type { HousingDetails } from '../../../../types/housing.types';
import type { Employee } from '../../../../types/employee.types';
import NavBar from '../../navBar/navBar';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Roommate {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email?: string;
}

interface HousingAssignmentForm {
  employeeEmail: string;
  address: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    apartment: string;
  };
  roommates: Roommate[];
}

const HousingAssignment: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [housingAssignments, setHousingAssignments] = useState<HousingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<HousingDetails | null>(null);
  const [formData, setFormData] = useState<HousingAssignmentForm>({
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
  const [newRoommate, setNewRoommate] = useState<Roommate>({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, housingData] = await Promise.all([
        employeeService.getAllEmployees(),
        housingService.getAllHousingDetails()
      ]);
      setEmployees(employeesData);
      setHousingAssignments(housingData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment?: HousingDetails) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        employeeEmail: assignment.employeeEmail,
        address: assignment.address,
        roommates: assignment.roommates
      });
    } else {
      setEditingAssignment(null);
      setFormData({
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
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAssignment(null);
    setFormData({
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
    setNewRoommate({
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof HousingAssignmentForm],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddRoommate = () => {
    if (newRoommate.firstName && newRoommate.lastName && newRoommate.phone) {
      setFormData(prev => ({
        ...prev,
        roommates: [...prev.roommates, { ...newRoommate }]
      }));
      setNewRoommate({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        email: ''
      });
    }
  };

  const handleRemoveRoommate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roommates: prev.roommates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.employeeEmail || !formData.address.street || !formData.address.city || !formData.address.state || !formData.address.zip) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const housingData: HousingDetails = {
        employeeEmail: formData.employeeEmail,
        address: formData.address,
        roommates: formData.roommates,
        assignedDate: new Date(),
        updatedAt: new Date()
      };

      if (editingAssignment) {
        await housingService.updateHousingDetails(formData.employeeEmail, housingData);
      } else {
        await housingService.createHousingDetails(housingData);
      }

      handleCloseDialog();
      fetchData();
      setError(null);
    } catch (err) {
      setError('Failed to save housing assignment');
      console.error('Error saving housing assignment:', err);
    }
  };

  const handleDeleteAssignment = async (email: string) => {
    if (window.confirm('Are you sure you want to delete this housing assignment?')) {
      try {
        // Note: You might need to add a delete method to your housing service
        // For now, we'll just remove it from the local state
        setHousingAssignments(prev => prev.filter(assignment => assignment.employeeEmail !== email));
      } catch (err) {
        setError('Failed to delete housing assignment');
        console.error('Error deleting housing assignment:', err);
      }
    }
  };

  const getEmployeeName = (email: string) => {
    const employee = employees.find(emp => emp.email === email);
    return employee ? `${employee.firstName} ${employee.lastName}` : email;
  };

  const getUnassignedEmployees = () => {
    const assignedEmails = housingAssignments.map(assignment => assignment.employeeEmail);
    return employees.filter(employee => !assignedEmails.includes(employee.email));
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Housing Assignment Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Assign Housing
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4">
                  {employees.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Assigned Housing
                </Typography>
                <Typography variant="h4">
                  {housingAssignments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Unassigned Employees
                </Typography>
                <Typography variant="h4">
                  {getUnassignedEmployees().length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Housing Assignments Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Housing Assignments
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Roommates</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {housingAssignments.map((assignment) => (
                    <TableRow key={assignment.employeeEmail}>
                      <TableCell>
                        <Typography variant="body1">
                          {getEmployeeName(assignment.employeeEmail)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {assignment.employeeEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {assignment.address.building && `${assignment.address.building}, `}
                          {assignment.address.street}
                        </Typography>
                        <Typography variant="body2">
                          {assignment.address.city}, {assignment.address.state} {assignment.address.zip}
                        </Typography>
                        {assignment.address.apartment && (
                          <Typography variant="body2">
                            {assignment.address.apartment}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignment.roommates.length > 0 ? (
                          assignment.roommates.map((roommate, index) => (
                            <Chip
                              key={index}
                              label={`${roommate.firstName} ${roommate.lastName}`}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No roommates
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.assignedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(assignment)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAssignment(assignment.employeeEmail)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Assignment Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAssignment ? 'Edit Housing Assignment' : 'Assign Housing'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Employee Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={formData.employeeEmail}
                    label="Employee"
                    onChange={(e) => handleInputChange('employeeEmail', e.target.value)}
                    disabled={!!editingAssignment}
                  >
                    {getUnassignedEmployees().map((employee) => (
                      <MenuItem key={employee.email} value={employee.email}>
                        {employee.firstName} {employee.lastName} ({employee.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Address Fields */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Building (Optional)"
                  value={formData.address.building}
                  onChange={(e) => handleInputChange('address.building', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Street Address *"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City *"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State *"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code *"
                  value={formData.address.zip}
                  onChange={(e) => handleInputChange('address.zip', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Apartment/Unit (Optional)"
                  value={formData.address.apartment}
                  onChange={(e) => handleInputChange('address.apartment', e.target.value)}
                />
              </Grid>

              {/* Roommates Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Roommates
                </Typography>
              </Grid>

              {/* Add New Roommate */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Add New Roommate
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={newRoommate.firstName}
                        onChange={(e) => setNewRoommate(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Middle Name"
                        value={newRoommate.middleName}
                        onChange={(e) => setNewRoommate(prev => ({ ...prev, middleName: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Last Name *"
                        value={newRoommate.lastName}
                        onChange={(e) => setNewRoommate(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Phone *"
                        value={newRoommate.phone}
                        onChange={(e) => setNewRoommate(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email (Optional)"
                        value={newRoommate.email}
                        onChange={(e) => setNewRoommate(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleAddRoommate}
                        disabled={!newRoommate.firstName || !newRoommate.lastName || !newRoommate.phone}
                      >
                        Add Roommate
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Current Roommates List */}
              {formData.roommates.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Current Roommates
                    </Typography>
                    <List>
                      {formData.roommates.map((roommate, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={`${roommate.firstName} ${roommate.middleName} ${roommate.lastName}`}
                              secondary={
                                <Box>
                                  <Typography variant="body2">Phone: {roommate.phone}</Typography>
                                  {roommate.email && (
                                    <Typography variant="body2">Email: {roommate.email}</Typography>
                                  )}
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleRemoveRoommate(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < formData.roommates.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingAssignment ? 'Update Assignment' : 'Assign Housing'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default HousingAssignment; 