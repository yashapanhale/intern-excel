import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/dashboard';
import UploadHistory from './components/UploadHistory';
import Settings from './components/settings';

// Admin Imports
import AdminDashboard from './admin/adminDashboard';
import UsersList from './admin/UsersList';
//import GraphSection from './admin/GraphSection';
//import AdminUploadHistory from './admin/adminUploadHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        {/* User Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/dashboard' element={<Dashboard role="user"/>} />
        <Route path='/upload-history' element={<UploadHistory role="user"/>} />
        <Route path="/settings" element={<Settings role="user"/>} />
        {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/graphs" element={<Dashboard role="admin"/>} />
          <Route path="/admin/history" element={<UploadHistory role="admin"/>} />
          <Route path="admin/settings" element={<Settings role="admin"/>} />
      </Routes>
    </Router>
  );
}

export default App;