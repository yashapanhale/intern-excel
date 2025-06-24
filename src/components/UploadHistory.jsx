import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavSideBar from './NavSideBar';
import UploadModel from './UploadModel';

const UploadHistory = ({ role, currentUser }) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [uploadModelOpen, setUploadModelOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

    if (currentUser) {
      fetchHistory();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className="p-6 text-center text-gray-700">Loading user...</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  // Dummy file upload functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
  };

  const handleUpload = () => {
    console.log('Uploading file...');
  };

  return (
    <>
      <UploadModel
        isOpen={uploadModelOpen}
        onClose={() => setUploadModelOpen(false)}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
      />

      <NavSideBar
        role={role}
        data={currentUser}
        setExcelData={() => {}}
        setColumnNames={() => {}}
        setSelectedX={() => {}}
        setSelectedY={() => {}}
        setUploadModelOpen={setUploadModelOpen}
      >
        <div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">📂 Upload History</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {history.length === 0 ? (
            <p className="text-gray-600">No uploads yet.</p>
          ) : (
            <>
              {currentItems.map((entry) => {
                const d = new Date(entry.uploadDate);
                return (
                  <div key={entry._id} className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <button
                          onClick={() =>
                            (window.location.href = `/dashboard?fileId=${entry._id}`)
                          }
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

              {/* Pagination Buttons */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </NavSideBar>
    </>
  );
};

export default UploadHistory;