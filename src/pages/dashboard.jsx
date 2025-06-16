import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
Chartjs.register (
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileChange = (e) => setSelectedFile(e.target.files[0]);
  const [ExcelData, setExcelData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return alert('Please login first');

    axios.get('http://localhost:3000/api/user/dashboard', {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setData(res.data))
    .catch(err => {
      console.error('Error:', err);
      alert('Access denied or seesion expired');
    });

    const fetchData = async () => {
      try{
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/user/data',{
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setExcelData(data);
        if(data.length > 0){
          const columns = Object.keys(data[0]);
          setColumnNames(columns);
          setSelectedX(columns[0]);
          setSelectedY(columns[1]);
        }  
      }catch(err){
        console.error('Error fetching Excel data:', err);
      }
    };
    fetchData();
  }, []);

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first!!!');
      return;
    }

    const formData = new FormData(); 
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers:{Authorization: `Bearer ${localStorage.getItem('token')}`,},
        body: formData,
      });
      const data = await res.json();

      if(!res.ok){
        throw new Error(data.error || 'Upload Failed');
        console.error('Upload failed', await res.text());
      }
      console.log('Upload success: ', data);
      alert('Upload successful!!!');
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
            <div className="p-6 text-4xl font-bold text-indigo-600 border-b border-indigo-100">
                VisEx
            </div>
            <nav className="mt-4">
            <ul>
                <li className="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">Dashboard</li>
                <li className="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">Upload History</li>
                <li className="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">Settings</li>
            </ul>
            </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                Hello, <strong className="text-indigo-600 cursor-pointer hover:underline">{data?.user?.name || 'User'}</strong>
                </span>
                <a href="/login" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">Login</a>
                <a href="/register" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Register</a>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition" onClick={()=>{
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}>Logout</button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Upload Section */}
           <section className="bg-white rounded-lg shadow p-6 border border-indigo-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Excel File</h2>
                <div className="flex flex-col md:flex-row items-center gap-4">
                <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    onChange={fileChange}/>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                    onClick={uploadFile}> Upload </button>
                </div>
           </section>

          <section className="bg-white rounded-lg shadow p-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Graph</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">X Axis:</label>
              <select
                value={selectedX}
                onChange={(e) => setSelectedX(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2">
                {columnNames.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Y Axis:</label>
              <select
                value={selectedY}
                onChange={(e) => setSelectedY(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2">
                {columnNames.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {ExcelData.length > 0 && selectedX && selectedY && (
            <div className="bg-indigo-50 min-h-[400px] rounded-lg p-4">
              <Bar
                data={{
                  labels: ExcelData.map((row) => row[selectedX]),
                  datasets: [{
                    label: `${selectedY} vs ${selectedX}`,
                    data: ExcelData.map((row) => parseFloat(row[selectedY])),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false },
                  },
                  scales: {
                    x: { title: { display: true, text: selectedX } },
                    y: { title: { display: true, text: selectedY } },
                  },
                }}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  </div>
);
}

export default Dashboard;
