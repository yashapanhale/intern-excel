import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/user/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data.history);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch upload history');
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📂 Upload History</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {history.length === 0 && <p className="text-gray-600">No uploads yet.</p>}

      {history.map((entry, index) => {
        const date = new Date(entry.uploadDate);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div key={index} className="border-b border-gray-300 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{entry.fileName}</p>
                <p className="text-sm text-gray-700 mt-1">
                  Chart Type: <span className="italic">bar</span>
                </p>
              </div>
              <div className="text-right">
                <button className="text-yellow-500 hover:text-yellow-600 text-sm mr-2">
                  ⭐ Star
                </button>
                <div className="text-xs text-gray-500">
                  <p>Date: {formattedDate}</p>
                  <p>Time: {formattedTime}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UploadHistory;
