import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getRole, login } from '../../services/auth';
import { Button, TextField, Box, Typography, Container, Paper } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, setRole, isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const token = Cookies.get('access_token');
    const storedRole = Cookies.get('role');
    if (token && storedRole && isAuthenticated && role) {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token } = await login({ email, password });
      const role = await getRole(access_token);
      setIsAuthenticated(true);
      setRole(role);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            boxShadow: 'shadows.3',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
              component="h1"
              variant="h6"
              sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                variant="outlined"
                InputLabelProps={{ style: { color: 'text.secondary' } }}
                InputProps={{
                  style: { color: 'text.primary' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                InputLabelProps={{ style: { color: 'text.secondary' } }}
                InputProps={{
                  style: { color: 'text.primary' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              {error && (
                <Typography color="error.main" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1,
                  textTransform: 'none',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  borderRadius: 'shape.borderRadius',
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}