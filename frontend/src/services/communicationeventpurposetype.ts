import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface CommunicationEventPurposeType {
  id: number;
  description: string;
}

interface CreateData {
  description: string;
}

interface UpdateData {
  description?: string;
}

export const createCommunicationEventPurposeType = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${BASE_URL}/communication_event_purpose_types`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommunicationEventPurposeTypes = async (): Promise<CommunicationEventPurposeType[]> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/communication_event_purpose_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommunicationEventPurposeTypeById = async (id: number): Promise<CommunicationEventPurposeType> => {
  const token = Cookies.get('access_token');
  const response = await axios.get(`${BASE_URL}/communication_event_purpose_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCommunicationEventPurposeType = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  const response = await axios.put(`${BASE_URL}/communication_event_purpose_types/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCommunicationEventPurposeType = async (id: number) => {
  const token = Cookies.get('access_token');
  const response = await axios.delete(`${BASE_URL}/communication_event_purpose_types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};