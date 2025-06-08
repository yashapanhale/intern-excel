import { useState } from 'react';

function App() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // Called when user picks a file, just stores it in state
  const fileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Called when user clicks Upload button, sends the file to backend
  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Upload success:', data);
      alert('Upload successful!');
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed.');
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6 text-2xl font-bold text-indigo-600 border-b border-indigo-100">
            Analytics Platform
          </div>
          <nav className="mt-4">
            <ul>
              <li className="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
                Dashboard
              </li>
              <li className="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
                Upload History
              </li>
              <li className="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
                Settings
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Hello, <strong className="text-indigo-600 cursor-pointer hover:underline">User</strong>
              </span>

              <a href="/login" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                Login
              </a>
              <a href="/register" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Register
              </a>

              <a href="/profile" className="text-indigo-600 hover:underline">Profile</a>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Logout</button>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <section className="bg-white rounded-lg shadow p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Excel File</h2>
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* File input updates state */}
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  onChange={fileChange}
                />
                {/* Upload button triggers upload */}
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                  onClick={uploadFile}
                >
                  Upload
                </button>
              </div>
            </section>

            {/* Other sections remain unchanged */}
            <section className="bg-white rounded-lg shadow p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Graph</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">X Axis:</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    <option>Select Column</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Y Axis:</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    <option>Select Column</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition">Download</button>
                <div className="bg-indigo-50 flex-1 h-64 ml-6 rounded-lg flex items-center justify-center text-indigo-200 text-lg">
                  [ Chart Preview ]
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
