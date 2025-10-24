import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface CommunicationEventStatusType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createCommunicationEventStatusType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/communication_event_status_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommunicationEventStatusTypes = async (): Promise<CommunicationEventStatusType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/communication_event_status_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommunicationEventStatusTypeById = async (id: number): Promise<CommunicationEventStatusType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/communication_event_status_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCommunicationEventStatusType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/communication_event_status_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCommunicationEventStatusType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/communication_event_status_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};