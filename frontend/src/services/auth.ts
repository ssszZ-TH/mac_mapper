import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: 'system_admin' | 'hr_admin' | 'organization_admin' | 'basetype_admin' | 'person_user' | 'organization_user';
  created_at: string;
  updated_at: string | null;
  personal_id_number?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  nick_name?: string | null;
  birth_date?: string;
  gender_type_id?: number | null;
  marital_status_type_id?: number | null;
  country_id?: number | null;
  height?: number;
  weight?: number;
  racial_type_id?: number | null;
  income_range_id?: number | null;
  about_me?: string | null;
  federal_tax_id?: string;
  name_en?: string;
  name_th?: string | null;
  organization_type_id?: number | null;
  industry_type_id?: number | null;
  employee_count?: number | null;
  slogan?: string | null;
}

export const register = async (data: RegisterData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  const { access_token } = response.data;
  Cookies.set('access_token', access_token, { expires: 1 });
  return response.data;
};

export const getRole = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/users/myrole`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { role } = response.data;
  Cookies.set('role', role, { expires: 1 });
  return role;
};

export const getMyProfile = async (token: string): Promise<UserProfile> => {
  const response = await axios.get(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};