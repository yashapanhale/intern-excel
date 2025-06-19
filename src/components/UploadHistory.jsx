import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavSideBar from './NavSideBar';

const UploadHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:3000/api/user/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(data.history);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch upload history');
      }
    };
    fetchHistory();
  }, []);

  return (
    <NavSideBar>
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">📂 Upload History</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {history.length === 0 ? (
          <p className="text-gray-600">No uploads yet.</p>
        ) : history.map((entry) => {
          const d = new Date(entry.uploadDate);
          return (
            <div key={entry._id} className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <button
                    onClick={() => window.location.href = `/dashboard?fileId=${entry._id}`}
                    className="font-semibold text-lg text-blue-600 hover:underline"
                  >
                    {entry.fileName}
                  </button>
                  <p className="text-sm text-gray-700 mt-1">
                    Chart Type: <span className="italic">bar</span>
                  </p>
                </div>
                <div className="text-right">
                  <button className="text-yellow-500 hover:text-yellow-600 text-sm mr-2">
                    ⭐ Star
                  </button>
                  <div className="text-xs text-gray-500">
                    <p>Date: {d.toLocaleDateString()}</p>
                    <p>Time: {d.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </NavSideBar>
  );
};

export default UploadHistory;
