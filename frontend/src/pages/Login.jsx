import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      await login(form);
      nav('/');
    }catch(e){
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h4>Login</h4>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input className="form-control mb-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
