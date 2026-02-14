'use client'

import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/dashboard`
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      
      {/* App Title and Subtitle */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Bookmark</h1>
        <p className="text-gray-600 text-lg">
          Save and manage your personal bookmarks securely.
        </p>
      </div>

      {/* Login Section */}
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
