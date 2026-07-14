'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useCreateComplaintMutation } from '@/lib/services/complaintApi';
import { toast } from 'react-hot-toast';

export default function StudentComplaintsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: complaintsResponse, isLoading } = useGetComplaintsQuery({});
  const [createComplaint, { isLoading: isCreating }] = useCreateComplaintMutation();

  const complaints = complaintsResponse?.data || [];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'MAINTENANCE',
    priority: 'MEDIUM',
    recipient: 'MANAGER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComplaint(formData as any).unwrap();
      toast.success('Complaint submitted successfully');
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'MAINTENANCE',
        priority: 'MEDIUM',
        recipient: 'MANAGER',
      });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-secondary">support_agent</span>
            My Complaints
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-1">Submit and track your requests or issues</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>New Complaint</span>
        </button>
      </div>

      {/* Complaints List */}
      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
            <p className="text-body-lg text-on-surface-variant font-medium">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-surface-container-lowest rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50">thumb_up</span>
            </div>
            <h3 className="text-display-sm font-bold text-primary mb-2">No Complaints Yet</h3>
            <p className="text-body-lg text-on-surface-variant max-w-sm">You haven't submitted any complaints. If you face any issues, feel free to report them here.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/50">
            {complaints.map((complaint: any) => (
              <div key={complaint._id} className="p-6 md:p-8 hover:bg-surface-container-lowest transition-colors group">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5">
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
                    <h3 className="text-display-sm font-bold text-primary">{complaint.title}</h3>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-1 shrink-0">
                    <p className="text-body-sm font-bold text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {new Date(complaint.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-lg border border-outline-variant/50 w-fit md:ml-auto mt-2">
                        To: {complaint.recipient === 'ADMIN' ? 'HOSTELITE ADMIN' : complaint.recipient}
                    </p>
                  </div>
                </div>

                <div className="text-body-lg text-on-surface mb-6 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative">
                    <span className="material-symbols-outlined absolute top-4 right-4 text-on-surface-variant/20 text-[40px] pointer-events-none">format_quote</span>
                    <p className="relative z-10 leading-relaxed font-medium">{complaint.description}</p>
                </div>

                {complaint.resolution && (
                    <div className="p-5 bg-green-50 rounded-2xl border border-green-200 shadow-sm">
                        <h4 className="text-label-md font-bold uppercase tracking-wider text-green-700 mb-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">verified</span> 
                            Resolution from {complaint.recipient.toLowerCase()}
                        </h4>
                        <p className="text-body-md font-medium text-green-800 leading-relaxed">{complaint.resolution}</p>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 text-body-md text-on-surface-variant w-full sm:w-auto mt-6 border-t border-outline-variant/50 pt-5">
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Complaint Modal */}
      {isModalOpen && (
        <>
            <div className="fixed inset-0 z-[100] bg-surface-container-highest/80 backdrop-blur-sm transition-opacity" onClick={() => !isCreating && setIsModalOpen(false)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl w-full max-w-2xl shadow-2xl p-0 relative border border-outline-variant pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden">
                    
                    {/* Modal Header */}
                    <div className="p-6 md:p-8 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                        <div>
                            <h2 className="text-display-md text-primary flex items-center gap-3">
                                <span className="material-symbols-outlined text-[32px] text-secondary">add_circle</span>
                                New Complaint
                            </h2>
                            <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mt-1">Submit a detailed report</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            disabled={isCreating}
                            className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-container border border-outline-variant text-on-surface-variant rounded-full transition-colors disabled:opacity-50 shadow-sm"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    {/* Modal Body */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">title</span> Title
                            </label>
                            <input
                                type="text"
                                required
                                minLength={5}
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full px-5 py-4 rounded-2xl bg-background border-2 border-outline-variant/50 text-primary font-bold text-body-lg outline-none focus:border-primary focus:bg-white transition-all hover:border-outline-variant"
                                placeholder="E.g. AC not working in Room 102"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">category</span> Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-5 py-4 pl-12 pr-10 rounded-2xl bg-background border-2 border-outline-variant/50 text-primary font-bold outline-none focus:border-primary focus:bg-white transition-all hover:border-outline-variant appearance-none cursor-pointer"
                                    >
                                        <option value="MAINTENANCE">Maintenance</option>
                                        <option value="FOOD">Food & Mess</option>
                                        <option value="SECURITY">Security</option>
                                        <option value="CLEANLINESS">Cleanliness</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">list</span>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">priority_high</span> Priority
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                        className="w-full px-5 py-4 pl-12 pr-10 rounded-2xl bg-background border-2 border-outline-variant/50 text-primary font-bold outline-none focus:border-primary focus:bg-white transition-all hover:border-outline-variant appearance-none cursor-pointer"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">bolt</span>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">send</span> Send To
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['MANAGER', 'OWNER', 'BOTH', 'ADMIN'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({...formData, recipient: role})}
                                        className={`px-4 py-3 rounded-xl text-label-md font-bold tracking-widest uppercase border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                                            formData.recipient === role
                                                ? 'bg-primary/5 text-primary border-primary shadow-sm'
                                                : 'bg-surface text-on-surface-variant border-outline-variant/50 hover:border-outline hover:bg-surface-container-low'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[24px]">
                                            {role === 'MANAGER' ? 'badge' : 
                                             role === 'OWNER' ? 'real_estate_agent' : 
                                             role === 'BOTH' ? 'groups' : 'admin_panel_settings'}
                                        </span>
                                        {role === 'ADMIN' ? 'SYS ADMIN' : role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">description</span> Detailed Description
                            </label>
                            <textarea
                                required
                                minLength={20}
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full px-5 py-4 rounded-2xl bg-background border-2 border-outline-variant/50 text-primary font-bold text-body-lg outline-none focus:border-primary focus:bg-white transition-all hover:border-outline-variant resize-none"
                                placeholder="Please explain the issue clearly (minimum 20 characters)..."
                            />
                        </div>

                        <div className="pt-4 border-t border-outline-variant/50 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isCreating}
                                className="flex-1 py-4 bg-surface border-2 border-outline-variant text-on-surface-variant font-bold rounded-xl hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex-1 py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Submit
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
