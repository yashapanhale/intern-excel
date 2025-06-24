import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:3000/api/login', { email, password });
    console.log('Login Successful', res.data);

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    alert('Logged in Successfully!!!');

    if (user.role === 'admin') {
      nav('/admin/dashboard');
    } else {
      nav('/dashboard');
    }

  } catch (err) {
    console.error('Login Failed: ', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Login failed');
  }
};

  return (
  <div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-6xl font-bold text-indigo-600 mb-6 text-center">VisEx</h1>
        <p className="text-blue-600 text-center mb-8">Visualize your Excel data with ease</p>
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required/>
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required/>
          <button type='submit' className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </p>
      </div>
    </div>    
  </div>
  );
}

export default Login