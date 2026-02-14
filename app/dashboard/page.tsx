'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface Bookmark {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const setup = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push('/login')
        return
      }

      setUser(userData.user)

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setBookmarks(data)

      const channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks'
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setBookmarks((prev) => [payload.new as Bookmark, ...prev])
            }

            if (payload.eventType === 'DELETE') {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    setup()
  }, [router])

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id
      }
    ])

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-9">
        <div className="flex justify-between items-center mb-9">
          <h1 className="text-4xl font-bold">Smart Bookmarks</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-4">Add New Bookmark</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={addBookmark}
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Add Bookmark
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {bookmark.title}
                </a>
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
