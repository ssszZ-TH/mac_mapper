import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Paper, Stack, TextField, MenuItem, Select, InputLabel, FormControl, Autocomplete, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCommunicationEventById, updateCommunicationEvent, createCommunicationEvent, deleteCommunicationEvent } from '../../services/CommunicationEvent';
import { getPersons } from '../../services/persons';
import { getOrganizations } from '../../services/organizations';
import { getContactMechanismTypes } from '../../services/contactMechanismTypes';
import { getCommunicationEventStatusTypes } from '../../services/communicationeventstatustypes';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import AppBarCustom from '../../components/AppBarCustom';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import FavoriteButton from '../../components/buttons/FavoriteButton';
import Loading from '../../components/Loading';

interface CommunicationEvent {
  id?: number;
  title: string;
  detail: string | null;
  from_user_id: number;
  to_user_id: number;
  contact_mechanism_type_id: number | null;
  communication_event_status_type_id: number | null;
  favorite_flag: boolean;
  created_at: string;
  updated_at: string | null;
}

interface UserOption {
  id: number;
  label: string;
  type: 'person' | 'organization';
}

interface ContactMechanismType {
  id: number;
  description: string;
}

interface CommunicationEventStatusType {
  id: number;
  description: string;
}

export default function CommunicationEventDetail() {
  const { isDarkMode } = useTheme();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { param } = useParams<{ param: string }>();
  const isCreateMode = param === 'create';
  const [event, setEvent] = useState<CommunicationEvent | null>(isCreateMode ? { 
    title: '', 
    detail: null, 
    from_user_id: 0, 
    to_user_id: 0, 
    contact_mechanism_type_id: null, 
    communication_event_status_type_id: null, 
    favorite_flag: false,
    created_at: '',
    updated_at: null 
  } : null);
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    to_user_id: '',
    contact_mechanism_type_id: '',
    communication_event_status_type_id: '',
    favorite_flag: false,
  });
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [contactMechanismTypes, setContactMechanismTypes] = useState<ContactMechanismType[]>([]);
  const [communicationEventStatusTypes, setCommunicationEventStatusTypes] = useState<CommunicationEventStatusType[]>([]);
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

        const [persons, organizations, contactMechanismTypesData, communicationEventStatusTypesData] = await Promise.all([
          getPersons(),
          getOrganizations(),
          getContactMechanismTypes(),
          getCommunicationEventStatusTypes(),
        ]);

        const userOptionsData = [
          ...persons.map(p => ({
            id: p.id,
            label: `${p.id} - ${p.first_name} ${p.last_name} ${p.about_me || ''} (Person)`.trim(),
            type: 'person' as const,
          })),
          ...organizations.map(o => ({
            id: o.id,
            label: `${o.id} - ${o.name_en} ${o.slogan || ''} (Organization)`.trim(),
            type: 'organization' as const,
          })),
        ];
        setUserOptions(userOptionsData);
        setContactMechanismTypes(contactMechanismTypesData);
        setCommunicationEventStatusTypes(communicationEventStatusTypesData);

        if (!isCreateMode && param && !isNaN(Number(param))) {
          const data = await getCommunicationEventById(parseInt(param));
          if (data && typeof data === 'object' && 'id' in data) {
            setEvent(data);
            setFormData({
              title: data.title || '',
              detail: data.detail || '',
              to_user_id: data.to_user_id ? data.to_user_id.toString() : '',
              contact_mechanism_type_id: data.contact_mechanism_type_id ? data.contact_mechanism_type_id.toString() : '',
              communication_event_status_type_id: data.communication_event_status_type_id ? data.communication_event_status_type_id.toString() : '',
              favorite_flag: data.favorite_flag || false,
            });
          } else {
            setError('Invalid communication event data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        if (!isCreateMode) navigate('/communication-events');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [param, navigate, isCreateMode, logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFavoriteToggle = async () => {
    if (!param || isCreateMode) return;
    try {
      const newFavoriteFlag = !formData.favorite_flag;
      await updateCommunicationEvent(parseInt(param), { favorite_flag: newFavoriteFlag });
      setFormData({ ...formData, favorite_flag: newFavoriteFlag });
      setEvent(prev => prev ? { ...prev, favorite_flag: newFavoriteFlag } : prev);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorite status');
    }
  };

  const handleSubmit = async () => {
    try {
      const updateData: {
        title?: string;
        detail?: string | null;
        to_user_id?: number;
        contact_mechanism_type_id?: number | null;
        communication_event_status_type_id?: number | null;
        favorite_flag?: boolean;
      } = {};
      if (formData.title) updateData.title = formData.title;
      if (formData.detail) updateData.detail = formData.detail;
      else if (formData.detail === '') updateData.detail = null;
      if (formData.to_user_id && isCreateMode) updateData.to_user_id = parseInt(formData.to_user_id);
      if (formData.contact_mechanism_type_id) updateData.contact_mechanism_type_id = parseInt(formData.contact_mechanism_type_id);
      else if (formData.contact_mechanism_type_id === '') updateData.contact_mechanism_type_id = null;
      if (formData.communication_event_status_type_id) updateData.communication_event_status_type_id = parseInt(formData.communication_event_status_type_id);
      else if (formData.communication_event_status_type_id === '') updateData.communication_event_status_type_id = null;
      if (formData.favorite_flag !== undefined) updateData.favorite_flag = formData.favorite_flag;

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        return;
      }

      if (isCreateMode) {
        if (!formData.title || !formData.to_user_id) {
          setError('Title and To User are required for creating a new communication event');
          return;
        }
        await createCommunicationEvent({
          title: formData.title,
          detail: formData.detail || null,
          to_user_id: parseInt(formData.to_user_id),
          contact_mechanism_type_id: formData.contact_mechanism_type_id ? parseInt(formData.contact_mechanism_type_id) : null,
          communication_event_status_type_id: formData.communication_event_status_type_id ? parseInt(formData.communication_event_status_type_id) : null,
        });
      } else if (param && !isNaN(Number(param))) {
        await updateCommunicationEvent(parseInt(param), updateData);
      }
      navigate('/communication-events');
    } catch (error) {
      console.error('Error processing communication event:', error);
      setError(isCreateMode ? 'Failed to create communication event' : 'Failed to update communication event');
    }
  };

  const handleCancel = () => {
    navigate('/communication-events');
  };

  const handleDelete = async () => {
    if (!param || isNaN(Number(param))) return;
    try {
      await deleteCommunicationEvent(parseInt(param));
      navigate('/communication-events');
    } catch (error) {
      console.error('Error deleting communication event:', error);
      setError('Failed to delete communication event');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isCreateMode && (error || !event)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error.main">{error || 'No communication event data available'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarCustom title={isCreateMode ? "Create Communication Event" : "Communication Event Detail"} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>
              {isCreateMode ? 'Create New Communication Event' : 'Edit Communication Event'}
            </Typography>
            {!isCreateMode && (
              <FavoriteButton
                isFavorite={formData.favorite_flag}
                onClick={handleFavoriteToggle}
              />
            )}
          </Box>
          <Box sx={{ mb: 4 }}>
            {!isCreateMode && (
              <TextField
                label="ID"
                value={event?.id || ''}
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
              label="Title"
              name="title"
              value={formData.title}
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
              label="Detail"
              name="detail"
              value={formData.detail}
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
            <Autocomplete
              options={userOptions}
              getOptionLabel={(option) => option.label}
              value={userOptions.find(option => option.id.toString() === formData.to_user_id) || null}
              onChange={(event, newValue) => {
                setFormData({ ...formData, to_user_id: newValue ? newValue.id.toString() : '' });
              }}
              disabled={!isCreateMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To User"
                  margin="normal"
                  variant="outlined"
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
              )}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Contact Mechanism Type</InputLabel>
              <Select
                name="contact_mechanism_type_id"
                value={formData.contact_mechanism_type_id}
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
                {contactMechanismTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Status</InputLabel>
              <Select
                name="communication_event_status_type_id"
                value={formData.communication_event_status_type_id}
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
                {communicationEventStatusTypes.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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