import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getOrganizations } from '../../services/organizations';
import { getOrganizationTypes } from '../../services/organizationTypes';
import { getIndustryTypes } from '../../services/industryTypes';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import UpdateButton from '../../components/buttons/UpdateButton';
import AddButton from '../../components/buttons/AddButton';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '../../utils/time_util';

interface Organization {
  id: number;
  username: string;
  email: string;
  federal_tax_id?: string | null;
  name_en: string;
  name_th?: string | null;
  organization_type_id?: number | null;
  organization_type_description?: string | null;
  industry_type_id?: number | null;
  industry_type_description?: string | null;
  employee_count?: number | null;
  slogan?: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function Organizations() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
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
        const [organizationData, organizationTypes, industryTypes] = await Promise.all([
          getOrganizations(),
          getOrganizationTypes(),
          getIndustryTypes(),
        ]);

        if (Array.isArray(organizationData)) {
          const enrichedOrganizations = organizationData.map(org => ({
            ...org,
            organization_type_description: organizationTypes.find(t => t.id === org.organization_type_id)?.description || 'N/A',
            industry_type_description: industryTypes.find(i => i.id === org.industry_type_id)?.description || 'N/A',
          }));
          setOrganizations(enrichedOrganizations);
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
            onClick={() => navigate(`/organizations/${params.id}`)}
          />
        ) : null
      ),
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'federal_tax_id', headerName: 'Federal Tax ID', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'name_en', headerName: 'Name (EN)', width: 150 },
    { field: 'name_th', headerName: 'Name (TH)', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'organization_type_description', headerName: 'Organization Type', width: 150 },
    { field: 'industry_type_description', headerName: 'Industry Type', width: 150 },
    { field: 'employee_count', headerName: 'Employee Count', width: 120, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'slogan', headerName: 'Slogan', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
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
      <AppBarCustom title="Organizations" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            All Organizations
          </Typography>
          <AddButton onClick={() => navigate('/organizations/create')} />
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
              rows={organizations}
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}