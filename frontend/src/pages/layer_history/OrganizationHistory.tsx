import { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getOrganizationHistory } from '../../services/OrganizationHistory';
import { getOrganizationTypes } from '../../services/organizationTypes';
import { getIndustryTypes } from '../../services/industryTypes';
import { AuthContext } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import AppBarCustom from '../../components/AppBarCustom';
import Loading from '../../components/Loading';
import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '../../utils/time_util';

interface OrganizationHistory {
  id: number;
  organization_id: number | null;
  federal_tax_id: string | null;
  name_en: string | null;
  name_th: string | null;
  organization_type_id: number | null;
  organization_type_description: string | null;
  industry_type_id: number | null;
  industry_type_description: string | null;
  employee_count: number | null;
  slogan: string | null;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export default function OrganizationHistory() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState<OrganizationHistory[]>([]);
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
        const [historyData, organizationTypes, industryTypes] = await Promise.all([
          getOrganizationHistory(),
          getOrganizationTypes(),
          getIndustryTypes(),
        ]);

        if (Array.isArray(historyData)) {
          const enrichedHistory = historyData.map(record => ({
            ...record,
            organization_type_description: organizationTypes.find(t => t.id === record.organization_type_id)?.description || 'N/A',
            industry_type_description: industryTypes.find(i => i.id === record.industry_type_id)?.description || 'N/A',
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
    { field: 'organization_id', headerName: 'Organization ID', width: 120, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'federal_tax_id', headerName: 'Federal Tax ID', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'name_en', headerName: 'Name (EN)', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'name_th', headerName: 'Name (TH)', width: 150, valueFormatter: (value: string | null) => value || 'N/A' },
    { field: 'organization_type_description', headerName: 'Organization Type', width: 150 },
    { field: 'industry_type_description', headerName: 'Industry Type', width: 150 },
    { field: 'employee_count', headerName: 'Employee Count', width: 120, valueFormatter: (value: number | null) => value ?? 'N/A' },
    { field: 'slogan', headerName: 'Slogan', width: 200, valueFormatter: (value: string | null) => value || 'N/A' },
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
      <AppBarCustom title="Organization History" />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
          Organization History
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