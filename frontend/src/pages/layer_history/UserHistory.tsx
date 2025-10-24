import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserHistory } from '../../services/UserHistory';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '../../utils/time_util';

interface UserHistory {
  id: number;
  user_id: number | null;
  username: string | null;
  password: string | null;
  email: string | null;
  role: string | null;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export default function UserHistory() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserHistory = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
          logout();
          navigate('/login');
          return;
        }
        const data = await getUserHistory();
        if (Array.isArray(data)) {
          setHistory(data as UserHistory[]);
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
    fetchUserHistory();
  }, [navigate, logout]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'user_id', headerName: 'User ID', width: 100, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'username', headerName: 'Username', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'email', headerName: 'Email', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'role', headerName: 'Role', width: 120, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'action', headerName: 'Action', width: 120, valueFormatter: (value: string | null) => value || 'N/A' },
    {
      field: 'action_at',
      headerName: 'Action At',
      width: 180,
      valueFormatter: (value: string | null) => formatDateTime(value),
    },
    { field: 'action_by', headerName: 'Action By', width: 100, valueFormatter: (value: number | null) => value ?? 'N/A' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBarCustom title="User History" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
          User History
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