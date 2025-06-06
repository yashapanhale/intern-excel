import React from 'react'

function Login() {
  return (
    <div>
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Login to Your Account</h2>
    <form class="space-y-4">
      <input type="email" placeholder="Email" class="w-full px-4 py-2 border border-gray-300 rounded" />
      <input type="password" placeholder="Password" class="w-full px-4 py-2 border border-gray-300 rounded" />
      <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
    </form>
    <p class="mt-4 text-sm text-center text-gray-600">
      Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Register here</a>
    </p>
  </div>
</div>

      
    </div>
  )
}

export default Login
