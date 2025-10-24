import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface Organization {
  id: number;
  username: string;
  email: string;
  federal_tax_id?: string | null;
  name_en: string;
  name_th?: string | null;
  organization_type_id?: number | null;
  industry_type_id?: number | null;
  employee_count?: number | null;
  slogan?: string | null;
  created_at: string;
  updated_at: string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  federal_tax_id?: string | null;
  name_en: string;
  name_th?: string | null;
  organization_type_id?: number | null;
  industry_type_id?: number | null;
  employee_count?: number | null;
  slogan?: string | null;
}

interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  federal_tax_id?: string | null;
  name_en?: string;
  name_th?: string | null;
  organization_type_id?: number | null;
  industry_type_id?: number | null;
  employee_count?: number | null;
  slogan?: string | null;
}

export const createOrganization = async (data: RegisterData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/organizations`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getOrganizationById = async (id: number): Promise<Organization> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/organizations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateOrganization = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/organizations/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteOrganization = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/organizations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};