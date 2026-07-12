'use client';

import React, { useState } from 'react';
import { useGetAllUsersQuery } from '@/lib/services/userApi';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: usersResponse, isLoading, error } = useGetAllUsersQuery({
    search: searchTerm,
    role: roleFilter,
    page,
    limit,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  return (
    <>
      {/* Header Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-primary tracking-tight mb-2">User Management</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Manage system access, roles, and review individual profiles across the platform.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 border border-secondary text-secondary rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">download</span>
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-all shadow-md">
              <span className="material-symbols-outlined">person_add</span>
              Add User
            </button>
          </div>
        </div>
      </section>

      {/* Filters & Actions */}
      <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-t-xl flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
        <div className="flex w-full md:w-auto gap-4 flex-col md:flex-row">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 border border-outline-variant rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-80 transition-all"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={handleRoleChange}
            className="px-4 py-3 border border-outline-variant rounded-xl bg-surface text-on-surface-variant focus:outline-none focus:border-primary transition-all"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
            <option value="MANAGER">Manager</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>
        
        <div className="text-sm font-bold text-on-surface-variant">
          {usersResponse?.pagination ? `Showing ${usersResponse.data.length} of ${usersResponse.pagination.total}` : 'Loading...'}
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-surface-container-lowest border-x border-b border-outline-variant rounded-b-xl overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-on-surface-variant font-bold">Loading users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-error font-bold bg-error-container/10">
                    Failed to load users. Please try again later.
                  </td>
                </tr>
              ) : usersResponse?.data?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                usersResponse?.data?.map((user) => (
                  <tr key={user._id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{user.name}</p>
                          <p className="text-xs text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        user.role === 'ADMIN' ? 'bg-primary text-white' :
                        user.role === 'OWNER' ? 'bg-secondary text-white' :
                        user.role === 'MANAGER' ? 'bg-primary-container text-on-primary-container' :
                        'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-lg transition-colors" title="Edit User">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors" title="Delete User">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersResponse?.pagination && usersResponse.pagination.totalPages > 1 && (
          <div className="p-6 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!usersResponse.pagination.hasPrev}
              className="px-4 py-2 border border-outline-variant rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
            >
              Previous
            </button>
            <div className="text-sm font-bold text-on-surface-variant flex gap-2">
              {[...Array(usersResponse.pagination.totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    page === i + 1 ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={!usersResponse.pagination.hasNext}
              className="px-4 py-2 border border-outline-variant rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
