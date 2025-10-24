import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getPersons } from '../../services/persons';
import { getGenderTypes } from '../../services/genderTypes';
import { getMaritalStatusTypes } from '../../services/maritalStatusTypes';
import { getCountries } from '../../services/countries';
import { getRacialTypes } from '../../services/racialTypes';
import { getIncomeRanges } from '../../services/incomeRanges';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import UpdateButton from '../../components/buttons/UpdateButton';
import AddButton from '../../components/buttons/AddButton';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDate, formatDateTime } from '../../utils/time_util';

interface Person {
  id: number;
  username: string;
  email: string;
  personal_id_number: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  nick_name?: string | null;
  birth_date: string;
  gender_type_id?: number | null;
  gender_type_description?: string | null;
  marital_status_type_id?: number | null;
  marital_status_type_description?: string | null;
  country_id?: number | null;
  country_name?: string | null;
  height: number;
  weight: number;
  racial_type_id?: number | null;
  racial_type_description?: string | null;
  income_range_id?: number | null;
  income_range_description?: string | null;
  about_me?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export default function Persons() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [persons, setPersons] = useState<Person[]>([]);
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
        const [personData, genderTypes, maritalStatusTypes, countries, racialTypes, incomeRanges] = await Promise.all([
          getPersons(),
          getGenderTypes(),
          getMaritalStatusTypes(),
          getCountries(),
          getRacialTypes(),
          getIncomeRanges(),
        ]);

        if (Array.isArray(personData)) {
          const enrichedPersons = personData.map(person => ({
            ...person,
            gender_type_description: genderTypes.find(g => g.id === person.gender_type_id)?.description || 'N/A',
            marital_status_type_description: maritalStatusTypes.find(m => m.id === person.marital_status_type_id)?.description || 'N/A',
            country_name: countries.find(c => c.id === person.country_id)?.iso_code || 'N/A',
            racial_type_description: racialTypes.find(r => r.id === person.racial_type_id)?.description || 'N/A',
            income_range_description: incomeRanges.find(i => i.id === person.income_range_id)?.description || 'N/A',
          }));
          setPersons(enrichedPersons);
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        params.id ? (
          <UpdateButton
            onClick={() => navigate(`/persons/${params.id}`)}
          />
        ) : null
      ),
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'personal_id_number', headerName: 'Personal ID', width: 150 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'middle_name', headerName: 'Middle Name', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
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
    { field: 'height', headerName: 'Height (cm)', width: 100 },
    { field: 'weight', headerName: 'Weight (kg)', width: 100 },
    { field: 'racial_type_description', headerName: 'Racial Type', width: 120 },
    { field: 'income_range_description', headerName: 'Income Range', width: 120 },
    { field: 'about_me', headerName: 'About Me', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
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
      <AppBarCustom title="Persons" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            All Persons
          </Typography>
          <AddButton onClick={() => navigate('/persons/create')} />
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
              rows={persons}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}