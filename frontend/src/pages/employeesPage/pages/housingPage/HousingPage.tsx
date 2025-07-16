import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { housingService } from '../../../../services/housingService';
import type { HousingDetails } from '../../../../types/housing.types';
import EmployeeNavbar from '../../employeeNavbar/EmployeeNavbar';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Home, People, Phone, Email } from '@mui/icons-material';

const HousingPage: React.FC = () => {
  const { user } = useAuth();
  const [housingDetails, setHousingDetails] = useState<HousingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHousingDetails = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        const details = await housingService.getHousingDetails(user.email);
        setHousingDetails(details);
      } catch (err) {
        setError('Failed to load housing details');
        console.error('Error fetching housing details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHousingDetails();
  }, [user?.email]);

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

  if (error) {
    return (
      <>
        <EmployeeNavbar />
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </>
    );
  }

  if (!housingDetails) {
    return (
      <>
        <EmployeeNavbar />
        <Box p={3}>
          <Alert severity="info">
            No housing details have been assigned yet. Please contact HR for housing assignment.
          </Alert>
        </Box>
      </>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <EmployeeNavbar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          <Home sx={{ mr: 1, verticalAlign: 'middle' }} />
          Housing Details
        </Typography>

        <Grid container spacing={3}>
          {/* Address Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assigned Address
                </Typography>
                <Typography variant="body1" paragraph>
                  {housingDetails.address.building && (
                    <Box component="span" display="block">
                      Building: {housingDetails.address.building}
                    </Box>
                  )}
                  {housingDetails.address.apartment && (
                    <Box component="span" display="block">
                      Apartment: {housingDetails.address.apartment}
                    </Box>
                  )}
                  <Box component="span" display="block">
                    {housingDetails.address.street}
                  </Box>
                  <Box component="span" display="block">
                    {housingDetails.address.city}, {housingDetails.address.state} {housingDetails.address.zip}
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned on: {formatDate(housingDetails.assignedDate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Roommates Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Roommates ({housingDetails.roommates.length})
                </Typography>
                
                {housingDetails.roommates.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No roommates assigned
                  </Typography>
                ) : (
                  <List dense>
                    {housingDetails.roommates.map((roommate, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography variant="body1">
                                {roommate.firstName} {roommate.middleName} {roommate.lastName}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Box display="flex" alignItems="center" mb={0.5}>
                                  <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                                  <Typography variant="body2">
                                    {roommate.phone}
                                  </Typography>
                                </Box>
                                {roommate.email && (
                                  <Box display="flex" alignItems="center">
                                    <Email sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="body2">
                                      {roommate.email}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < housingDetails.roommates.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Information Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Important Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • This housing assignment is managed by HR and cannot be modified by employees
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • For any housing-related issues, please submit a facility report
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Contact HR for any questions about your housing assignment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Last updated: {formatDate(housingDetails.updatedAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HousingPage; 