import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getOrganizationById, updateOrganization, createOrganization, deleteOrganization } from '../../services/organizations';
import { getOrganizationTypes } from '../../services/organizationTypes';
import { getIndustryTypes } from '../../services/industryTypes';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import Loading from '../../components/Loading';

interface Organization {
  id?: number;
  username: string;
  email: string;
  federal_tax_id?: string | null;
  name_en: string;
  name_th?: string | null;
  organization_type_id?: number | null;
  industry_type_id?: number | null;
  employee_count?: number | null;
  slogan?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

interface OrganizationType {
  id: number;
  description: string;
}

interface IndustryType {
  id: number;
  naisc: string;
  description: string;
}

export default function OrganizationDetail() {
  const { isDarkMode } = useTheme();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [organization, setOrganization] = useState<Organization | null>(isCreateMode ? { 
    username: '', 
    email: '', 
    name_en: ''
  } : null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    federal_tax_id: '',
    name_en: '',
    name_th: '',
    organization_type_id: '',
    industry_type_id: '',
    employee_count: '',
    slogan: '',
  });
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
  const [industryTypes, setIndustryTypes] = useState<IndustryType[]>([]);
  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
          logout();
          navigate('/login');
          return;
        }

        const [organizationTypesData, industryTypesData] = await Promise.all([
          getOrganizationTypes(),
          getIndustryTypes(),
        ]);

        setOrganizationTypes(organizationTypesData);
        setIndustryTypes(industryTypesData);

        if (!isCreateMode && param && !isNaN(Number(param))) {
          const data = await getOrganizationById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setOrganization(data);
            setFormData({
              username: data.username || '',
              email: data.email || '',
              password: '',
              federal_tax_id: data.federal_tax_id || '',
              name_en: data.name_en || '',
              name_th: data.name_th || '',
              organization_type_id: data.organization_type_id ? data.organization_type_id.toString() : '',
              industry_type_id: data.industry_type_id ? data.industry_type_id.toString() : '',
              employee_count: data.employee_count ? data.employee_count.toString() : '',
              slogan: data.slogan || '',
            });
          } else {
            setError('Invalid organization data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        if (!isCreateMode) navigate('/organizations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [param, navigate, isCreateMode, logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updateData: {
        username?: string;
        email?: string;
        password?: string;
        federal_tax_id?: string | null;
        name_en?: string;
        name_th?: string | null;
        organization_type_id?: number | null;
        industry_type_id?: number | null;
        employee_count?: number | null;
        slogan?: string | null;
      } = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      if (formData.federal_tax_id) updateData.federal_tax_id = formData.federal_tax_id;
      else if (formData.federal_tax_id === '') updateData.federal_tax_id = null;
      if (formData.name_en) updateData.name_en = formData.name_en;
      if (formData.name_th) updateData.name_th = formData.name_th;
      else if (formData.name_th === '') updateData.name_th = null;
      if (formData.organization_type_id) updateData.organization_type_id = parseInt(formData.organization_type_id);
      else if (formData.organization_type_id === '') updateData.organization_type_id = null;
      if (formData.industry_type_id) updateData.industry_type_id = parseInt(formData.industry_type_id);
      else if (formData.industry_type_id === '') updateData.industry_type_id = null;
      if (formData.employee_count) updateData.employee_count = parseInt(formData.employee_count);
      else if (formData.employee_count === '') updateData.employee_count = null;
      if (formData.slogan) updateData.slogan = formData.slogan;
      else if (formData.slogan === '') updateData.slogan = null;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.username || !formData.email || !formData.password || !formData.name_en) {
          setError('All required fields (username, email, password, name_en) must be filled for creating a new organization');
          return;
        }
        await createOrganization({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          federal_tax_id: formData.federal_tax_id || null,
          name_en: formData.name_en,
          name_th: formData.name_th || null,
          organization_type_id: formData.organization_type_id ? parseInt(formData.organization_type_id) : null,
          industry_type_id: formData.industry_type_id ? parseInt(formData.industry_type_id) : null,
          employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
          slogan: formData.slogan || null,
        });
      } else if (param && !isNaN(Number(param))) {
        if (Object.keys(updateData).length === 1 && updateData.email) {
          setError('Cannot update email only');
          return;
        }
        await updateOrganization(parseInt(param), updateData);
      }
      navigate('/organizations');
    } catch (error) {
      console.error('Error processing organization:', error);
      setError(isCreateMode ? 'Failed to create organization' : 'Failed to update organization');
    }
  };

  const handleCancel = () => {
    navigate('/organizations');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deleteOrganization(parseInt(param));
      navigate('/organizations');
    } catch (error) {
      console.error('Error deleting organization:', error);
      setError('Failed to delete organization');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !organization)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No organization data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create Organization" : "Organization Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            {isCreateMode ? 'Create New Organization' : 'Edit Organization'}
          </Typography>
          <Box sx={{ mb: 4 }}>
            {!isCreateMode && (
              <TextField
                label="ID"
                value={organization?.id || ''}
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
              label="Username"
              name="username"
              value={formData.username}
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
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={!isCreateMode}
              InputLabelProps={{ style: { color: 'text.secondary' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-disabled fieldset': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
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
              label="Federal Tax ID"
              name="federal_tax_id"
              value={formData.federal_tax_id}
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
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Organization Type</InputLabel>
              <Select
                name="organization_type_id"
                value={formData.organization_type_id}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'divider' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="">None</MenuItem>
                {organizationTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Industry Type</InputLabel>
              <Select
                name="industry_type_id"
                value={formData.industry_type_id}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'divider' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="">None</MenuItem>
                {industryTypes.map((industry) => (
                  <MenuItem key={industry.id} value={industry.id}>
                    {`${industry.naisc} - ${industry.description}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Employee Count"
              name="employee_count"
              type="number"
              value={formData.employee_count}
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
              label="Slogan"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
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