import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface Country {
  id: number;
  iso_code: string;
  name_en: string;
  name_th?: string | null;
}

interface CreateData {
  iso_code: string;
  name_en: string;
  name_th?: string | null;
}

interface UpdateData {
  iso_code?: string;
  name_en?: string;
  name_th?: string | null;
}

export const createCountry = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/countries`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCountries = async (): Promise<Country[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/countries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCountryById = async (id: number): Promise<Country> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/countries/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCountry = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/countries/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCountry = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/countries/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};