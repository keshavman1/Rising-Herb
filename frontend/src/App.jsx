import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './auth/AuthContext';
import AdminRoute from './auth/AdminRoute';

export default function App(){
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Rising-Herb</Link>
          <div>
            {user ? (
              <>
                <span className="me-2">Hi, {user.email}</span>
                {user.role === 'admin' && <Link to="/admin" className="btn btn-sm btn-outline-primary me-2">Admin</Link>}
                <button className="btn btn-sm btn-outline-danger" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-primary me-2">Login</Link>
                <Link to="/signup" className="btn btn-sm btn-outline-success">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    </>
  );
}
