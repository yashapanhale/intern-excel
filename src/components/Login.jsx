import React, {useState} from 'react'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async(e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:3000/api/login', {email,password,});
      console.log('Login Successful', res.data);
    }
    catch(err){
      console.error('Login Failed: ',err.response?.data || err.message);
    }
  };

  return (
  <div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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
