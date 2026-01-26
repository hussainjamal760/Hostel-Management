'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useUpdateComplaintMutation } from '@/lib/services/complaintApi';
import { HiCheck, HiX, HiOfficeBuilding, HiUser, HiChatAlt2, HiSearch, HiFilter } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function OwnerComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  
  const { data: complaintsResponse, isLoading, refetch } = useGetComplaintsQuery({ 
      status: statusFilter || undefined,
      page,
      limit: 10
  });

  const [updateComplaint, { isLoading: isUpdating }] = useUpdateComplaintMutation();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [resolutionText, setResolutionText] = useState('');

  const complaints = complaintsResponse?.data || [];
  const pagination = complaintsResponse?.pagination;

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      await updateComplaint({
        id: selectedComplaint._id,
        data: {
          status: 'RESOLVED',
          resolution: resolutionText,
        }
      }).unwrap();
      
      toast.success('Complaint resolved successfully');
      setSelectedComplaint(null);
      setResolutionText('');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to resolve complaint');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and resolve issues in your hostels</p>
        </div>
        
        <div className="flex gap-2">
            <select 
                className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
            </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No complaints found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {complaints.map((complaint: any) => (
              <div key={complaint._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            complaint.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' :
                            complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {complaint.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            complaint.priority === 'URGENT' ? 'text-red-600 bg-red-50' : 
                            complaint.priority === 'HIGH' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 bg-gray-100'
                        }`}>
                            {complaint.priority} Priority
                        </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{complaint.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <HiUser className="text-gray-400" />
                            {complaint.studentId?.fullName || 'Unknown Student'}
                        </div>
                        <div className="flex items-center gap-1">
                             <HiOfficeBuilding className="text-gray-400" />
                             {complaint.hostelId?.name || 'Unknown Hostel'} 
                             {complaint.studentId?.roomId?.roomNumber ? ` (Room ${complaint.studentId.roomId.roomNumber})` : ''}
                        </div>
                        <div className="flex items-center gap-1">
                             <HiChatAlt2 className="text-gray-400" />
                             {complaint.category}
                        </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500 shrink-0">
                    <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs opacity-70">{new Date(complaint.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg mb-4 text-gray-700 dark:text-gray-300">
                    {complaint.description}
                </div>

                {complaint.resolution && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                        <h4 className="text-sm font-bold text-green-800 dark:text-green-400 mb-1 flex items-center gap-2">
                            <HiCheck className="w-4 h-4" /> Resolution
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">{complaint.resolution}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    {complaint.status !== 'RESOLVED' && (
                        <button 
                            onClick={() => {
                                setSelectedComplaint(complaint);
                                setResolutionText('');
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 text-sm font-bold rounded-lg shadow-sm transition-colors"
                        >
                            Resolve Issue
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Logic */}
        {pagination && pagination.totalPages > 1 && (
             <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <button 
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    Previous
                </button>
                <div className="text-sm text-gray-500">
                    Page <span className="font-medium text-gray-900">{pagination.page}</span> of {pagination.totalPages}
                </div>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        )}
      </div>

      {/* Resolution Modal */}
       {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Resolve Complaint</h3>
             <div className="mb-4 text-sm text-gray-500">
                Resolving for: <strong>{selectedComplaint.studentId?.fullName}</strong>
                <br />
                At: <strong>{selectedComplaint.hostelId?.name}</strong>
            </div>
            
            <form onSubmit={handleResolve}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Resolution Note</label>
                    <textarea 
                        className="w-full h-32 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#2c1b13] resize-none"
                        placeholder="Describe the action taken..."
                        required
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                    ></textarea>
                </div>
                
                <div className="flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={() => setSelectedComplaint(null)}
                        className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isUpdating}
                        className="px-6 py-2 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                    >
                        {isUpdating ? 'Saving...' : 'Confirm Resolution'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
