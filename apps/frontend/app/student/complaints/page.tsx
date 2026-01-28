'use client';

import { useState } from 'react';
import { useGetComplaintsQuery, useCreateComplaintMutation } from '@/lib/services/complaintApi';
import { HiOutlinePlus, HiOutlineFilter, HiOutlineSearch, HiX } from 'react-icons/hi';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">My Complaints</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors"
        >
          <HiOutlinePlus size={20} />
          <span>New Complaint</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No complaints found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{complaint.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    complaint.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' :
                    complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{complaint.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">Category:</span> {complaint.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">To:</span> {complaint.recipient}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">Date:</span> {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {complaint.resolution && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                    <h4 className="text-sm font-bold text-green-800 dark:text-green-400 mb-1">Resolution by Management</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">{complaint.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Complaint</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <HiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                  placeholder="Brief subject (min 5 chars)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Send To</label>
                <div className="grid grid-cols-2 gap-2">
                    {['MANAGER', 'OWNER', 'BOTH', 'ADMIN'].map((role) => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => setFormData({...formData, recipient: role})}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                formData.recipient === role
                                    ? 'bg-brand-primary text-white border-brand-primary'
                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {role === 'ADMIN' ? 'HOSTELITE ADMIN' : role}
                        </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                >
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="FOOD">Food</option>
                  <option value="SECURITY">Security</option>
                  <option value="CLEANLINESS">Cleanliness</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  minLength={20}
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent resize-none"
                  placeholder="Describe your issue in detail (min 20 chars)..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
