'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useUpdateComplaintMutation } from '@/lib/services/complaintApi';
import { toast } from 'react-hot-toast';

export default function ManagerComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { data: complaintsResponse, isLoading, isFetching, refetch } = useGetComplaintsQuery({ status: statusFilter || undefined });
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

  const handleStatusUpdate = async (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') => {
      try {
          await updateComplaint({ id, data: { status } }).unwrap();
          toast.success(`Marked as ${status}`);
      } catch (error: any) {
          toast.error('Failed to update status');
      }
  };

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-[36px] text-secondary">support_agent</span>
                Complaints Management
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-1">Manage student complaints and requests</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">filter_list</span>
                <select 
                    className="w-full pl-12 pr-10 py-3 rounded-2xl bg-surface border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer shadow-sm transition-all hover:border-primary"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>

            <button 
                onClick={() => refetch()}
                className={`p-3 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary hover:border-primary transition-colors shadow-sm flex items-center justify-center ${isFetching ? 'animate-spin text-primary border-primary' : ''}`}
                title="Refresh List"
            >
                <span className="material-symbols-outlined">refresh</span>
            </button>
        </div>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
              <p className="text-body-lg text-on-surface-variant font-medium">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[40px]">check_circle</span>
              </div>
              <h3 className="text-display-sm text-primary mb-2">No Complaints Found</h3>
              <p className="text-body-lg text-on-surface-variant max-w-md">Everything is running smoothly! There are no complaints matching your current filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/50">
            {complaints.map((complaint: any) => (
              <div key={complaint._id} className="p-6 md:p-8 hover:bg-surface-container-lowest transition-colors group">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1.5 rounded-xl text-label-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                            complaint.status === 'OPEN' ? 'bg-secondary-container text-secondary border-secondary/20' :
                            complaint.status === 'IN_PROGRESS' ? 'bg-primary-container text-primary border-primary/20' :
                            complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border-green-200' :
                            'bg-surface-container text-on-surface border-outline-variant'
                        }`}>
                            <span className="material-symbols-outlined text-[16px]">
                                {complaint.status === 'OPEN' ? 'new_releases' :
                                 complaint.status === 'IN_PROGRESS' ? 'hourglass_top' :
                                 complaint.status === 'RESOLVED' ? 'check_circle' : 'info'}
                            </span>
                            {complaint.status}
                        </span>
                        <span className="text-label-md font-mono text-on-surface-variant uppercase tracking-wider bg-surface-container-highest px-2 py-1 rounded-lg">#{complaint._id.slice(-6)}</span>
                    </div>
                    <h3 className="text-display-sm text-primary group-hover:text-secondary transition-colors">{complaint.title}</h3>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-1 shrink-0">
                    <p className="text-body-sm font-bold text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {new Date(complaint.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="font-bold text-primary flex items-center gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        {(complaint.studentId as any)?.fullName}
                    </p>
                    <p className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold bg-surface-container-lowest px-2 py-0.5 rounded-lg border border-outline-variant/50 w-fit md:ml-auto">
                        Room {(complaint.studentId as any)?.roomId?.roomNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="text-body-lg text-on-surface mb-6 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative">
                    <span className="material-symbols-outlined absolute top-4 right-4 text-on-surface-variant/20 text-[40px] pointer-events-none">format_quote</span>
                    <p className="relative z-10 leading-relaxed">{complaint.description}</p>
                </div>

                {complaint.resolution && (
                    <div className="mb-6 p-5 bg-green-50 rounded-2xl border border-green-200 shadow-sm">
                        <h4 className="text-label-md font-bold uppercase tracking-wider text-green-700 mb-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">verified</span> 
                            Resolution Note
                        </h4>
                        <p className="text-body-md font-medium text-green-800 leading-relaxed">{complaint.resolution}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-outline-variant/50">
                    <div className="flex flex-wrap gap-4 text-body-md text-on-surface-variant w-full sm:w-auto">
                        <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant">
                            <span className="material-symbols-outlined text-[18px]">category</span>
                            <span className="font-bold text-primary">{complaint.category}</span>
                        </span>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold ${
                            complaint.priority === 'URGENT' ? 'bg-error-container text-error border-error/20' : 
                            complaint.priority === 'HIGH' ? 'bg-secondary-container text-secondary border-secondary/20' : 
                            'bg-surface-container text-on-surface border-outline-variant'
                        }`}>
                            <span className="material-symbols-outlined text-[18px]">priority_high</span>
                            {complaint.priority}
                        </span>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        {complaint.status !== 'RESOLVED' && (
                            <>
                                {complaint.status === 'OPEN' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(complaint._id, 'IN_PROGRESS')}
                                        className="flex-1 sm:flex-none px-6 py-2.5 text-label-md font-bold uppercase tracking-wider text-primary border border-primary hover:bg-primary hover:text-on-primary rounded-xl transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                        In Progress
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        setSelectedComplaint(complaint);
                                        setResolutionText('');
                                    }}
                                    className="flex-1 sm:flex-none px-6 py-2.5 text-label-md font-bold uppercase tracking-wider bg-green-600 text-white hover:bg-green-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                    Resolve
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
        <>
            <div className="fixed inset-0 z-[100] bg-surface-container-highest/80 backdrop-blur-sm" onClick={() => !isUpdating && setSelectedComplaint(null)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl w-full max-w-lg shadow-2xl p-0 relative border border-outline-variant pointer-events-auto flex flex-col">
                    <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-display-sm text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">task_alt</span>
                                Resolve Complaint
                            </h2>
                        </div>
                        <button 
                            onClick={() => setSelectedComplaint(null)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-surface-container text-on-surface-variant rounded-full transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <form onSubmit={handleResolve} className="p-6 space-y-6">
                        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px] text-primary">person</span>
                            </div>
                            <div>
                                <p className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant mb-1">Resolving for</p>
                                <p className="text-body-lg font-bold text-primary">{(selectedComplaint.studentId as any)?.fullName}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant mb-1">Ticket</p>
                                <p className="text-body-lg font-mono font-bold text-primary">#{selectedComplaint._id.slice(-6)}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">forum</span>
                                Resolution Note (Reply)
                            </label>
                            <textarea 
                                className="w-full h-32 px-4 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-outline resize-none shadow-sm"
                                placeholder="Explain how the issue was resolved..."
                                required
                                value={resolutionText}
                                onChange={(e) => setResolutionText(e.target.value)}
                            ></textarea>
                            <p className="text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">info</span>
                                This note will be visible to the student.
                            </p>
                        </div>
                        
                        <div className="pt-6 border-t border-outline-variant flex justify-end gap-3 mt-6">
                            <button 
                                type="button"
                                onClick={() => setSelectedComplaint(null)}
                                className="px-6 py-3 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isUpdating}
                                className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Confirm Resolution
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
      )}
    </div>
  );
}
