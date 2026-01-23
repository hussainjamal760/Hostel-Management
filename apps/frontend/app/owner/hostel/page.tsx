'use client';

import { useState } from 'react';
import { useGetOwnerHostelsQuery, useDeleteHostelMutation } from '@/lib/services/hostelApi';
import Link from 'next/link';
import { HiOutlinePencil, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineUserGroup, HiOutlineHome, HiPlus, HiOutlineTrash } from 'react-icons/hi';
import MapPicker from '@/components/ui/MapPicker';
import HostelForm from '@/components/hostel/HostelForm';
import { IHostel } from '@hostelite/shared-types';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  // If form is open, show form
  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto">
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">No Hostels Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">You haven't set up your hostel yet.</p>
        <button 
          onClick={handleAddClick}
          className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-lg"
        >
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
        title="Delete Hostel"
        message="Are you sure you want to delete this hostel? All associated room data will be archived and hidden."
        confirmText="Delete Hostel"
        isLoading={isDeleting}
      />
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Hostels</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your hostel details and settings</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-sm font-medium"
        >
          <HiPlus size={20} />
          Add New Hostel
        </button>
      </div>

      <div className="space-y-12">
        {hostels.map((hostel) => (
          <div key={hostel._id} className="border-b border-gray-200 dark:border-gray-700 pb-12 last:border-0 last:pb-0">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                   <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{hostel.name}</h2>
                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                       hostel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                   }`}>
                       {hostel.isActive ? 'Active' : 'Inactive'}
                   </span>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium"
                     onClick={() => handleEditClick(hostel)}
                   >
                     <HiOutlinePencil size={18} />
                     Edit Details
                   </button>
                   <button
                     className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium hover:border-red-300"
                     onClick={() => handleDeleteClick(hostel._id)}
                   >
                     <HiOutlineTrash size={18} />
                     Remove
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Main Details */}
                 <div className="md:col-span-2 space-y-6">
                     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                             <HiOutlineHome className="text-brand-primary" />
                             Basic Information
                         </h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div>
                                 <p className="text-sm text-gray-500 dark:text-gray-400">Hostel Code</p>
                                 <p className="font-mono text-lg font-medium">{hostel.code}</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
                                 <p className="text-lg font-medium text-brand-primary">₨ {hostel.monthlyRent.toLocaleString()}</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                                 <div className="flex items-center gap-2">
                                     <HiOutlinePhone className="text-gray-400" />
                                     <p className="text-lg font-medium">{hostel.phoneNumber}</p>
                                 </div>
                             </div>
                         </div>
                     </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                             <HiOutlineLocationMarker className="text-brand-primary" />
                             Location & Address
                         </h3>
                         <div className="grid grid-cols-1 gap-4 mb-4">
                             <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                  <p className="text-lg">{hostel.address.street}</p>
                             </div>
                              <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                                  <p className="text-lg">{hostel.address.city}</p>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Stats Side Panel */}
                 <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Capacity & Occupancy</h3>
                          <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                          <HiOutlineHome size={20} />
                                      </div>
                                      <span className="text-gray-600 dark:text-gray-300">Total Rooms</span>
                                  </div>
                                  <span className="font-bold text-xl">{hostel.totalRooms}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                          <HiOutlineUserGroup size={20} />
                                      </div>
                                      <span className="text-gray-600 dark:text-gray-300">Total Beds</span>
                                  </div>
                                  <span className="font-bold text-xl">{hostel.totalBeds}</span>
                              </div>
                          </div>
                      </div>
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
