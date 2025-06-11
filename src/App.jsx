import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './pages/dashboard';

function App(){
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;