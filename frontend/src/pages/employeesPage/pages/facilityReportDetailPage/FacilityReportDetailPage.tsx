import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';

const FacilityReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState<FacilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const fetchReport = async () => {
    if (!reportId) return;
    
    try {
      setLoading(true);
      const fetchedReport = await housingService.getFacilityReportById(reportId);
      setReport(fetchedReport);
    } catch (err) {
      setError('Failed to load facility report');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!reportId || !user?.email || !newComment.trim()) return;

    try {
      await housingService.addCommentToReport({
        reportId,
        description: newComment,
        userEmail: user.email
      });
      
      setNewComment('');
      fetchReport(); // Refresh the report to get the new comment
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
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

  if (error || !report) {
    return (
      <>
        <EmployeeNavbar />
        <Box p={3}>
          <Alert severity="error">
            {error || 'Report not found'}
          </Alert>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/employee/facility-reports')}
            sx={{ mt: 2 }}
          >
            Back to Reports
          </Button>
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
            Facility Report Details
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/employee/facility-reports')}
          >
            Back to Reports
          </Button>
        </Box>

        {/* Report Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="h5">
                {report.title}
              </Typography>
              <Chip 
                label={report.status} 
                color={getStatusColor(report.status) as any}
              />
            </Box>
            
            <Typography variant="body1" paragraph>
              {report.description}
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Created by: {report.createdBy}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(report.createdAt)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Typography variant="h6" gutterBottom>
          Comments ({report.comments.length})
        </Typography>

        {report.comments.length === 0 ? (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              No comments yet. Be the first to add a comment!
            </Typography>
          </Paper>
        ) : (
          <List sx={{ mb: 3 }}>
            {report.comments.map((comment, index) => (
              <React.Fragment key={comment._id || index}>
                <ListItem>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Typography variant="body2" paragraph>
                        {comment.description}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          By: {comment.createdBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
                {index < report.comments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Add Comment Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default FacilityReportDetailPage; 