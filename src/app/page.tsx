'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">RAG MVP Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/chat" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Chat</h3>
                <p className="mt-2 text-sm text-gray-500">Interact with the RAG system</p>
              </div>
            </Link>
            <Link href="/documents" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                <p className="mt-2 text-sm text-gray-500">View ingested documents</p>
              </div>
            </Link>
            <Link href="/ingest" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Ingest</h3>
                <p className="mt-2 text-sm text-gray-500">Upload and ingest new documents</p>
              </div>
            </Link>
            <Link href="/users" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Users</h3>
                <p className="mt-2 text-sm text-gray-500">Manage users</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}