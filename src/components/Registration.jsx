import React,{useState} from 'react'
import axios from 'axios';

function Registration() {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:3000/api/register',{name, email, password});
      console.log('Registration Successful: ', res.data);
    }catch(err){
      console.error('Registration Failed:', err.response?.data || err.message);
    }
  };
  return (
    <div>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Create a New Account</h2>
    <form onSubmit={handleRegister} className="space-y-4">
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required/>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required/>
      <button type='submit' className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
    </form>
    <p className="mt-4 text-sm text-center text-gray-600">
      Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
    </p>
  </div>
</div>

    </div>
  )
}

export default Registration