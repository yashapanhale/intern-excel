import React,{useState} from 'react'
import axios from 'axios';

function Registration() {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const handleRegister = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:3000/api/register',{name, email, password, role });
      console.log('Registration Successful: ', res.data);
      alert(res.data.message);
    }catch(err){
      console.error('Registration Failed:', err.response?.data || err.message);
    }
  };
  return (
    <div>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-6xl font-bold text-indigo-600 mb-6 text-center">VisEx</h1>
    <p className="text-blue-600 text-center mb-8">Visualize your Excel data with ease</p>
    <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Create a New Account</h2>
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setRole('user')}
          className={`w-full px-6 py-3 rounded-md font-semibold transition-all duration-200
            ${role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-black border border-gray-300'}`}>User</button>
        <button
          type="button"
          onClick={() => setRole('admin')}
          className={`w-full px-6 py-3 rounded-md font-semibold transition-all duration-200
            ${role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white text-black border border-gray-300'}`}>Admin</button>
      </div>
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