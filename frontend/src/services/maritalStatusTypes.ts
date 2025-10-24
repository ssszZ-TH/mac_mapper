import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface MaritalStatusType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createMaritalStatusType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/marital_status_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMaritalStatusTypes = async (): Promise<MaritalStatusType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/marital_status_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMaritalStatusTypeById = async (id: number): Promise<MaritalStatusType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/marital_status_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateMaritalStatusType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/marital_status_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteMaritalStatusType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/marital_status_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};