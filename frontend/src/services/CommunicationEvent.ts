import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface CommunicationEvent {
  id: number;
  title: string;
  detail: string | null;
  from_user_id: number;
  to_user_id: number;
  contact_mechanism_type_id: number | null;
  communication_event_status_type_id: number | null;
  favorite_flag: boolean;
  created_at: string;
  updated_at: string | null;
}

interface CreateData {
  title: string;
  detail: string | null;
  to_user_id: number;
  contact_mechanism_type_id: number | null;
  communication_event_status_type_id: number | null;
}

interface UpdateData {
  title?: string;
  detail?: string | null;
  contact_mechanism_type_id?: number | null;
  communication_event_status_type_id?: number | null;
  favorite_flag?: boolean;
}

export const getCommunicationEvents = async (): Promise<CommunicationEvent[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/communication_events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getInboxCommunicationEvents = async (): Promise<CommunicationEvent[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/communication_events/inbox`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSentCommunicationEvents = async (): Promise<CommunicationEvent[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/communication_events/sent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFavoriteCommunicationEvents = async (): Promise<CommunicationEvent[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/communication_events/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommunicationEventById = async (id: number): Promise<CommunicationEvent> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/communication_events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createCommunicationEvent = async (data: CreateData) => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.post(`${BASE_URL}/communication_events`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCommunicationEvent = async (id: number, data: UpdateData) => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.put(`${BASE_URL}/communication_events/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCommunicationEvent = async (id: number) => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.delete(`${BASE_URL}/communication_events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};