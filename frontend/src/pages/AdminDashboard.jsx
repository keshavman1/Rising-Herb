import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard(){
  const [herbs, setHerbs] = useState([]);
  const [form, setForm] = useState({ name:'', minPrice:100, maxPrice:1000, unit:'100 gm', whatsappNumber:'919812345678', description:'', category:'' });
  const [err, setErr] = useState('');

  useEffect(()=> { fetchHerbs(); }, []);
  async function fetchHerbs(){
    try{ const res = await api.get('/herbs'); setHerbs(res.data); } catch(e){ console.error(e); }
  }

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      await api.post('/herbs', form);
      setForm({ name:'', minPrice:100, maxPrice:1000, unit:'100 gm', whatsappNumber:'919812345678', description:'', category:'' });
      fetchHerbs();
    }catch(e){
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <div>
      <h4>Admin Dashboard</h4>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit} className="mb-3">
        <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <div className="row">
          <div className="col"><input className="form-control" placeholder="Min Price" type="number" value={form.minPrice} onChange={e=>setForm({...form, minPrice: e.target.value})} /></div>
          <div className="col"><input className="form-control" placeholder="Max Price" type="number" value={form.maxPrice} onChange={e=>setForm({...form, maxPrice: e.target.value})} /></div>
        </div>
        <input className="form-control my-2" placeholder="WhatsApp number (919...)" value={form.whatsappNumber} onChange={e=>setForm({...form, whatsappNumber:e.target.value})} />
        <button className="btn btn-primary mt-2">Create Herb</button>
      </form>

      <h5>Herbs</h5>
      <div className="row g-2">
        {herbs.map(h => (
          <div className="col-md-4" key={h._id}>
            <div className="card p-2">
              <b>{h.name}</b>
              <div>₹{h.minPrice} - ₹{h.maxPrice}</div>
              <div className="small">{h.whatsappNumber}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
