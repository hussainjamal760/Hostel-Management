'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useUpdateComplaintMutation, useDeleteComplaintMutation } from '@/lib/services/complaintApi';
import { HiCheck, HiOfficeBuilding, HiUser, HiTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function AdminComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: complaintsResponse, isLoading, refetch } = useGetComplaintsQuery({ 
      status: statusFilter || undefined,
      page,
      limit: 10
  });

  const [updateComplaint, { isLoading: isUpdating }] = useUpdateComplaintMutation();
  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation();
  
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
  
  const handleDelete = async (id: string) => {
      if(!confirm('Are you sure you want to delete this complaint?')) return;
      try {
          await deleteComplaint(id).unwrap();
          toast.success('Complaint deleted');
          refetch();
      } catch (error) {
          toast.error('Failed to delete complaint');
      }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#fcf2e9] text-[#5C4033] border border-[#ead6ce]">Open</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#ffede6] text-[#765749] border border-[#f2ded6]">In Progress</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#e6f4ea] text-[#1e4620] border border-[#ceead6]">Resolved</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase text-[#ba1a1a] bg-[#ffdad6] border border-[#ffb4ab]">Urgent</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase text-[#b06000] bg-[#fef7e0] border border-[#fce8b2]">High</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase text-[#7A5C4D] bg-[#F8F5F0] border border-[#d4c3bd]">Normal</span>;
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
          <div>
            <h1 className="text-3xl font-bold text-[#5C4033] mb-2 tracking-tight">Global Complaints</h1>
            <p className="text-[#7A5C4D]">Monitor and resolve student issues across all hostels.</p>
          </div>
          
          <div className="flex shrink-0">
            <select 
              className="px-5 py-3 rounded-xl bg-[#ffffff] border border-[#d4c3bd] text-[#5C4033] font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C4033] transition-all shadow-sm cursor-pointer appearance-none pr-10 relative"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235C4033%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              <option value="">All Status</option>
              <option value="OPEN">Open Only</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved Only</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid/List */}
        <div className="w-full">
          {isLoading ? (
            <div className="bg-[#ffffff] border border-[#d4c3bd] rounded-2xl p-12 text-center text-[#7A5C4D]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C4033] mx-auto mb-4"></div>
              Loading complaints...
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-[#ffffff] border border-[#d4c3bd] rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#F8F5F0] text-[#7A5C4D] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-[#5C4033] mb-2">No complaints found</h3>
              <p className="text-[#7A5C4D]">There are no complaints matching your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 w-full">
              {complaints.map((complaint: any) => (
                <div key={complaint._id} className="bg-[#ffffff] border border-[#d4c3bd] rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col w-full min-w-0">
                  
                  {/* Top Row: Meta Information */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 border-b border-[#f2ded6] pb-4 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(complaint.status)}
                      {getPriorityBadge(complaint.priority)}
                      <span className="text-sm font-mono text-[#a89892] bg-[#f8f5f0] px-2 py-0.5 rounded">#{complaint._id.slice(-6)}</span>
                    </div>
                    
                    <div className="text-right text-sm text-[#7A5C4D] shrink-0">
                      <p className="font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs opacity-80">{new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  
                  {/* Title & Details */}
                  <div className="mb-6 w-full min-w-0">
                    <h3 className="font-bold text-2xl text-[#5C4033] mb-3 break-words">{complaint.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#7A5C4D]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#f2ded6] text-[#5C4033] flex items-center justify-center shrink-0">
                          <HiUser size={16} />
                        </div>
                        <span className="font-medium">{complaint.studentId?.fullName || 'Unknown Student'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#f2ded6] text-[#5C4033] flex items-center justify-center shrink-0">
                          <HiOfficeBuilding size={16} />
                        </div>
                        <span className="font-medium">
                          {complaint.hostelId?.name || 'Unknown Hostel'} 
                          {complaint.studentId?.roomId?.roomNumber ? ` (Room ${complaint.studentId.roomId.roomNumber})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-[#fefaf8] border border-[#f2ded6] p-5 rounded-xl mb-6 text-[#504440] leading-relaxed break-words w-full min-w-0">
                    <p>{complaint.description}</p>
                  </div>

                  {/* Resolution Box (If Resolved) */}
                  {complaint.resolution && (
                    <div className="mb-6 p-5 bg-[#e6f4ea]/50 border border-[#ceead6] rounded-xl w-full min-w-0">
                      <h4 className="text-sm font-bold text-[#1e4620] mb-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1e4620] text-white flex items-center justify-center shrink-0">
                          <HiCheck className="w-4 h-4" />
                        </div>
                        Resolution Details
                      </h4>
                      <p className="text-[#1e4620] ml-8">{complaint.resolution}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap justify-end gap-3 mt-auto pt-2 w-full">
                    <button 
                      onClick={() => handleDelete(complaint._id)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
                    >
                      <HiTrash size={18} /> Delete Record
                    </button>

                    {complaint.status !== 'RESOLVED' && (
                      <button 
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setResolutionText('');
                        }}
                        className="bg-[#5C4033] hover:bg-[#432a1e] text-white px-6 py-2.5 text-sm font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                      >
                        Resolve Issue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 bg-[#ffffff] border border-[#d4c3bd] p-4 rounded-xl flex justify-between items-center w-full">
              <button 
                disabled={!pagination.hasPrev}
                onClick={() => setPage(page - 1)}
                className="px-5 py-2 border border-[#d4c3bd] rounded-xl text-sm font-bold text-[#5C4033] disabled:opacity-40 hover:bg-[#F8F5F0] transition-colors"
              >
                Previous
              </button>
              <div className="text-sm font-medium text-[#7A5C4D]">
                Page <span className="font-bold text-[#5C4033] mx-1">{pagination.page}</span> of {pagination.totalPages}
              </div>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage(page + 1)}
                className="px-5 py-2 border border-[#d4c3bd] rounded-xl text-sm font-bold text-[#5C4033] disabled:opacity-40 hover:bg-[#F8F5F0] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#ffffff] rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col">
            <div className="bg-[#F8F5F0] p-6 md:p-8 border-b border-[#d4c3bd]">
              <h3 className="text-2xl font-bold text-[#5C4033] mb-2">Resolve Complaint</h3>
              <p className="text-[#7A5C4D] text-sm">
                Provide a resolution note for <strong>{selectedComplaint.studentId?.fullName}</strong> from <strong>{selectedComplaint.hostelId?.name}</strong>.
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6 bg-[#fff8f6] p-4 rounded-xl border border-[#f2ded6]">
                <h4 className="font-bold text-[#5C4033] mb-1">{selectedComplaint.title}</h4>
                <p className="text-sm text-[#7A5C4D] line-clamp-3">{selectedComplaint.description}</p>
              </div>

              <label className="block text-sm font-bold mb-3 text-[#5C4033]">Official Resolution Note</label>
              <textarea 
                className="w-full h-36 px-4 py-3 rounded-xl bg-[#ffffff] border border-[#d4c3bd] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:border-transparent resize-none shadow-sm"
                placeholder="Describe exactly what action was taken to resolve this issue..."
                required
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
              ></textarea>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 w-full">
                <button 
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-6 py-3 font-bold text-[#7A5C4D] bg-[#F8F5F0] hover:bg-[#f2ded6] rounded-xl transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleResolve}
                  disabled={isUpdating || !resolutionText.trim()}
                  className="px-6 py-3 font-bold bg-[#5C4033] text-white rounded-xl hover:bg-[#432a1e] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isUpdating ? 'Saving...' : 'Mark as Resolved'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
