import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NavSideBar from '../components/NavSideBar';

function UsersList() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    axios.get('http://localhost:3000/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Error:', err);
        alert('Access denied or session expired');
      });
  }, []);
    return (
    <NavSideBar role='admin' data={data}>
      <div className="p-4 text-xl font-bold">Welcome to User's List!</div>
    </NavSideBar>
  );
}

export default UsersList;