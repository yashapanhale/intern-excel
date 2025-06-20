import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import UploadModel from '../components/UploadModel';
import NavSideBar from './NavSideBar';
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chartjs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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
  const [isUploadModelOpen, setUploadModelOpen] = useState(false);
  const [chartType, setChartType] = useState('Bar');
  const [uploadHistory, setUploadHistory] = useState([]);
  const chartRef = useRef(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    axios.get('http://localhost:3000/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Error:', err);
        alert('Access denied or session expired');
      });

    // Fetch history
    fetchUploadHistory();
  }, []);

  const fetchUploadHistory = async () => {
    try {
      const res = await axios.get('http://localhost:3000/upload', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUploadHistory(res.data.files || []);
    } catch (err) {
      console.error('Failed to fetch upload history:', err);
      setUploadHistory([]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload Failed');

      alert('Upload successful!');
      setUploadModelOpen(false);
      fetchUploadHistory(); // Refresh list

      // Load the newly uploaded file
      loadDataByFilename(data.filename);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  };

  const loadDataByFilename = async (filename) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/user/data?filename=${filename}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const newData = res.data.data;
      setExcelData(newData);

      if (newData.length > 0) {
        const columns = Object.keys(newData[0]);
        setColumnNames(columns);
        setSelectedX(columns[0]);
        setSelectedY(columns[1]);
      }
    } catch (err) {
      console.error('Failed to load file data', err);
      alert('Could not load selected file data');
    }
  };

  const chartData = {
    labels: ExcelData.map((row) => row[selectedX]),
    datasets: [
      {
        label: `${selectedY} vs ${selectedX}`,
        data: ExcelData.map((row) => parseFloat(row[selectedY])),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { title: { display: true, text: selectedX } },
      y: { title: { display: true, text: selectedY } },
    },
  };

  const pieData = {
    labels: ExcelData.map((row) => row[selectedX]),
    datasets: [
      {
        label: selectedY,
        data: ExcelData.map((row) => parseFloat(row[selectedY])),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#8E44AD',
          '#2ECC71', '#E67E22', '#3498DB', '#E74C3C',
        ],
      }
    ],
  };

  return (
    <NavSideBar
      data={data}
      setExcelData={setExcelData}
      setColumnNames={setColumnNames}
      setSelectedX={setSelectedX}
      setSelectedY={setSelectedY}
      setUploadModelOpen={setUploadModelOpen}
    >
      <main className="flex-1 p-6 space-y-6">
        {/* Upload History Section 
        <section className="bg-white rounded-lg shadow p-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload History</h2>
          {uploadHistory.length === 0 ? (
            <p className="text-gray-500">No uploads found.</p>
          ) : (
            <ul className="space-y-2">
              {uploadHistory.map((file, index) => (
                <li key={index}>
                  <button
                    onClick={() => loadDataByFilename(file.filename)}
                    className="text-blue-600 hover:underline"
                  >
                    {file.filename}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>*/}

        {/* Chart Section */}
        <section ref={chartRef}
        className="bg-white rounded-lg shadow p-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Graph</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Bar">Bar</option>
                <option value="Line">Line</option>
                <option value="Pie">Pie</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">X Axis:</label>
              <select
                value={selectedX}
                onChange={(e) => setSelectedX(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {columnNames.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {ExcelData.length > 0 && selectedX && selectedY && (
            <div className="bg-indigo-50 rounded-lg p-4 h-[400px]">
              {chartType === 'Bar' && (
                <Bar
                  data={chartData}
                  options={{ ...chartOptions, maintainAspectRatio: false }}
                  height={400}
                />
              )}
              {chartType === 'Line' && (
                <Line
                  data={chartData}
                  options={{ ...chartOptions, maintainAspectRatio: false }}
                  height={400}
                />
              )}
              {chartType === 'Pie' && (
                <Pie
                  data={pieData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                  }}
                  height={400}
                />
              )}
            </div>
          )}
        </section>
      </main>

      <UploadModel
        isOpen={isUploadModelOpen}
        onClose={() => setUploadModelOpen(false)}
        onFileChange={fileChange}
        onUpload={uploadFile}
      />
    </NavSideBar>
  );
}

export default Dashboard;
