import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCommunicationEventHistory } from '../../services/CommunicationEventHistory';
import { getPersons } from '../../services/persons';
import { getOrganizations } from '../../services/organizations';
import { getContactMechanismTypes } from '../../services/contactMechanismTypes';
import { getCommunicationEventStatusTypes } from '../../services/communicationeventstatustypes';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '../../utils/time_util';

interface CommunicationEventHistory {
  id: number;
  communication_event_id: number | null;
  title: string | null;
  detail: string | null;
  from_user_id: number | null;
  from_user_name: string | null;
  to_user_id: number | null;
  to_user_name: string | null;
  contact_mechanism_type_id: number | null;
  contact_mechanism_type_description: string | null;
  communication_event_status_type_id: number | null;
  communication_event_status_type_description: string | null;
  favorite_flag: boolean;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export default function CommunicationEventHistory() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState<CommunicationEventHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
          logout();
          navigate('/login');
          return;
        }
        const [historyData, persons, organizations, contactMechanismTypes, communicationEventStatusTypes] = await Promise.all([
          getCommunicationEventHistory(),
          getPersons(),
          getOrganizations(),
          getContactMechanismTypes(),
          getCommunicationEventStatusTypes(),
        ]);

        if (Array.isArray(historyData)) {
          const enrichedHistory = historyData.map(record => {
            const fromPerson = persons.find(p => p.id === record.from_user_id);
            const fromOrganization = organizations.find(o => o.id === record.from_user_id);
            const from_user_name = fromPerson 
              ? `${fromPerson.id} - ${fromPerson.first_name} ${fromPerson.last_name} ${fromPerson.about_me || ''} (Person)`.trim()
              : fromOrganization 
                ? `${fromOrganization.id} - ${fromOrganization.name_en} ${fromOrganization.slogan || ''} (Organization)`.trim()
                : 'N/A';
            const toPerson = persons.find(p => p.id === record.to_user_id);
            const toOrganization = organizations.find(o => o.id === record.to_user_id);
            const to_user_name = toPerson 
              ? `${toPerson.id} - ${toPerson.first_name} ${toPerson.last_name} ${toPerson.about_me || ''} (Person)`.trim()
              : toOrganization 
                ? `${toOrganization.id} - ${toOrganization.name_en} ${toOrganization.slogan || ''} (Organization)`.trim()
                : 'N/A';
            return {
              ...record,
              from_user_name,
              to_user_name,
              contact_mechanism_type_description: contactMechanismTypes.find(c => c.id === record.contact_mechanism_type_id)?.description || 'N/A',
              communication_event_status_type_description: communicationEventStatusTypes.find(s => s.id === record.communication_event_status_type_id)?.description || 'N/A',
            };
          });
          setHistory(enrichedHistory);
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
          setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, logout]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'communication_event_id', headerName: 'Event ID', width: 120, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'title', headerName: 'Title', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'detail', headerName: 'Detail', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'from_user_id', headerName: 'From User ID', width: 120, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'from_user_name', headerName: 'From User', width: 300 },
    { field: 'to_user_id', headerName: 'To User ID', width: 120, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'to_user_name', headerName: 'To User', width: 300 },
    { field: 'contact_mechanism_type_description', headerName: 'Contact Mechanism', width: 150 },
    { field: 'communication_event_status_type_description', headerName: 'Status', width: 150 },
    { field: 'favorite_flag', headerName: 'Favorite', width: 100, valueFormatter: (value: boolean) => value ? 'Yes' : 'No' },
    { field: 'action', headerName: 'Action', width: 120, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'action_at', headerName: 'Action At', width: 180, valueFormatter: (value: string | null) => formatDateTime(value) },
    { field: 'action_by', headerName: 'Action By', width: 100, valueFormatter: (value: number | null) => value ?? 'N/A' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBarCustom title="Communication Event History" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
          Communication Event History
        </Typography>
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
              rows={history}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}