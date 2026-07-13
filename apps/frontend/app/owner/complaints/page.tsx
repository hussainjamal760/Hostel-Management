'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useUpdateComplaintMutation } from '@/lib/services/complaintApi';
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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Complaints Overview</h2>
          <p className="text-on-surface-variant font-body-md opacity-80">Monitor, track, and resolve issues reported in your properties.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors pointer-events-none z-10">filter_list</span>
                <select 
                    className="w-full sm:w-48 pl-12 pr-10 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant appearance-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-on-surface-variant/70">expand_more</span>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center text-on-surface-variant flex flex-col items-center bg-surface-container/30 rounded-[32px] border-dashed border-2 border-outline-variant">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">task_alt</span>
            <p className="font-headline-sm text-primary mb-1">No complaints found</p>
            <p className="font-body-md">Everything looks good! No issues match your current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {complaints.map((complaint: any) => (
              <div key={complaint._id} className="bg-surface-container-lowest rounded-[24px] shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      
                      <div className="flex items-center gap-3 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              complaint.status === 'OPEN' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border-green-200' :
                              'bg-surface-container text-on-surface-variant border-outline-variant/30'
                          }`}>
                              <span className="material-symbols-outlined text-[14px]">
                                {complaint.status === 'OPEN' ? 'error' : 
                                 complaint.status === 'IN_PROGRESS' ? 'timelapse' : 
                                 complaint.status === 'RESOLVED' ? 'check_circle' : 'info'}
                              </span>
                              {complaint.status}
                          </span>
                          
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              complaint.priority === 'URGENT' ? 'text-error bg-error-container border-error/20' : 
                              complaint.priority === 'HIGH' ? 'text-orange-700 bg-orange-100 border-orange-200' : 
                              'text-on-surface-variant bg-surface-container border-outline-variant/30'
                          }`}>
                              <span className="material-symbols-outlined text-[14px]">
                                {complaint.priority === 'URGENT' ? 'warning' : 
                                 complaint.priority === 'HIGH' ? 'priority_high' : 'low_priority'}
                              </span>
                              {complaint.priority}
                          </span>
                      </div>
                      
                      <h3 className="font-headline-sm text-primary mb-3">{complaint.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-label-md text-on-surface-variant tracking-wider">
                          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
                              <span className="material-symbols-outlined text-[16px]">person</span>
                              {complaint.studentId?.fullName || 'Unknown Student'}
                          </div>
                          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
                               <span className="material-symbols-outlined text-[16px]">domain</span>
                               {complaint.hostelId?.name || 'Unknown Hostel'} 
                               {complaint.studentId?.roomId?.roomNumber ? ` (Room ${complaint.studentId.roomId.roomNumber})` : ''}
                          </div>
                          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
                               <span className="material-symbols-outlined text-[16px]">category</span>
                               {complaint.category}
                          </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end shrink-0">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] font-label-md text-on-surface-variant/70 uppercase tracking-widest mt-0.5">{new Date(complaint.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-5 rounded-2xl mb-4 text-sm font-body-md text-primary border border-outline-variant/30">
                      {complaint.description}
                  </div>

                  {complaint.resolution && (
                      <div className="mb-4 p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-900/30">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">check_circle</span> Resolution
                          </h4>
                          <p className="text-sm font-body-md text-green-800 dark:text-green-300">{complaint.resolution}</p>
                      </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="bg-surface-container-low border-t border-outline-variant/50 p-4 px-8 flex justify-end gap-3">
                    {complaint.status !== 'RESOLVED' ? (
                        <button 
                            onClick={() => {
                                setSelectedComplaint(complaint);
                                setResolutionText('');
                            }}
                            className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_10px_-2px_rgba(var(--color-primary-rgb),0.4)] hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">build</span>
                            Resolve Issue
                        </button>
                    ) : (
                        <span className="text-[11px] font-bold uppercase tracking-widest text-green-700 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">done_all</span> Case Closed
                        </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {pagination && pagination.totalPages > 1 && (
             <div className="p-6 border border-outline-variant/50 rounded-2xl bg-surface-container-low/50 flex justify-between items-center mt-6">
                <button 
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-[11px] font-label-lg uppercase tracking-widest disabled:opacity-50 hover:bg-surface-container transition-colors flex items-center gap-1 text-primary"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span> Prev
                </button>
                <div className="text-sm font-label-md text-on-surface-variant uppercase tracking-widest">
                    Page <span className="font-bold text-primary mx-1">{pagination.page}</span> of {pagination.totalPages}
                </div>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-[11px] font-label-lg uppercase tracking-widest disabled:opacity-50 hover:bg-surface-container transition-colors flex items-center gap-1 text-primary"
                >
                    Next <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
        )}
      </div>

       {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-surface-container-lowest rounded-[32px] w-full max-w-lg shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-outline-variant/50 overflow-hidden">
            <div className="p-8 border-b border-outline-variant/40">
              <h3 className="font-headline-sm text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-tertiary">engineering</span>
                Resolve Complaint
              </h3>
              <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider flex flex-col gap-1">
                 <p>Resolving for: <strong className="text-primary">{selectedComplaint.studentId?.fullName}</strong></p>
                 <p>At Property: <strong className="text-primary">{selectedComplaint.hostelId?.name}</strong></p>
              </div>
            </div>
            
            <form onSubmit={handleResolve} className="p-8">
                <div className="relative group mb-8">
                    <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                      Resolution Note
                    </label>
                    <textarea 
                        className="w-full h-32 p-4 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant resize-none"
                        placeholder="Describe the action taken to resolve this issue..."
                        required
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                    ></textarea>
                </div>
                
                <div className="flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={() => setSelectedComplaint(null)}
                        className="px-6 py-3 font-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isUpdating}
                        className="px-6 py-3 font-label-md uppercase tracking-widest bg-primary hover:bg-primary/90 text-on-primary rounded-xl transition-all shadow-[0_4px_10px_-2px_rgba(var(--color-primary-rgb),0.4)] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:active:translate-y-0 flex items-center gap-2"
                    >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            Confirm Resolution
                          </>
                        )}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
