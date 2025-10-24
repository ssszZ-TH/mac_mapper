import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface CommunicationEventHistory {
  id: number;
  communication_event_id: number | null;
  title: string | null;
  detail: string | null;
  from_user_id: number | null;
  to_user_id: number | null;
  contact_mechanism_type_id: number | null;
  communication_event_status_type_id: number | null;
  favorite_flag: boolean;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export const getCommunicationEventHistory = async (): Promise<CommunicationEventHistory[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/communication_event_history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};