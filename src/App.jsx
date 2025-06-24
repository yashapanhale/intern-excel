import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/dashboard';
import UploadHistory from './components/UploadHistory';
import Settings from './components/settings';
// Admin Imports
import AdminDashboard from './admin/adminDashboard';
import UsersManagement from './admin/UsersManagement';
import AdminUploadHistory from './admin/adminUploadHistory';

function AppRoutes({ currentUser, setCurrentUser }) {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (
      location.pathname === '/login' ||
      location.pathname === '/register'
    ) {
      return;
    }
    if (!token) return;
    axios.get('http://localhost:3000/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setCurrentUser(res.data))
      .catch(err => {
        console.error('Error:', err);
        alert('Access denied or session expired');
      });
  }, [location.pathname, setCurrentUser]);

  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" />} />
      {/* User Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Registration />} />
      <Route path='/dashboard' element={<Dashboard role="user" currentUser={currentUser} />} />
      <Route path='/upload-history' element={<UploadHistory role="user" currentUser={currentUser} />} />
      <Route path="/settings" element={<Settings role="user" currentUser={currentUser} />} />
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard role="admin" currentUser={currentUser} />} />
      <Route path="/admin/users" element={<UsersManagement role="admin" currentUser={currentUser} />} />
      <Route path="/admin/graphs" element={<Dashboard role="admin" currentUser={currentUser} />} />
      <Route path="/admin/history" element={<AdminUploadHistory role="admin" currentUser={currentUser} />} />
      <Route path="/admin/settings" element={<Settings role="admin" currentUser={currentUser} />} />
    </Routes>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <AppRoutes currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </Router>
  );
}

export default App;