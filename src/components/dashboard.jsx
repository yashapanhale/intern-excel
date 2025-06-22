import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import UploadModel from '../components/UploadModel';
import NavSideBar from './NavSideBar';
import jsPDF from 'jspdf';
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
  const [ExcelData, setExcelData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const [isUploadModelOpen, setUploadModelOpen] = useState(false);
  const [chartType, setChartType] = useState('Bar');
  const chartRef = useRef();

  const fileChange = (e) => setSelectedFile(e.target.files[0]);

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

  const uploadFile = async () => {
    if (!selectedFile) return alert('Please select a file first!');

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

      const freshRes = await axios.get('http://localhost:3000/api/user/data?fresh=true', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const newData = freshRes.data.data;
      setExcelData(newData);
      if (newData.length > 0) {
        const columns = Object.keys(newData[0]);
        setColumnNames(columns);
        setSelectedX(columns[0]);
        setSelectedY(columns[1]);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
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

  const handleDownload = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 10;

    pdf.setFontSize(20);
    pdf.text("VisEx Report", pageWidth / 2, y, { align: "center" });
    y += 10;

    pdf.setFontSize(12);
    pdf.text(`User: ${data?.user?.name || 'N/A'}`, 10, y);
    y += 7;
    pdf.text(`File: ${selectedFile?.name || 'No file uploaded'}`, 10, y);
    y += 10;

    pdf.setFontSize(14);
    pdf.text(`${selectedY} vs ${selectedX} (${chartType} Chart)`, 10, y);
    y += 10;

    if (chartRef.current) {
      const chart = chartRef.current;
      const base64Image = chart.toBase64Image();
      pdf.addImage(base64Image, 'PNG', 10, y, 180, 100);
      y += 110;
    }

    pdf.save('VisEx_Report.pdf');
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
        <section className="bg-white rounded-lg shadow p-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Graph Settings</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-4">
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

          <div className="text-center mb-4">
            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700"
            >
              📥 Download Report (PDF)
            </button>
          </div>
        </section>

        {ExcelData.length > 0 && selectedX && selectedY && (
          <section className="bg-white rounded-lg shadow p-6 border border-indigo-100 space-y-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Chart Preview</h2>
            <div className="bg-indigo-50 rounded-lg p-4 h-[500px]">
              {chartType === 'Bar' && (
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === 'Line' && (
                <Line ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === 'Pie' && (
                <Pie ref={chartRef} data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } }}} />
              )}
            </div>
          </section>
        )}
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