'use client';

import { useState } from 'react';
import { useGetManagersQuery, useDeleteManagerMutation, IManager } from '@/lib/services/managerApi';
import ManagerForm from '@/components/manager/ManagerForm';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { toast } from 'react-hot-toast';

export default function ManagersPage() {
  const { data: managersResponse, isLoading } = useGetManagersQuery();
  const { data: hostelsResponse } = useGetOwnerHostelsQuery();
  
  const managers = managersResponse?.data || [];
  const hostels = hostelsResponse?.data || [];
  
  const getHostelName = (hostelId: string) => {
    return hostels.find(h => h._id === hostelId)?.name || 'Unknown Hostel';
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<IManager | undefined>(undefined);

  const handleAddClick = () => {
    setEditingManager(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (manager: IManager) => {
    setEditingManager(manager);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingManager(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingManager(undefined);
  };

  const [deleteManager, { isLoading: isDeleting }] = useDeleteManagerMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteManager(deleteId).unwrap();
      toast.success('Manager removed successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete manager', error);
      toast.error('Failed to delete manager');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="w-full">
        <ManagerForm 
          initialValues={editingManager} 
          isEditMode={!!editingManager}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Remove Manager"
        message="Are you sure you want to remove this manager? This action will deactivate their account and prevent login to the portal."
        confirmText="Yes, Remove Manager"
        isLoading={isDeleting}
      />
      
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
             <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Staff Management</h2>
             <p className="text-on-surface-variant font-body-md opacity-80">Manage your hostel managers, their details, and access.</p>
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl text-label-md hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Manager
          </button>
        </div>

        {managers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-surface-container/30 rounded-3xl border-dashed border-2 border-outline-variant">
            <h2 className="font-headline-md text-primary mb-2">No Managers Found</h2>
            <p className="text-on-surface-variant font-body-md mb-6">You haven't assigned any managers to your properties yet.</p>
            <button 
              onClick={handleAddClick}
              className="px-6 py-3 bg-surface border border-outline-variant rounded-xl hover:bg-surface-container-high transition-colors text-primary font-label-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add Your First Manager
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {managers.map((manager) => (
              <div key={manager._id} className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] border border-outline-variant overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-8 flex-1">
                  
                  {/* Header & Avatar */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-sm uppercase overflow-hidden border border-primary/20">
                        {manager.avatar ? (
                           <img src={manager.avatar} alt={manager.name} className="w-full h-full object-cover" />
                        ) : (
                           manager.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-primary mb-1">{manager.name}</h3>
                        <p className="text-xs font-label-md text-on-surface-variant flex items-center gap-1.5 bg-surface px-2 py-1 rounded-md border border-outline-variant/30 w-fit">
                          <span className="material-symbols-outlined text-[14px]">domain</span>
                          {getHostelName(manager.hostelId)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(manager)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container rounded-full"
                        title="Edit Manager"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(manager._id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-2 hover:bg-error-container/20 rounded-full"
                        title="Delete Manager"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
                      <span className="material-symbols-outlined text-outline-variant">badge</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-widest">CNIC Number</p>
                        <p className="font-mono text-sm text-primary">{manager.cnic}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
                      <span className="material-symbols-outlined text-outline-variant">call</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-widest">Phone</p>
                        <p className="text-sm text-primary font-medium">{manager.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
                      <span className="material-symbols-outlined text-tertiary">payments</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-widest">Monthly Salary</p>
                        <p className="text-sm font-bold text-tertiary">{formatCurrency(manager.salary)}</p>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* Footer Login Info */}
                <div className="bg-surface-container-low border-t border-outline-variant/50 p-4 px-8 flex items-center justify-between">
                  <span className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">login</span> Login ID
                  </span>
                  <span className="font-mono bg-surface-container-highest px-3 py-1 rounded-md text-xs font-bold text-primary">
                    {manager.userId?.username || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
