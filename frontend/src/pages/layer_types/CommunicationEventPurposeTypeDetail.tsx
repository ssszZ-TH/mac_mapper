import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCommunicationEventPurposeTypeById, updateCommunicationEventPurposeType, createCommunicationEventPurposeType, deleteCommunicationEventPurposeType } from '../../services/communicationeventpurposetype';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import Loading from '../../components/Loading';

interface CommunicationEventPurposeType {
  id?: number;
  description: string;
}

export default function CommunicationEventPurposeTypeDetail() {
  const { isDarkMode } = useTheme();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [type, setType] = useState<CommunicationEventPurposeType | null>(isCreateMode ? { description: '' } : null);
  const [formData, setFormData] = useState({
    description: '',
  });
  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchType = async () => {
      if (isCreateMode) {
        setLoading(false);
        return;
      }
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
          logout();
          navigate('/login');
          return;
        }
        if (param && !isNaN(Number(param))) {
          const data = await getCommunicationEventPurposeTypeById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setType(data);
            setFormData({
              description: data.description || '',
            });
          } else {
            setError('Invalid communication event purpose type data');
          }
        } else {
          setError('Invalid communication event purpose type ID');
        }
      } catch (error) {
        console.error('Error fetching communication event purpose type:', error);
        setError('Failed to load communication event purpose type');
        navigate('/communication-event-purpose-type');
      } finally {
        setLoading(false);
      }
    };
    fetchType();
  }, [param, navigate, isCreateMode, logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updateData: {
        description?: string;
      } = {};
      if (formData.description) updateData.description = formData.description;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.description) {
          setError('Description is required for creating a new communication event purpose type');
          return;
        }
        await createCommunicationEventPurposeType({
          description: formData.description,
        });
      } else if (param && !isNaN(Number(param))) {
        await updateCommunicationEventPurposeType(parseInt(param), updateData);
      }
      navigate('/communication-event-purpose-type');
    } catch (error) {
      console.error('Error processing communication event purpose type:', error);
      setError(isCreateMode ? 'Failed to create communication event purpose type' : 'Failed to update communication event purpose type');
    }
  };

  const handleCancel = () => {
    navigate('/communication-event-purpose-type');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deleteCommunicationEventPurposeType(parseInt(param));
      navigate('/communication-event-purpose-type');
    } catch (error) {
      console.error('Error deleting communication event purpose type:', error);
      setError('Failed to delete communication event purpose type');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !type)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No communication event purpose type data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create Communication Event Purpose Type" : "Communication Event Purpose Type Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            {isCreateMode ? 'Create New Communication Event Purpose Type' : 'Edit Communication Event Purpose Type'}
          </Typography>
          <Box sx={{ mb: 4 }}>
            {!isCreateMode && (
              <TextField
                label="ID"
                value={type?.id || ''}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
                InputLabelProps={{ style: { color: 'text.secondary' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-disabled fieldset': {
                      borderColor: 'divider',
                    },
                  },
                }}
              />
            )}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: 'text.secondary' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            {error && (
              <Typography color="error.main" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <CancelButton onClick={handleCancel} />
            <Box>
              {!isCreateMode && (
                <DeleteButton onClick={handleDelete} />
              )}
              <SaveButton onClick={handleSubmit} />
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}