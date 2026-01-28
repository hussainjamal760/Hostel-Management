'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout, updateUser } from '@/lib/features/authSlice';
import { 
  useGetMyLatestRequestQuery, 
  useCreateOwnerRequestMutation 
} from '@/lib/services/ownerRequestApi';
import { useUpdateMeMutation } from '@/lib/services/userApi';
import { useUploadImageMutation } from '@/lib/services/uploadApi';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineUpload,
  HiOutlineShieldCheck,
  HiOutlineIdentification,
} from 'react-icons/hi';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  const { data: latestRequestData, isLoading: requestLoading, refetch } = useGetMyLatestRequestQuery();
  const [createRequest, { isLoading: submittingRequest }] = useCreateOwnerRequestMutation();
  const [updateMe, { isLoading: updatingProfile }] = useUpdateMeMutation();
  const [uploadImage] = useUploadImageMutation(); 
  
  const latestRequest = latestRequestData?.data;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <HiOutlineClock size={14} />
            Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            <HiOutlineCheck size={14} />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
            <HiOutlineX size={14} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = (avatar: any) => {
    if (!avatar) return null;
    if (typeof avatar === 'string') return avatar;
    return avatar.url;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100 tracking-tight">Hostelite</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:text-red-600 dark:hover:text-red-400"
          >
            <HiOutlineLogout size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
              <div className="relative group mx-auto mb-4">
                <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-700 p-1 ring-2 ring-indigo-50 dark:ring-indigo-900/30">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    {getAvatarUrl(user?.avatar) ? (
                      <img src={getAvatarUrl(user?.avatar)} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold">
                        {getInitials(user?.name || 'User')}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowEditProfileModal(true)}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-transform hover:scale-105"
                  title="Edit Avatar"
                >
                  <HiOutlineCamera size={16} />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1 mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 uppercase tracking-wide">
                  {user?.role}
                </span>
                {user?.isEmailVerified && (
                  <span className="text-green-500" title="Verified Account">
                    <HiOutlineShieldCheck size={18} />
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowEditProfileModal(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <HiOutlinePencil size={16} />
                Edit Profile
              </button>
            </div>

            {(user?.role as string) === 'CLIENT' && (
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md text-white">
                 <h3 className="text-lg font-bold mb-2">Want to list your hostel?</h3>
                 <p className="text-indigo-100 text-sm mb-4">Join our community of hostel owners and reach more students.</p>
                 <button 
                    onClick={() => setShowRequestModal(true)}
                    className="w-full py-2 px-4 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
                 >
                   Become an Owner
                 </button>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                   <HiOutlineIdentification className="text-indigo-500" />
                   Personal Information
                 </h3>
               </div>
               <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                     <p className="text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                       <HiOutlineUser className="text-gray-400" />
                       {user?.name}
                     </p>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                     <p className="text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                       <HiOutlineMail className="text-gray-400" />
                       {user?.email}
                     </p>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</label>
                     <p className="text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                       <HiOutlinePhone className="text-gray-400" />
                       {user?.phone || 'Not provided'}
                     </p>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Since</label>
                     <p className="text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                       <HiOutlineClock className="text-gray-400" />
                       {new Date().getFullYear()} 
                     </p>
                   </div>
                 </div>
               </div>
            </div>

            {user?.role === 'ADMIN' && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                     <HiOutlineOfficeBuilding size={24} />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin Portal</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Manage the entire platform system.</p>
                   </div>
                 </div>
                 <Link
                   href="/admin/dashboard"
                   className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                 >
                   Open Dashboard
                 </Link>
              </div>
            )}

            {user?.role === 'OWNER' && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                     <HiOutlineOfficeBuilding size={24} />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Owner Dashboard</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Manage your properties and bookings.</p>
                   </div>
                 </div>
                 <Link
                   href="/owner/dashboard"
                   className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                 >
                   Open Dashboard
                 </Link>
              </div>
            )}

            {user?.role === 'STUDENT' && latestRequest && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Hostel Owner Request</h3>
                   {getStatusBadge(latestRequest.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">Business Name</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{latestRequest.businessName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">Submitted on</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {new Date(latestRequest.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {latestRequest.status === 'REJECTED' && latestRequest.adminNotes && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-sm text-red-700 dark:text-red-400">
                    <p className="font-bold mb-1">Feedback:</p>
                    <p>{latestRequest.adminNotes}</p>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="mt-3 text-red-700 dark:text-red-400 underline font-medium hover:no-underline"
                    >
                      Submit a new request
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </main>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            refetch();
          }}
          createRequest={createRequest}
          submitting={submittingRequest}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfileModal(false)}
          onSuccess={(updatedUser) => {
            setShowEditProfileModal(false);
            dispatch(updateUser(updatedUser)); 
          }}
          updateMe={updateMe}
          uploadImage={uploadImage}
          submitting={updatingProfile}
          getAvatarUrl={getAvatarUrl}
        />
      )}
    </div>
  );
}

interface RequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  createRequest: any;
  submitting: boolean;
}

function RequestModal({ onClose, onSuccess, createRequest, submitting }: RequestModalProps) {
    const [formData, setFormData] = useState({
        businessName: '',
        businessPhone: '',
      });
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.businessName || !formData.businessPhone) {
          toast.error('Please fill in all fields');
          return;
        }
    
        try {
          await createRequest(formData).unwrap();
          toast.success('Request submitted successfully! We will review it soon.');
          onSuccess();
        } catch (error: any) {
          toast.error(error?.data?.message || 'Failed to submit request');
        }
      };
    
      return (
        <>
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Hostel Owner Request
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Submit your details for review
                  </p>
                </div>
                 <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <HiOutlineX size={20} />
                </button>
              </div>
    
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g., Green Valley Hostel"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50"
                    required
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="e.g., +92 300 1234567"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50"
                    required
                  />
                </div>
    
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      );
}

// Edit Profile Modal
interface EditProfileModalProps {
  user: any;
  onClose: () => void;
  onSuccess: (user: any) => void;
  updateMe: any;
  uploadImage: any;
  submitting: boolean;
  getAvatarUrl: (avatar: any) => string | null;
}

function EditProfileModal({ user, onClose, onSuccess, updateMe, uploadImage, submitting, getAvatarUrl }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    avatar: getAvatarUrl(user.avatar) || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let avatarData = user.avatar; 
      
      if (file) {
        const uploadResult = await uploadImage(file).unwrap();
        avatarData = uploadResult.data; 
      }

      const payload: any = {};
      if (formData.name !== user.name) payload.name = formData.name;
      if (formData.phone !== user.phone) payload.phone = formData.phone;
      
      if (file) {
          payload.avatar = avatarData;
      }

      if (Object.keys(payload).length === 0) {
         toast('No changes to save');
         onClose();
         return;
      }

      const result = await updateMe(payload).unwrap();
      toast.success('Profile updated successfully!');
      onSuccess(result.data);
    } catch (error: any) {
      console.error(error);
      const msg = error?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
        setUploading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-y-auto border border-gray-100 dark:border-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Edit Profile
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <HiOutlineX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-xs text-gray-400 font-normal">(Read-only)</span>
              </label>
              <div className="relative">
                 <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                 <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                 <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all"
                    required
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                 <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                 <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 03001234567"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all"
                    required
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                    {formData.avatar ? (
                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <HiOutlineUser size={30} />
                        </div>
                    )}
                </div>
                <label className="flex-1 cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden" 
                    />
                    <div className="flex flex-col items-center justify-center h-20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all">
                        <HiOutlineUpload className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 mb-1" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {file ? 'Change Image' : 'Upload New Image'}
                        </span>
                    </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
