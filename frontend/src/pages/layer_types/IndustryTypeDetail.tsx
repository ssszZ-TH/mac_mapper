import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getIndustryTypeById, updateIndustryType, createIndustryType, deleteIndustryType } from '../../services/industryTypes';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import Loading from '../../components/Loading';

interface IndustryType {
  id?: number;
  naisc: string;
  description: string;
}

export default function IndustryTypeDetail() {
  const { isDarkMode } = useTheme();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [type, setType] = useState<IndustryType | null>(isCreateMode ? { naisc: '', description: '' } : null);
  const [formData, setFormData] = useState({
    naisc: '',
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
          const data = await getIndustryTypeById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setType(data);
            setFormData({
              naisc: data.naisc || '',
              description: data.description || '',
            });
          } else {
            setError('Invalid industry type data');
          }
        } else {
          setError('Invalid industry type ID');
        }
      } catch (error) {
        console.error('Error fetching industry type:', error);
        setError('Failed to load industry type');
        navigate('/industry-type');
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
        naisc?: string;
        description?: string;
      } = {};
      if (formData.naisc) updateData.naisc = formData.naisc;
      if (formData.description) updateData.description = formData.description;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.naisc || !formData.description) {
          setError('NAISC and Description are required for creating a new industry type');
          return;
        }
        await createIndustryType({
          naisc: formData.naisc,
          description: formData.description,
        });
      } else if (param && !isNaN(Number(param))) {
        await updateIndustryType(parseInt(param), updateData);
      }
      navigate('/industry-type');
    } catch (error) {
      console.error('Error processing industry type:', error);
      setError(isCreateMode ? 'Failed to create industry type' : 'Failed to update industry type');
    }
  };

  const handleCancel = () => {
    navigate('/industry-type');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deleteIndustryType(parseInt(param));
      navigate('/industry-type');
    } catch (error) {
      console.error('Error deleting industry type:', error);
      setError('Failed to delete industry type');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !type)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No industry type data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create Industry Type" : "Industry Type Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            {isCreateMode ? 'Create New Industry Type' : 'Edit Industry Type'}
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
              label="NAISC"
              name="naisc"
              value={formData.naisc}
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