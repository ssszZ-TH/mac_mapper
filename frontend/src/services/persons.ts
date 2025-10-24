import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface Person {
  id: number;
  username: string;
  email: string;
  personal_id_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  nick_name?: string | null;
  birth_date: string;
  gender_type_id?: number | null;
  marital_status_type_id?: number | null;
  country_id?: number | null;
  height: number;
  weight: number;
  racial_type_id?: number | null;
  income_range_id?: number | null;
  about_me?: string | null;
  created_at: string;
  updated_at?: string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  personal_id_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  nick_name?: string | null;
  birth_date: string;
  gender_type_id?: number | null;
  marital_status_type_id?: number | null;
  country_id?: number | null;
  height: number;
  weight: number;
  racial_type_id?: number | null;
  income_range_id?: number | null;
  about_me?: string | null;
}

interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  personal_id_number?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string | null;
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
}

export const createPerson = async (data: RegisterData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/persons`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPersons = async (): Promise<Person[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/persons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPersonById = async (id: number): Promise<Person> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/persons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePerson = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/persons/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePerson = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/persons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};