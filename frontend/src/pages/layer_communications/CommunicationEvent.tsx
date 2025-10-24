import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCommunicationEvents, getInboxCommunicationEvents, getSentCommunicationEvents, getFavoriteCommunicationEvents } from '../../services/CommunicationEvent';
import { getPersons } from '../../services/persons';
import { getOrganizations } from '../../services/organizations';
import { getContactMechanismTypes } from '../../services/contactMechanismTypes';
import { getCommunicationEventStatusTypes } from '../../services/communicationeventstatustypes';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import UpdateButton from '../../components/buttons/UpdateButton';
import AddButton from '../../components/buttons/AddButton';
import ListAllButton from '../../components/buttons/ListAllButton';
import ListInboxButton from '../../components/buttons/ListInboxButton';
import ListSentButton from '../../components/buttons/ListSentButton';
import ListFavoriteButton from '../../components/buttons/ListFavoriteButton';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '../../utils/time_util';

interface CommunicationEvent {
  id: number;
  title: string;
  detail: string | null;
  from_user_id: number;
  from_user_name: string | null;
  to_user_id: number;
  to_user_name: string | null;
  contact_mechanism_type_id: number | null;
  contact_mechanism_type_description: string | null;
  communication_event_status_type_id: number | null;
  communication_event_status_type_description: string | null;
  favorite_flag: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function CommunicationEvents() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState<CommunicationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (fetchFunction: () => Promise<CommunicationEvent[]>, listType: string) => {
    setLoading(true);
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
        logout();
        navigate('/login');
        return;
      }
      const [eventData, persons, organizations, contactMechanismTypes, communicationEventStatusTypes] = await Promise.all([
        fetchFunction(),
        getPersons(),
        getOrganizations(),
        getContactMechanismTypes(),
        getCommunicationEventStatusTypes(),
      ]);

      if (Array.isArray(eventData)) {
        const enrichedEvents = eventData.map(event => {
          const fromPerson = persons.find(p => p.id === event.from_user_id);
          const fromOrganization = organizations.find(o => o.id === event.from_user_id);
          const from_user_name = fromPerson 
            ? `${fromPerson.id} - ${fromPerson.first_name} ${fromPerson.last_name} ${fromPerson.about_me || ''} (Person)`.trim()
            : fromOrganization 
              ? `${fromOrganization.id} - ${fromOrganization.name_en} ${fromOrganization.slogan || ''} (Organization)`.trim()
              : 'N/A';
          const toPerson = persons.find(p => p.id === event.to_user_id);
          const toOrganization = organizations.find(o => o.id === event.to_user_id);
          const to_user_name = toPerson 
            ? `${toPerson.id} - ${toPerson.first_name} ${toPerson.last_name} ${toPerson.about_me || ''} (Person)`.trim()
            : toOrganization 
              ? `${toOrganization.id} - ${toOrganization.name_en} ${toOrganization.slogan || ''} (Organization)`.trim()
              : 'N/A';
          return {
            ...event,
            from_user_name,
            to_user_name,
            contact_mechanism_type_description: contactMechanismTypes.find(c => c.id === event.contact_mechanism_type_id)?.description || 'N/A',
            communication_event_status_type_description: communicationEventStatusTypes.find(s => s.id === event.communication_event_status_type_id)?.description || 'N/A',
          };
        });
        setEvents(enrichedEvents);
        setError(null);
      } else {
        setError('Invalid data format received');
      }
    } catch (err: any) {
      if (err.message === 'No access token found' || err.response?.status === 401) {
        setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
        logout();
        navigate('/login');
      } else {
        setError(err.message || `ไม่สามารถโหลดข้อมูล${listType}ได้`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(getCommunicationEvents, 'ทั้งหมด');
  }, [navigate, logout]);

  const handleListAll = () => fetchData(getCommunicationEvents, 'ทั้งหมด');
  const handleListInbox = () => fetchData(getInboxCommunicationEvents, 'กล่องขาเข้า');
  const handleListSent = () => fetchData(getSentCommunicationEvents, 'กล่องขาออก');
  const handleListFavorite = () => fetchData(getFavoriteCommunicationEvents, 'รายการโปรด');

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        params.id ? (
          <UpdateButton
            onClick={() => navigate(`/communication-events/${params.id}`)}
          />
        ) : null
      ),
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'detail', headerName: 'Detail', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'from_user_id', headerName: 'From User ID', width: 120 },
    { field: 'from_user_name', headerName: 'From User', width: 300 },
    { field: 'to_user_id', headerName: 'To User ID', width: 120 },
    { field: 'to_user_name', headerName: 'To User', width: 300 },
    { field: 'contact_mechanism_type_description', headerName: 'Contact Mechanism', width: 150 },
    { field: 'communication_event_status_type_description', headerName: 'Status', width: 150 },
    {
      field: 'favorite_flag',
      headerName: 'Favorite',
      width: 100,
      valueFormatter: (value: boolean) => value ? 'Yes' : 'No',
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (value: string | null) => formatDateTime(value),
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      width: 180,
      valueFormatter: (value: string | null) => formatDateTime(value),
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBarCustom title="Communication Events" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            All Communication Events
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ListAllButton onClick={handleListAll} />
            <ListInboxButton onClick={handleListInbox} />
            <ListSentButton onClick={handleListSent} />
            <ListFavoriteButton onClick={handleListFavorite} />
            <AddButton onClick={() => navigate('/communication-events/create')} />
          </Box>
        </Box>
        {loading ? (
          <Loading />
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
            <DataTable
              columns={columns}
              rows={events}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}