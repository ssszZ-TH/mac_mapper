import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getPersonById, updatePerson, createPerson, deletePerson } from '../../services/persons';
import { getGenderTypes } from '../../services/genderTypes';
import { getMaritalStatusTypes } from '../../services/maritalStatusTypes';
import { getCountries } from '../../services/countries';
import { getRacialTypes } from '../../services/racialTypes';
import { getIncomeRanges } from '../../services/incomeRanges';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import Loading from '../../components/Loading';

interface Person {
  id?: number;
  username: string;
  email: string;
  personal_id_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  nick_name?: string | null;
  birth_date: string;
  gender_type_id?: number | null;
  marital_status_type_id?: number | null;
  country_id?: number | null;
  height: number;
  weight: number;
  racial_type_id?: number | null;
  income_range_id?: number | null;
  about_me?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

interface GenderType {
  id: number;
  description: string;
}

interface MaritalStatusType {
  id: number;
  description: string;
}

interface Country {
  id: number;
  iso_code: string;
  name_en: string;
}

interface RacialType {
  id: number;
  description: string;
}

interface IncomeRange {
  id: number;
  description: string;
}

export default function PersonDetail() {
  const { isDarkMode } = useTheme();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [person, setPerson] = useState<Person | null>(isCreateMode ? { 
    username: '', 
    email: '', 
    personal_id_number: '', 
    first_name: '', 
    last_name: '', 
    birth_date: '', 
    height: 0, 
    weight: 0 
  } : null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    personal_id_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    nick_name: '',
    birth_date: '',
    gender_type_id: '',
    marital_status_type_id: '',
    country_id: '',
    height: '',
    weight: '',
    racial_type_id: '',
    income_range_id: '',
    about_me: '',
  });
  const [genderTypes, setGenderTypes] = useState<GenderType[]>([]);
  const [maritalStatusTypes, setMaritalStatusTypes] = useState<MaritalStatusType[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [racialTypes, setRacialTypes] = useState<RacialType[]>([]);
  const [incomeRanges, setIncomeRanges] = useState<IncomeRange[]>([]);
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

        const [genderTypesData, maritalStatusTypesData, countriesData, racialTypesData, incomeRangesData] = await Promise.all([
          getGenderTypes(),
          getMaritalStatusTypes(),
          getCountries(),
          getRacialTypes(),
          getIncomeRanges(),
        ]);

        setGenderTypes(genderTypesData);
        setMaritalStatusTypes(maritalStatusTypesData);
        setCountries(countriesData);
        setRacialTypes(racialTypesData);
        setIncomeRanges(incomeRangesData);

        if (!isCreateMode && param && !isNaN(Number(param))) {
          const data = await getPersonById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setPerson(data);
            setFormData({
              username: data.username || '',
              email: data.email || '',
              password: '',
              personal_id_number: data.personal_id_number || '',
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              middle_name: data.middle_name || '',
              nick_name: data.nick_name || '',
              birth_date: data.birth_date || '',
              gender_type_id: data.gender_type_id ? data.gender_type_id.toString() : '',
              marital_status_type_id: data.marital_status_type_id ? data.marital_status_type_id.toString() : '',
              country_id: data.country_id ? data.country_id.toString() : '',
              height: data.height ? data.height.toString() : '',
              weight: data.weight ? data.weight.toString() : '',
              racial_type_id: data.racial_type_id ? data.racial_type_id.toString() : '',
              income_range_id: data.income_range_id ? data.income_range_id.toString() : '',
              about_me: data.about_me || '',
            });
          } else {
            setError('Invalid person data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        if (!isCreateMode) navigate('/persons');
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
        personal_id_number?: string;
        first_name?: string;
        last_name?: string;
        middle_name?: string | null;
        nick_name?: string | null;
        birth_date?: string;
        gender_type_id?: number | null;
        marital_status_type_id?: number | null;
        country_id?: number | null;
        height?: number;
        weight?: number;
        racial_type_id?: number | null;
        income_range_id?: number | null;
        about_me?: string | null;
      } = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      if (formData.personal_id_number) updateData.personal_id_number = formData.personal_id_number;
      if (formData.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name) updateData.last_name = formData.last_name;
      if (formData.middle_name) updateData.middle_name = formData.middle_name;
      else if (formData.middle_name === '') updateData.middle_name = null;
      if (formData.nick_name) updateData.nick_name = formData.nick_name;
      else if (formData.nick_name === '') updateData.nick_name = null;
      if (formData.birth_date) updateData.birth_date = formData.birth_date;
      if (formData.gender_type_id) updateData.gender_type_id = parseInt(formData.gender_type_id);
      else if (formData.gender_type_id === '') updateData.gender_type_id = null;
      if (formData.marital_status_type_id) updateData.marital_status_type_id = parseInt(formData.marital_status_type_id);
      else if (formData.marital_status_type_id === '') updateData.marital_status_type_id = null;
      if (formData.country_id) updateData.country_id = parseInt(formData.country_id);
      else if (formData.country_id === '') updateData.country_id = null;
      if (formData.height) updateData.height = parseInt(formData.height);
      if (formData.weight) updateData.weight = parseInt(formData.weight);
      if (formData.racial_type_id) updateData.racial_type_id = parseInt(formData.racial_type_id);
      else if (formData.racial_type_id === '') updateData.racial_type_id = null;
      if (formData.income_range_id) updateData.income_range_id = parseInt(formData.income_range_id);
      else if (formData.income_range_id === '') updateData.income_range_id = null;
      if (formData.about_me) updateData.about_me = formData.about_me;
      else if (formData.about_me === '') updateData.about_me = null;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.username || !formData.email || !formData.password || 
            !formData.personal_id_number || !formData.first_name || 
            !formData.last_name || !formData.birth_date || !formData.height || !formData.weight) {
          setError('All required fields (username, email, password, personal_id_number, first_name, last_name, birth_date, height, weight) must be filled for creating a new person');
          return;
        }
        await createPerson({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          personal_id_number: formData.personal_id_number,
          first_name: formData.first_name,
          last_name: formData.last_name,
          middle_name: formData.middle_name || null,
          nick_name: formData.nick_name || null,
          birth_date: formData.birth_date,
          gender_type_id: formData.gender_type_id ? parseInt(formData.gender_type_id) : null,
          marital_status_type_id: formData.marital_status_type_id ? parseInt(formData.marital_status_type_id) : null,
          country_id: formData.country_id ? parseInt(formData.country_id) : null,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          racial_type_id: formData.racial_type_id ? parseInt(formData.racial_type_id) : null,
          income_range_id: formData.income_range_id ? parseInt(formData.income_range_id) : null,
          about_me: formData.about_me || null,
        });
      } else if (param && !isNaN(Number(param))) {
        if (Object.keys(updateData).length === 1 && updateData.email) {
          setError('Cannot update email only');
          return;
        }
        await updatePerson(parseInt(param), updateData);
      }
      navigate('/persons');
    } catch (error) {
      console.error('Error processing person:', error);
      setError(isCreateMode ? 'Failed to create person' : 'Failed to update person');
    }
  };

  const handleCancel = () => {
    navigate('/persons');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deletePerson(parseInt(param));
      navigate('/persons');
    } catch (error) {
      console.error('Error deleting person:', error);
      setError('Failed to delete person');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !person)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No person data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create Person" : "Person Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            {isCreateMode ? 'Create New Person' : 'Edit Person'}
          </Typography>
          <Box sx={{ mb: 4 }}>
            {!isCreateMode && (
              <TextField
                label="ID"
                value={person?.id || ''}
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
              label="Personal ID Number"
              name="personal_id_number"
              value={formData.personal_id_number}
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
              label="First Name"
              name="first_name"
              value={formData.first_name}
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
              label="Middle Name"
              name="middle_name"
              value={formData.middle_name}
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
              label="Last Name"
              name="last_name"
              value={formData.last_name}
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
              label="Nick Name"
              name="nick_name"
              value={formData.nick_name}
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
              label="Birth Date"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: 'text.secondary' }, shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Gender</InputLabel>
              <Select
                name="gender_type_id"
                value={formData.gender_type_id}
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
                {genderTypes.map((gender) => (
                  <MenuItem key={gender.id} value={gender.id}>
                    {gender.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Marital Status</InputLabel>
              <Select
                name="marital_status_type_id"
                value={formData.marital_status_type_id}
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
                {maritalStatusTypes.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Country</InputLabel>
              <Select
                name="country_id"
                value={formData.country_id}
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
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {`${country.iso_code} (${country.name_en})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
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
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
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
              <InputLabel sx={{ color: 'text.secondary' }}>Racial Type</InputLabel>
              <Select
                name="racial_type_id"
                value={formData.racial_type_id}
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
                {racialTypes.map((racial) => (
                  <MenuItem key={racial.id} value={racial.id}>
                    {racial.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Income Range</InputLabel>
              <Select
                name="income_range_id"
                value={formData.income_range_id}
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
                {incomeRanges.map((income) => (
                  <MenuItem key={income.id} value={income.id}>
                    {income.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="About Me"
              name="about_me"
              value={formData.about_me}
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