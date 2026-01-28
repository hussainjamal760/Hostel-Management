'use client';

import { useState } from 'react';
import { useGetManagersQuery, useDeleteManagerMutation, IManager } from '@/lib/services/managerApi';
import { HiPlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUser, HiOutlineIdentification, HiOutlineCash, HiOutlineOfficeBuilding } from 'react-icons/hi';
import ManagerForm from '@/components/manager/ManagerForm';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto">
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
        message="Are you sure you want to remove this manager? This action will deactivate their account and prevent login."
        confirmText="Remove Manager"
        isLoading={isDeleting}
      />
      <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your hostel managers and staff</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-sm font-medium"
        >
          <HiPlus size={20} />
          Add Manager
        </button>
      </div>

      {managers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No Managers Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't added any managers yet.</p>
          <button 
            onClick={handleAddClick}
            className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-brand-primary font-medium"
          >
            Add Your First Manager
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {managers.map((manager) => (
            <div key={manager._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold text-xl">
                      {manager.avatar ? (
                         <img src={manager.avatar} alt={manager.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                         manager.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{manager.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineOfficeBuilding className="inline" />
                        {getHostelName(manager.hostelId)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditClick(manager)}
                      className="text-gray-400 hover:text-brand-primary transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Edit Manager"
                    >
                      <HiOutlinePencil size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(manager._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Delete Manager"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <HiOutlineIdentification /> CNIC
                    </span>
                    <span className="font-mono">{manager.cnic}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                       <HiOutlineCash /> Salary
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">₨ {manager.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                       <HiOutlineUser /> Phone
                    </span>
                    <span>{manager.phoneNumber}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Login ID</span>
                    <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-xs font-bold text-gray-700 dark:text-gray-300">
                      {manager.userId?.username || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
