import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCountryById, updateCountry, createCountry, deleteCountry } from '../../services/countries';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import Loading from '../../components/Loading';

interface Country {
  id?: number;
  iso_code: string;
  name_en: string;
  name_th?: string | null;
}

export default function CountryDetail() {
  const { isDarkMode } = useTheme();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [country, setCountry] = useState<Country | null>(isCreateMode ? { iso_code: '', name_en: '' } : null);
  const [formData, setFormData] = useState({
    iso_code: '',
    name_en: '',
    name_th: '',
  });
  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
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
          const data = await getCountryById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setCountry(data);
            setFormData({
              iso_code: data.iso_code || '',
              name_en: data.name_en || '',
              name_th: data.name_th || '',
            });
          } else {
            setError('Invalid country data');
          }
        } else {
          setError('Invalid country ID');
        }
      } catch (error) {
        console.error('Error fetching country:', error);
        setError('Failed to load country');
        navigate('/country');
      } finally {
        setLoading(false);
      }
    };
    fetchCountry();
  }, [param, navigate, isCreateMode, logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updateData: {
        iso_code?: string;
        name_en?: string;
        name_th?: string | null;
      } = {};
      if (formData.iso_code) updateData.iso_code = formData.iso_code;
      if (formData.name_en) updateData.name_en = formData.name_en;
      if (formData.name_th) updateData.name_th = formData.name_th;
      else if (formData.name_th === '') updateData.name_th = null;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.iso_code || !formData.name_en) {
          setError('ISO Code and Name (EN) are required for creating a new country');
          return;
        }
        await createCountry({
          iso_code: formData.iso_code,
          name_en: formData.name_en,
          name_th: formData.name_th || null,
        });
      } else if (param && !isNaN(Number(param))) {
        await updateCountry(parseInt(param), updateData);
      }
      navigate('/country');
    } catch (error) {
      console.error('Error processing country:', error);
      setError(isCreateMode ? 'Failed to create country' : 'Failed to update country');
    }
  };

  const handleCancel = () => {
    navigate('/country');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deleteCountry(parseInt(param));
      navigate('/country');
    } catch (error) {
      console.error('Error deleting country:', error);
      setError('Failed to delete country');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !country)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No country data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create Country" : "Country Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            {isCreateMode ? 'Create New Country' : 'Edit Country'}
          </Typography>
          <Box sx={{ mb: 4 }}>
            {!isCreateMode && (
              <TextField
                label="ID"
                value={country?.id || ''}
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
              label="ISO Code"
              name="iso_code"
              value={formData.iso_code}
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
              label="Name (EN)"
              name="name_en"
              value={formData.name_en}
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
              label="Name (TH)"
              name="name_th"
              value={formData.name_th}
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