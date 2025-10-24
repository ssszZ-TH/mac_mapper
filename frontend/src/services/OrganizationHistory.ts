import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface OrganizationHistory {
  id: number;
  organization_id: number | null;
  federal_tax_id: string | null;
  name_en: string | null;
  name_th: string | null;
  organization_type_id: number | null;
  industry_type_id: number | null;
  employee_count: number | null;
  slogan: string | null;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export const getOrganizationHistory = async (): Promise<OrganizationHistory[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/organization_history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};