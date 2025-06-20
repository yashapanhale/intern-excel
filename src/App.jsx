import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/dashboard';
import UploadHistory from './components/UploadHistory';

function App(){
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path="/dashboard" element={
          <ErrorBoundary fallback={<p>Something went wrong.</p>}>
            <Dashboard />
          </ErrorBoundary>
        } />
        <Route path='/upload-history' element={<UploadHistory/>}/>
      </Routes>
    </Router>
  );
}

export default App;