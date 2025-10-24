import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface UserHistory {
  id: number;
  user_id: number | null;
  username: string | null;
  password: string | null;
  email: string | null;
  role: string | null;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export const getUserHistory = async (): Promise<UserHistory[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/users_history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};