import React, { useEffect, useState } from 'react';
import NavSideBar from '../components/NavSideBar';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard({ data }) {
  const [stats, setStats] = useState(null);
  const [ExcelData, setExcelData] = useState([]);
  const [selectedX, setSelectedX] = useState('date');
  const [selectedY, setSelectedY] = useState('count');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setStats(res.data))
    .catch(err => {
      console.error('Failed to fetch stats:', err);
    });

    // Fetch user growth data for line graph
    axios.get('http://localhost:3000/api/admin/user-growth', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Transform data to ExcelData format for chart
      const data = res.data;
      // Assuming data.dates and data.counts arrays
      const excelDataFormatted = data.dates.map((date, index) => ({
        date: date,
        count: data.counts[index]
      }));
      setExcelData(excelDataFormatted);
    })
    .catch(err => {
      console.error('Failed to fetch user growth data:', err);
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { title: { display: true, text: selectedX } },
      y: { title: { display: true, text: selectedY } },
    },
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

  return (
    <NavSideBar role="admin" data={data}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatBox title="Total Users" value={stats?.totalUsers ?? '--'} />
        <StatBox title="Total Files Uploaded" value={stats?.totalFiles ?? '--'} />
        <StatBox title="Total Admins" value={stats?.totalAdmins ?? '--'} />
        <StatBox
          title="Recent Uploader"
          value={stats?.recentUploader ? stats.recentUploader.name : '--'}
        />
      </div>

      <section className="bg-white rounded-lg shadow p-6 border border-indigo-100 space-y-8 mt-8" style={{height: '500px'}}>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">User Growth</h2>
        <div className="bg-indigo-50 rounded-lg p-4 h-full">
          <Line options={chartOptions} data={chartData} />
        </div>
      </section>
    </NavSideBar>
  );
}

function StatBox({ title, value }) {
  return (
    <div className="bg-indigo-600 rounded-lg p-6 text-white shadow flex flex-col items-center">
      <div className="text-lg font-semibold mb-2">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

export default AdminDashboard;
