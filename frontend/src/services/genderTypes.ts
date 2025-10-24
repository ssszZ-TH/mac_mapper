import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface GenderType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createGenderType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/gender_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getGenderTypes = async (): Promise<GenderType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/gender_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getGenderTypeById = async (id: number): Promise<GenderType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/gender_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateGenderType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/gender_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteGenderType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/gender_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};