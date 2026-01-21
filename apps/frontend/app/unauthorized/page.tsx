'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-extrabold text-indigo-600">403</h1>
        <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <div className="pt-6">
          <Link
            href="/dashboard"
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
