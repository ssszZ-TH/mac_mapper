import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface IncomeRange {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createIncomeRange = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/income_ranges`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getIncomeRanges = async (): Promise<IncomeRange[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/income_ranges`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getIncomeRangeById = async (id: number): Promise<IncomeRange> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/income_ranges/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateIncomeRange = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/income_ranges/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteIncomeRange = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/income_ranges/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};