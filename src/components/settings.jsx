import React, { useState } from 'react';
import axios from 'axios';
import NavSideBar from './NavSideBar';

function Settings({ role, currentUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.user?.name || currentUser?.name || '',
    email: currentUser?.user?.email || currentUser?.email || ''
  });
  const [loading, setLoading] = useState(false);

  // For instant UI update after save (optional)
  const [profile, setProfile] = useState(currentUser?.user || currentUser);

  if (!profile) {
    return <div className="p-6 text-center text-gray-700">Loading user...</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3000/api/profile',
        {
          name: form.name,
          email: form.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Profile updated successfully!');
      setEditing(false);
      setProfile(response.data.user);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavSideBar role={role} data={profile}>
      <div className="p-6 max-w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>
        <div className="bg-white rounded-lg shadow p-6 border border-indigo-100 space-y-4">
          {!editing ? (
            <>
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{profile.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{profile.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Role:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  profile.role === 'admin'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {profile.role}
                </span>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </NavSideBar>
  );
}

export default Settings;