import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavSideBar from '../components/NavSideBar';

const AdminUploadHistory = ({ role, currentUser }) => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:3000/api/admin/all-uploads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(data.uploads);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch uploads');
      }
    };

    fetchUploads();
  }, []);

  if (!currentUser) {
    return <div className="p-6 text-center text-gray-700">Loading user...</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(uploads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = uploads.slice(startIndex, startIndex + itemsPerPage);

  return (
    <NavSideBar role={role} data={currentUser}>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">📂 All Uploads (Admin)</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {uploads.length === 0 ? (
          <p className="text-gray-600">No uploads found.</p>
        ) : (
          <>
            {currentItems.map((entry) => {
              const d = new Date(entry.uploadDate);
              return (
                <div key={entry._id} className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-lg text-blue-600">{entry.fileName}</span>
                      <p className="text-sm text-gray-700 mt-1">
                        Uploaded by: <span className="font-bold">{entry.user?.name}</span>
                        {entry.user?.email && (
                          <span className="text-gray-500"> ({entry.user.email})</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>Date: {d.toLocaleDateString()}</p>
                      <p>Time: {d.toLocaleTimeString()}</p>
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
  );
};

export default AdminUploadHistory;