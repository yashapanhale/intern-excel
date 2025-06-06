import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function App() {

  return (
     <>
    {/* <Registration></Registration>    // to display the Registration page
     <Login></Login>    //to display the login page 
     */}
    <div class="min-h-screen flex bg-gray-50">
 
  <aside class="w-64 bg-white shadow-lg hidden md:block">
    <div class="p-6 text-2xl font-bold text-indigo-600 border-b border-indigo-100">
      Analytics Platform
    </div>
    <nav class="mt-4">
      <ul>
        <li class="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
          Dashboard
        </li>
        <li class="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
          Upload History
        </li>
        <li class="px-6 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
          Settings
        </li>
      </ul>
    </nav>
  </aside>

  
  <div class="flex-1 flex flex-col">
  
    <header class="bg-white shadow-md px-6 py-4 flex justify-between items-center">

  <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>

  
  <div class="flex items-center space-x-4">
    
    <span class="text-gray-600">
      Hello, <strong class="text-indigo-600 cursor-pointer hover:underline">User</strong>
    </span>

    
    <a href="/login" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
      Login
    </a>
    <a href="/register" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      Register
    </a>

    
    
    <a href="/profile" class="text-indigo-600 hover:underline">Profile</a>
    <button class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
      Logout
    </button>
    
  </div>
</header>

    
    <main class="flex-1 p-6 space-y-6">
    
      <section class="bg-white rounded-lg shadow p-6 border border-indigo-100">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Upload Excel File</h2>
        <div class="flex flex-col md:flex-row items-center gap-4">
          <input
            type="file"
            class="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            Upload
          </button>
        </div>
      </section>

      
      <section class="bg-white rounded-lg shadow p-6 border border-indigo-100">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Generate Graph</h2>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block mb-1 font-medium text-gray-700">X Axis:</label>
            <select
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option>Select Column</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Y Axis:</label>
            <select
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option>Select Column</option>
            </select>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <button class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition">
            Download
          </button>
          <div class="bg-indigo-50 flex-1 h-64 ml-6 rounded-lg flex items-center justify-center text-indigo-200 text-lg">
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
