'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useUpdateComplaintMutation } from '@/lib/services/complaintApi';
import { HiOutlineFilter, HiOutlineSearch, HiX, HiCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function ManagerComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { data: complaintsResponse, isLoading } = useGetComplaintsQuery({ status: statusFilter });
  const [updateComplaint, { isLoading: isUpdating }] = useUpdateComplaintMutation();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [resolutionText, setResolutionText] = useState('');

  const complaints = complaintsResponse?.data || [];

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
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to resolve complaint');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
      try {
          await updateComplaint({ id, data: { status } }).unwrap();
          toast.success(`Marked as ${status}`);
      } catch (error: any) {
          toast.error('Failed to update status');
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">Complaints Management</h1>
            <p className="text-sm text-brand-text/60 dark:text-dark-text/60">Manage student complaints and requests</p>
        </div>
        
        <div className="flex gap-2">
            <select 
                className="px-4 py-2 rounded-xl bg-white dark:bg-dark-card border border-brand-primary/10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
            </select>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-brand-primary/5 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No complaints found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="p-6 hover:bg-brand-primary/5 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            complaint.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' :
                            complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {complaint.status}
                        </span>
                        <span className="text-xs font-mono text-gray-400">#{complaint._id.slice(-6)}</span>
                    </div>
                    <h3 className="font-bold text-lg text-brand-text dark:text-dark-text">{complaint.title}</h3>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    <p className="font-medium text-brand-primary">{complaint.studentId?.fullName}</p>
                    <p className="text-xs">Room {complaint.studentId?.roomId?.roomNumber || 'N/A'}</p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                    {complaint.description}
                </p>

                {complaint.resolution && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                        <h4 className="text-sm font-bold text-green-800 dark:text-green-400 mb-1 flex items-center gap-2">
                            <HiCheck className="w-4 h-4" /> Resolution
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">{complaint.resolution}</p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">Category:</span> {complaint.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">Priority:</span> 
                            <span className={`${
                                complaint.priority === 'URGENT' ? 'text-red-500 font-bold' : 
                                complaint.priority === 'HIGH' ? 'text-orange-500 font-bold' : ''
                            }`}>
                                {complaint.priority}
                            </span>
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {complaint.status !== 'RESOLVED' && (
                            <>
                                {complaint.status === 'OPEN' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(complaint._id, 'IN_PROGRESS')}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        Mark In Progress
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        setSelectedComplaint(complaint);
                                        setResolutionText('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors shadow-sm shadow-green-500/20"
                                >
                                    Resolve & Reply
                                </button>
                            </>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold text-brand-text dark:text-dark-text mb-4">Resolve Complaint</h3>
            <p className="text-sm text-gray-500 mb-4">
                You are resolving complaint <strong>#{selectedComplaint._id.slice(-6)}</strong> from <strong>{selectedComplaint.studentId?.fullName}</strong>.
            </p>
            
            <form onSubmit={handleResolve}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Resolution Note (Reply)</label>
                    <textarea 
                        className="w-full h-32 px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-brand-primary/10 focus:ring-2 focus:ring-brand-primary resize-none"
                        placeholder="Explain how the issue was resolved..."
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
                        className="px-6 py-2 font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
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
