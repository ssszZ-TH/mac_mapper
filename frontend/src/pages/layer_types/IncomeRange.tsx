import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getIncomeRanges } from '../../services/incomeRanges';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import UpdateButton from '../../components/buttons/UpdateButton';
import AddButton from '../../components/buttons/AddButton';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';

interface IncomeRange {
  id: number;
  description: string;
}

export default function IncomeRanges() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ranges, setRanges] = useState<IncomeRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanges = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
          logout();
          navigate('/login');
          return;
        }
        const data = await getIncomeRanges();
        if (Array.isArray(data)) {
          setRanges(data as IncomeRange[]);
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
    fetchRanges();
  }, [navigate, logout]);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        params.id ? (
          <UpdateButton
            onClick={() => navigate(`/income-range/${params.id}`)}
          />
        ) : null
      ),
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'description', headerName: 'Description', width: 200 },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBarCustom title="Income Ranges" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            All Income Ranges
          </Typography>
          <AddButton onClick={() => navigate('/income-range/create')} />
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
              rows={ranges}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}