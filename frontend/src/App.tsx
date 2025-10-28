// src/App.tsx
import { useEffect, useState } from 'react';
import './App.css';
import {
  getAllMacText,
  createMacText,
  lookupByMac,
  updateMacText,
  deleteMacText,
  MacText,
  LookupResponse,
} from './services/macmap';

function App() {
  const [items, setItems] = useState<MacText[]>([]);
  const [mac, setMac] = useState('');
  const [sensorCode, setSensorCode] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [lookupMac, setLookupMac] = useState('');
  const [lookupResult, setLookupResult] = useState<LookupResponse | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await getAllMacText();
      setItems(data);
    } catch (err: any) {
      alert('โหลดข้อมูลล้มเหลว: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    if (!mac || !sensorCode || !sensorName) return;
    try {
      await createMacText({ mac_address: mac, sensor_code: sensorCode, sensor_name: sensorName });
      setMac(''); setSensorCode(''); setSensorName('');
      loadAll();
    } catch (err: any) {
      alert('สร้างล้มเหลว: ' + (err.response?.data?.detail || err.message));
    }
  };

  const lookup = async () => {
    if (!lookupMac) return;
    try {
      const data = await lookupByMac(lookupMac);
      setLookupResult(data);
    } catch (err: any) {
      setLookupResult(null);
      alert('ไม่พบ MAC นี้: ' + (err.response?.data?.detail || err.message));
    }
  };

  const startEdit = (item: MacText) => {
    setEditId(item.id);
    setMac(item.mac_address);
    setSensorCode(item.sensor_code);
    setSensorName(item.sensor_name);
  };

  const update = async () => {
    if (!editId) return;
    try {
      await updateMacText(editId, {
        mac_address: mac,
        sensor_code: sensorCode,
        sensor_name: sensorName,
      });
      setEditId(null); setMac(''); setSensorCode(''); setSensorName('');
      loadAll();
    } catch (err: any) {
      alert('อัปเดตล้มเหลว: ' + (err.response?.data?.detail || err.message));
    }
  };

  const remove = async (id: number) => {
    if (!confirm('ยืนยันการลบ?')) return;
    try {
      await deleteMacText(id);
      loadAll();
    } catch (err: any) {
      alert('ลบล้มเหลว: ' + (err.response?.data?.detail || err.message));
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="school-theme">
      <header>
        <h1>ระบบจัดการ MAC Address</h1>
        <p className="subtitle">made by arapun</p>
      </header>

      <div className="section">
        <h2>{editId ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}</h2>
        <input
          placeholder="MAC Address (เช่น 00:1A:2B:3C:4D:5E)"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          disabled={editId !== null}
        />
        <input
          placeholder="รหัสเซ็นเซอร์ (เช่น S001)"
          value={sensorCode}
          onChange={(e) => setSensorCode(e.target.value)}
          disabled={editId !== null}
        />
        <input
          placeholder="ชื่อเซ็นเซอร์"
          value={sensorName}
          onChange={(e) => setSensorName(e.target.value)}
        />
        <button onClick={editId ? update : create} className="primary">
          {editId ? 'บันทึก' : 'เพิ่ม'}
        </button>
        {editId && (
          <button
            onClick={() => {
              setEditId(null); setMac(''); setSensorCode(''); setSensorName('');
            }}
            className="secondary"
          >
            ยกเลิก
          </button>
        )}
      </div>

      <div className="section">
        <h2>ค้นหาข้อมูลเซ็นเซอร์จาก MAC</h2>
        <input
          placeholder="ป้อน MAC Address"
          value={lookupMac}
          onChange={(e) => setLookupMac(e.target.value)}
        />
        <button onClick={lookup} className="primary">ค้นหา</button>
        {lookupResult && (
          <div className="result-box">
            <p><strong>ชื่อเซ็นเซอร์:</strong> {lookupResult.sensor_name}</p>
            <p><strong>รหัสเซ็นเซอร์:</strong> {lookupResult.sensor_code}</p>
            <p><strong>Token:</strong> <code>{lookupResult.token}</code></p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>รายการทั้งหมด {loading && '(กำลังโหลด...)'}</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>MAC Address</th>
              <th>Sensor Code</th>
              <th>Sensor Name</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.mac_address}</td>
                <td>{item.sensor_code}</td>
                <td>{item.sensor_name}</td>
                <td>{new Date(item.created_at).toLocaleString('th-TH')}</td>
                <td>
                  <button onClick={() => startEdit(item)} className="edit">แก้ไข</button>
                  <button onClick={() => remove(item.id)} className="delete">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;