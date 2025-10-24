import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserById, updateUser, createUser, deleteUser } from '../../services/users';
import { useTheme } from '../../contexts/ThemeContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import Loading from '../../components/Loading';
import DeleteButton from '../../components/buttons/DeleteButton';

interface User {
  id?: number;
  username: string;
  email: string;
  role: 'system_admin' | 'hr_admin' | 'organization_admin' | 'basetype_admin';
  created_at?: string;
  updated_at?: string | null;
}

const validRoles = ['system_admin', 'hr_admin', 'organization_admin', 'basetype_admin'] as const;

export default function UserDetail() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [user, setUser] = useState<User | null>(isCreateMode ? { username: '', email: '', role: 'system_admin' } : null);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'system_admin' as 'system_admin' | 'hr_admin' | 'organization_admin' | 'basetype_admin' 
  });
  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isCreateMode) {
        setLoading(false);
        return;
      }
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          navigate('/login');
          return;
        }
        if (param && !isNaN(Number(param))) {
          const data = await getUserById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setUser(data);
            setFormData({ 
              username: data.username || '', 
              email: data.email || '',
              password: '', 
              role: data.role || 'system_admin' 
            });
          } else {
            setError('Invalid user data');
          }
        } else {
          setError('Invalid user ID');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [param, navigate, isCreateMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updateData: { 
        username?: string; 
        email?: string; 
        password?: string; 
        role?: 'system_admin' | 'hr_admin' | 'organization_admin' | 'basetype_admin' 
      } = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      if (formData.role) updateData.role = formData.role;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.username || !formData.email || !formData.password || !formData.role) {
          setError('All fields are required for creating a new user');
          return;
        }
        await createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      } else if (param && !isNaN(Number(param))) {
        if (Object.keys(updateData).length === 1 && updateData.email) {
          setError('Cannot update email only');
          return;
        }
        await updateUser(parseInt(param), updateData);
      }
      navigate('/users');
    } catch (error) {
      console.error('Error processing user:', error);
      setError(isCreateMode ? 'Failed to create user' : 'Failed to update user');
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deleteUser(parseInt(param));
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !user)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No user data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create User" : "User Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            {isCreateMode ? 'Create New User' : 'Edit User'}
          </Typography>
          <Box sx={{ mb: 4 }}>
            {!isCreateMode && (
              <TextField
                label="ID"
                value={user?.id || ''}
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
              select
              label="Role"
              name="role"
              value={formData.role}
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
            >
              {validRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
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
                <DeleteButton 
                  onClick={handleDelete} 
                />
              )}
              <SaveButton onClick={handleSubmit}  />
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}