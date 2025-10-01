import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      await signup(form);
      nav('/');
    }catch(e){
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h4>Sign up</h4>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input className="form-control mb-2" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} required />
        <input className="form-control mb-2" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button className="btn btn-success">Sign up</button>
      </form>
    </div>
  );
}
