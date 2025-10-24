import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface RacialType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createRacialType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/racial_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getRacialTypes = async (): Promise<RacialType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/racial_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getRacialTypeById = async (id: number): Promise<RacialType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/racial_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateRacialType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/racial_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteRacialType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/racial_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};