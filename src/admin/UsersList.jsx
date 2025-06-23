import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavSideBar from '../components/NavSideBar';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:3000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.users);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch users list');
      }
    };
    fetchUsers();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <NavSideBar role="admin">
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">👥 Users List</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2 mb-4 text-indigo-700">
              <div>Username</div>
              <div>Email</div>
              <div>No. of Files</div>
              <div>Role</div>
            </div>
            {currentItems.map((user) => (
                <div key={user._id} className="grid grid-cols-4 gap-4 border-b pb-2 mb-2 items-center">
                  <div>{user.username}</div>
                  <div className="truncate">{user.email}</div>
                  <div>{user.fileCount}</div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      (user.role || 'user') === 'admin' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </div>
                </div>
              ))}
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

export default UsersList;
