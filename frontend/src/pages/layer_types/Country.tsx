import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCountries } from '../../services/countries';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import UpdateButton from '../../components/buttons/UpdateButton';
import AddButton from '../../components/buttons/AddButton';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';

interface Country {
  id: number;
  iso_code: string;
  name_en: string;
  name_th?: string | null;
}

export default function Countries() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบหรือ token หมดอายุ');
          logout();
          navigate('/login');
          return;
        }
        const data = await getCountries();
        if (Array.isArray(data)) {
          setCountries(data as Country[]);
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
    fetchCountries();
  }, [navigate, logout]);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        params.id ? (
          <UpdateButton
            onClick={() => navigate(`/country/${params.id}`)}
          />
        ) : null
      ),
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'iso_code', headerName: 'ISO Code', width: 120 },
    { field: 'name_en', headerName: 'Name (EN)', width: 150 },
    { field: 'name_th', headerName: 'Name (TH)', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBarCustom title="Countries" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            All Countries
          </Typography>
          <AddButton onClick={() => navigate('/country/create')} />
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
              rows={countries}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}