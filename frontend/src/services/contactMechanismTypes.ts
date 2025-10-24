import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface ContactMechanismType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createContactMechanismType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/contact_mechanism_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getContactMechanismTypes = async (): Promise<ContactMechanismType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/contact_mechanism_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getContactMechanismTypeById = async (id: number): Promise<ContactMechanismType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/contact_mechanism_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateContactMechanismType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/contact_mechanism_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteContactMechanismType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/contact_mechanism_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};