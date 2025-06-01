import React from 'react'

function Registration() {
  return (
    <div>
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Create a New Account</h2>
    <form class="space-y-4">
      <input type="text" placeholder="Full Name" class="w-full px-4 py-2 border border-gray-300 rounded" />
      <input type="email" placeholder="Email" class="w-full px-4 py-2 border border-gray-300 rounded" />
      <input type="password" placeholder="Password" class="w-full px-4 py-2 border border-gray-300 rounded" />
      <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
    </form>
    <p class="mt-4 text-sm text-center text-gray-600">
      Already have an account? <a href="/login" class="text-blue-600 hover:underline">Login here</a>
    </p>
  </div>
</div>

    </div>
  )
}

export default Registration
