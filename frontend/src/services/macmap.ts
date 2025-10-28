// src/services/macmap.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8080/mac-text';

export interface MacText {
  id: number;
  mac_address: string;
  sensor_code: string;
  sensor_name: string;
  created_at: string;
  updated_at?: string | null;
}

export interface LookupResponse {
  sensor_name: string;
  sensor_code: string;
  token: string;
}

// ดึงข้อมูลทั้งหมด
export const getAllMacText = async (): Promise<MacText[]> => {
  const res = await axios.get<MacText[]>(API_BASE);
  return res.data;
};

// สร้างใหม่
export const createMacText = async (data: {
  mac_address: string;
  sensor_code: string;
  sensor_name: string;
}): Promise<MacText> => {
  const res = await axios.post<MacText>(API_BASE, data);
  return res.data;
};

// ค้นหา sensor_name + sensor_code + token
export const lookupByMac = async (mac_address: string): Promise<LookupResponse> => {
  const res = await axios.post<LookupResponse>(`${API_BASE}/lookup`, { mac_address });
  return res.data;
};

// อัปเดต
export const updateMacText = async (
  id: number,
  data: Partial<Pick<MacText, 'mac_address' | 'sensor_code' | 'sensor_name'>>
): Promise<MacText> => {
  const res = await axios.put<MacText>(`${API_BASE}/${id}`, data);
  return res.data;
};

// ลบ
export const deleteMacText = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};