import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080';

interface PersonHistory {
  id: number;
  person_id: number | null;
  personal_id_number: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  nick_name: string | null;
  birth_date: string | null;
  gender_type_id: number | null;
  marital_status_type_id: number | null;
  country_id: number | null;
  height: number | null;
  weight: number | null;
  racial_type_id: number | null;
  income_range_id: number | null;
  about_me: string | null;
  action: string | null;
  action_at: string;
  action_by: number | null;
}

export const getPersonHistory = async (): Promise<PersonHistory[]> => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get(`${BASE_URL}/person_history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};