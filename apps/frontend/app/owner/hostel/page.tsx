'use client';

import { useState } from 'react';
import { useGetOwnerHostelsQuery, useDeleteHostelMutation } from '@/lib/services/hostelApi';
import HostelForm from '@/components/hostel/HostelForm';
import { IHostel } from '@hostelite/shared-types';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { toast } from 'react-hot-toast';

export default function MyHostelPage() {
  const { data: hostelResponse, isLoading } = useGetOwnerHostelsQuery();
  const hostels = hostelResponse?.data || [];
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<IHostel | undefined>(undefined);

  const handleAddClick = () => {
    setEditingHostel(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (hostel: IHostel) => {
    setEditingHostel(hostel);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingHostel(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingHostel(undefined);
  };

  const [deleteHostel, { isLoading: isDeleting }] = useDeleteHostelMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteHostel(deleteId).unwrap();
      toast.success('Hostel removed successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete hostel', error);
      toast.error('Failed to delete hostel');
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
        <HostelForm 
          initialValues={editingHostel} 
          isEditMode={!!editingHostel} 
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (hostels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="font-headline-md text-headline-md mb-4 text-primary">No Properties Found</h2>
        <p className="text-on-surface-variant font-body-md mb-8">You haven't set up your hostel portfolio yet.</p>
        <button 
          onClick={handleAddClick}
          className="px-6 py-3 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-colors shadow-lg font-label-md flex items-center gap-2 mx-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Your First Hostel
        </button>
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this hostel? All associated room data and records will be permanently archived and hidden."
        confirmText="Yes, Delete Property"
        isLoading={isDeleting}
      />

      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-1">My Hostels</h2>
            <p className="text-on-surface-variant font-body-md opacity-80">Manage your properties, capacity, and operational details.</p>
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl text-label-md hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_business</span>
            Add New Hostel
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {hostels.map((hostel) => (
            <div key={hostel._id} className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-lg">
               
               {/* Left Pane: Essential Identifiers */}
               <div className="md:w-1/3 bg-surface-container-low p-8 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary inline-flex">
                        <span className="material-symbols-outlined text-[32px]">apartment</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                           hostel.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                           hostel.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                           hostel.isActive ? 'bg-green-100 text-green-700' : 'bg-surface-variant text-on-surface-variant'
                       }`}>
                           {hostel.status === 'PENDING' ? 'Under Review' : 
                            hostel.status === 'REJECTED' ? 'Rejected' : 
                            (hostel.isActive ? 'Active' : 'Inactive')}
                       </span>
                    </div>
                    
                    <h3 className="font-headline-md text-primary mb-2">{hostel.name}</h3>
                    <p className="text-sm font-label-md text-on-surface-variant uppercase tracking-widest mb-6">CODE: {hostel.code}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-outline-variant mt-0.5 text-[20px]">location_on</span>
                        <div className="flex flex-col">
                          <span className="text-sm text-on-surface-variant">
                            {typeof hostel.address === 'object' 
                              ? `${hostel.address?.street || ''}`
                              : hostel.address}
                          </span>
                          <span className="text-sm font-bold text-primary">
                             {typeof hostel.address === 'object' ? hostel.address?.city : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline-variant text-[20px]">call</span>
                        <span className="text-sm text-primary font-medium">{hostel.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-outline-variant/50">
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-label-md mb-2">Monthly Rent Base</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(hostel.monthlyRent)}</p>
                  </div>
               </div>

               {/* Right Pane: Metrics & Actions */}
               <div className="md:w-2/3 p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-6">Capacity Overview</h4>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex items-center gap-4">
                         <div className="p-3 bg-secondary-container/30 rounded-xl text-secondary">
                            <span className="material-symbols-outlined">meeting_room</span>
                         </div>
                         <div>
                           <p className="text-xs text-on-surface-variant font-label-md uppercase tracking-wider mb-1">Total Rooms</p>
                           <p className="text-stats-lg font-stats-lg text-primary">{hostel.totalRooms}</p>
                         </div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex items-center gap-4">
                         <div className="p-3 bg-tertiary-container/30 rounded-xl text-tertiary">
                            <span className="material-symbols-outlined">bed</span>
                         </div>
                         <div>
                           <p className="text-xs text-on-surface-variant font-label-md uppercase tracking-wider mb-1">Total Beds</p>
                           <p className="text-stats-lg font-stats-lg text-primary">{hostel.totalBeds}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/30">
                     <button 
                       className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-outline-variant rounded-xl text-primary font-label-md hover:bg-surface-container-high transition-all"
                       onClick={() => handleEditClick(hostel)}
                     >
                       <span className="material-symbols-outlined text-[18px]">edit</span>
                       Edit Details
                     </button>
                     <button
                       className="flex items-center gap-2 px-5 py-2.5 bg-error-container/20 border border-error/20 text-error rounded-xl font-label-md hover:bg-error-container/40 transition-all"
                       onClick={() => handleDeleteClick(hostel._id)}
                     >
                       <span className="material-symbols-outlined text-[18px]">delete</span>
                       Archive
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
