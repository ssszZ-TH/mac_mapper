import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface OrganizationType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createOrganizationType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/organization_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getOrganizationTypes = async (): Promise<OrganizationType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/organization_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getOrganizationTypeById = async (id: number): Promise<OrganizationType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/organization_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateOrganizationType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/organization_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteOrganizationType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/organization_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};