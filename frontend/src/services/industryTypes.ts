import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface IndustryType {
  id: number;
  naisc: string;
  description: string;
}

interface CreateData {
  naisc: string;
  description: string;
}

interface UpdateData {
  naisc?: string;
  description?: string;
}

export const createIndustryType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/industry_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getIndustryTypes = async (): Promise<IndustryType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/industry_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getIndustryTypeById = async (id: number): Promise<IndustryType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/industry_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateIndustryType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/industry_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteIndustryType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/industry_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};