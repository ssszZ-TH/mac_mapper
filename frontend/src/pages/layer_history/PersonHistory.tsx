import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getPersonHistory } from '../../services/PersonHistory';
import { getGenderTypes } from '../../services/genderTypes';
import { getMaritalStatusTypes } from '../../services/maritalStatusTypes';
import { getCountries } from '../../services/countries';
import { getRacialTypes } from '../../services/racialTypes';
import { getIncomeRanges } from '../../services/incomeRanges';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDate, formatDateTime } from '../../utils/time_util';

interface PersonHistory {
  id: number;
  person_id: number | null;
  personal_id_number: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  nick_name: string | null;
  birth_date: string | null;
  gender_type_id: number | null;
  gender_type_description: string | null;
  marital_status_type_id: number | null;
  marital_status_type_description: string | null;
  country_id: number | null;
  country_name: string | null;
  height: number | null;
  weight: number | null;
  racial_type_id: number | null;
  racial_type_description: string | null;
  income_range_id: number | null;
  income_range_description: string | null;
  about_me: string | null;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export default function PersonHistory() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState<PersonHistory[]>([]);
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
        const [historyData, genderTypes, maritalStatusTypes, countries, racialTypes, incomeRanges] = await Promise.all([
          getPersonHistory(),
          getGenderTypes(),
          getMaritalStatusTypes(),
          getCountries(),
          getRacialTypes(),
          getIncomeRanges(),
        ]);

        if (Array.isArray(historyData)) {
          const enrichedHistory = historyData.map(record => ({
            ...record,
            gender_type_description: genderTypes.find(g => g.id === record.gender_type_id)?.description || 'N/A',
            marital_status_type_description: maritalStatusTypes.find(m => m.id === record.marital_status_type_id)?.description || 'N/A',
            country_name: countries.find(c => c.id === record.country_id)?.iso_code || 'N/A',
            racial_type_description: racialTypes.find(r => r.id === record.racial_type_id)?.description || 'N/A',
            income_range_description: incomeRanges.find(i => i.id === record.income_range_id)?.description || 'N/A',
          }));
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
    { field: 'person_id', headerName: 'Person ID', width: 100, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'personal_id_number', headerName: 'Personal ID', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'first_name', headerName: 'First Name', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'middle_name', headerName: 'Middle Name', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'last_name', headerName: 'Last Name', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'nick_name', headerName: 'Nick Name', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      width: 150,
      valueFormatter: (value: string | null) => formatDate(value),
    },
    { field: 'gender_type_description', headerName: 'Gender', width: 120 },
    { field: 'marital_status_type_description', headerName: 'Marital Status', width: 120 },
    { field: 'country_name', headerName: 'Country', width: 100 },
    { field: 'height', headerName: 'Height (cm)', width: 100, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'weight', headerName: 'Weight (kg)', width: 100, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'racial_type_description', headerName: 'Racial Type', width: 120 },
    { field: 'income_range_description', headerName: 'Income Range', width: 120 },
    { field: 'about_me', headerName: 'About Me', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
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
      <AppBarCustom title="Person History" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
          Person History
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