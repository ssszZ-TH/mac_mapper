// src/App.tsx (เหมือนเดิม แต่เพิ่ม className="school-theme")
import { useEffect, useState } from 'react';
import './App.css';

interface MacText {
  id: number;
  mac_address: string;
  description: string;
}

function App() {
  const [items, setItems] = useState<MacText[]>([]);
  const [mac, setMac] = useState('');
  const [desc, setDesc] = useState('');
  const [lookupMac, setLookupMac] = useState('');
  const [lookupResult, setLookupResult] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const API = 'http://localhost:8080/mac-text';

  const loadAll = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data);
  };

  const create = async () => {
    if (!mac || !desc) return;
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mac_address: mac, description: desc }),
    });
    setMac(''); setDesc('');
    loadAll();
  };

  const lookup = async () => {
    if (!lookupMac) return;
    const res = await fetch(`${API}/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mac_address: lookupMac }),
    });
    if (res.ok) {
      const data = await res.json();
      setLookupResult(data.description);
    } else {
      setLookupResult('ไม่พบข้อมูล');
    }
  };

  const startEdit = (item: MacText) => {
    setEditId(item.id);
    setMac(item.mac_address);
    setDesc(item.description);
  };

  const update = async () => {
    if (!editId || !desc) return;
    await fetch(`${API}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: desc }),
    });
    setEditId(null); setMac(''); setDesc('');
    loadAll();
  };

  const remove = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadAll();
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
          placeholder="คำอธิบาย"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={editId ? update : create} className="primary">
          {editId ? 'บันทึก' : 'เพิ่ม'}
        </button>
        {editId && (
          <button onClick={() => { setEditId(null); setMac(''); setDesc(''); }} className="secondary">
            ยกเลิก
          </button>
        )}
      </div>

      <div className="section">
        <h2>ค้นหาคำอธิบายจาก MAC</h2>
        <input
          placeholder="ป้อน MAC Address"
          value={lookupMac}
          onChange={(e) => setLookupMac(e.target.value)}
        />
        <button onClick={lookup} className="primary">ค้นหา</button>
        {lookupResult && (
          <div className="result-box">
            <strong>ผลลัพธ์:</strong> {lookupResult}
          </div>
        )}
      </div>

      <div className="section">
        <h2>รายการทั้งหมด</h2>
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>MAC Address</th>
              <th>คำอธิบาย</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.mac_address}</td>
                <td>{item.description}</td>
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