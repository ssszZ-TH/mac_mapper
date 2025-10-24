import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'system_admin' | 'hr_admin' | 'organization_admin' | 'basetype_admin';
  created_at: string;
  updated_at: string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'system_admin' | 'hr_admin' | 'organization_admin' | 'basetype_admin';
}

interface UpdateData {
  username?: string;
  password?: string;
}

export const createUser = async (data: RegisterData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};