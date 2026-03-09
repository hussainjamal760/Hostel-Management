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
import Header from '../components/Header';
import { motion } from 'framer-motion' 
import Footer from '../components/Footer';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Modal } from 'flowbite-react';

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 italic">
            <HiOutlineClock size={12} />
            Review In Progress
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20 italic">
            <HiOutlineCheck size={12} />
            Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 italic">
            <HiOutlineX size={12} />
            Disapproved
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
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-white/5 p-1 ring-1 ring-white/10 overflow-hidden relative group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                    {getAvatarUrl(user?.avatar) ? (
                      <img src={getAvatarUrl(user?.avatar)} alt={user?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-4xl font-black italic">
                        {getInitials(user?.name || 'User')}
                      </div>
                    )}
                </div>
                <button 
                  onClick={() => setShowEditProfileModal(true)}
                  className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-brand-primary text-black hover:scale-110 shadow-xl transition-all active:scale-95"
                  title="Update Avatar"
                >
                  <HiOutlineCamera size={18} />
                </button>
              </div>
              
              <h2 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">{user?.name}</h2>
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/10 text-white/40 border border-white/5 uppercase tracking-[0.2em] italic">
                  {user?.role}
                </span>
                {user?.isEmailVerified && (
                  <div className="text-brand-primary group-hover:scale-125 transition-transform" title="Verified Identity">
                    <HiOutlineShieldCheck size={20} />
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 group/btn"
                >
                  <HiOutlinePencil size={18} className="text-brand-primary transition-transform group-hover/btn:-translate-y-1" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 px-6 rounded-2xl bg-transparent border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center gap-3 group/btn"
                >
                  <HiOutlineLogout size={16} />
                  Terminate Session
                </button>
              </div>
            </motion.div>

            {(user?.role as string) === 'CLIENT' && (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-linear-to-br from-brand-primary to-orange-900 rounded-[40px] p-10 shadow-2xl text-black relative overflow-hidden group cursor-pointer"
               >
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                 <h3 className="text-2xl font-black mb-4 tracking-tight leading-none uppercase">List your <br/>property.</h3>
                 <p className="text-black/60 text-sm mb-8 font-medium leading-relaxed italic">Join our elite circle of hostel owners and dominate the market.</p>
                 <button 
                    onClick={() => setShowRequestModal(true)}
                    className="w-full py-4 px-6 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl"
                 >
                   Become an Owner
                 </button>
               </motion.div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/5 overflow-hidden"
            >
               <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                   <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <HiOutlineIdentification size={20}/>
                   </div>
                   Personal Data
                 </h3>
               </div>
               <div className="p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Full Name</label>
                     <p className="text-white text-lg font-bold flex items-center gap-3">
                       <HiOutlineUser className="text-brand-primary" />
                       {user?.name}
                     </p>
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Electronic Mail</label>
                     <p className="text-white text-lg font-bold flex items-center gap-3">
                       <HiOutlineMail className="text-brand-primary" />
                       {user?.email}
                     </p>
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Telecommunication</label>
                     <p className="text-white text-lg font-bold flex items-center gap-3">
                       <HiOutlinePhone className="text-brand-primary" />
                       {user?.phone || 'Not provided'}
                     </p>
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Tenure Start</label>
                     <p className="text-white text-lg font-bold flex items-center gap-3">
                       <HiOutlineClock className="text-brand-primary" />
                       {new Date().getFullYear()} 
                     </p>
                   </div>
                 </div>
               </div>
            </motion.div>

            {user?.role === 'ADMIN' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/10 transition-all duration-500"
              >
                 <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                     <HiOutlineOfficeBuilding size={30} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight">Admin Terminal</h3>
                     <p className="text-white/30 text-xs font-light italic mt-1">Global ecosystem oversight and control.</p>
                   </div>
                 </div>
                 <Link
                   href="/admin/dashboard"
                   className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl"
                 >
                   Access Terminal
                 </Link>
              </motion.div>
            )}

            {user?.role === 'OWNER' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/10 transition-all duration-500"
              >
                 <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                     <HiOutlineOfficeBuilding size={30} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight">Control Center</h3>
                     <p className="text-white/30 text-xs font-light italic mt-1">Manage architectural logistics and residents.</p>
                   </div>
                 </div>
                 <Link
                   href="/owner/dashboard"
                   className="px-8 py-4 bg-brand-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl"
                 >
                   Open Dashboard
                 </Link>
              </motion.div>
            )}

            {user?.role === 'STUDENT' && latestRequest && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/5 p-10 overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 blur-[80px] pointer-events-none" />
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Application Status</h3>
                   {getStatusBadge(latestRequest.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Operational Title</label>
                     <p className="text-white text-xl font-bold italic tracking-tight">{latestRequest.businessName}</p>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Submission Timeline</label>
                     <p className="text-white/60 text-xl font-medium">
                       {new Date(latestRequest.createdAt).toLocaleDateString()}
                     </p>
                   </div>
                </div>
                
                {latestRequest.status === 'REJECTED' && latestRequest.adminNotes && (
                   <div className="mt-4 p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4 italic opacity-60">System Feedback</p>
                    <p className="text-lg font-medium leading-relaxed italic mb-8">"{latestRequest.adminNotes}"</p>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="px-6 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl"
                    >
                      Resubmit Engineering Request
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            
          </div>
        </div>
      </main>

      <Footer />


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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={onClose} 
          />
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#0F0F0F] rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl" />
                <div className="relative">
                  <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">
                    Hostel Registration
                  </h2>
                  <p className="mt-2 text-xs font-black text-white/20 uppercase tracking-widest">
                    Submit your architectural credentials
                  </p>
                </div>
                 <button onClick={onClose} className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90">
                  <HiOutlineX size={24} />
                </button>
              </div>
    
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                    Operational Title
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g., Zenith Heights"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                    required
                  />
                </div>
    
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                    Verified Contact
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="e.g., +92 3XX XXXXXXX"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                    required
                  />
                </div>
    
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 rounded-2xl bg-brand-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,107,0,0.3)] disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Submit Credentials'}
                  </button>
                </div>
              </form>
            </motion.div>
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
      toast.success('Identity updated successfully!');
      onSuccess(result.data);
    } catch (error: any) {
      console.error(error);
      const msg = error?.data?.message || 'Update failed';
      toast.error(msg);
    } finally {
        setUploading(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      <div className="fixed inset-0 z-101 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl bg-[#0F0F0F] rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-10 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/5 blur-3xl" />
             <div className="relative">
                <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">
                  Modify Identity
                </h2>
                <p className="mt-2 text-xs font-black text-white/20 uppercase tracking-widest">
                  Personal logistics configuration
                </p>
             </div>
            <button onClick={onClose} className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90 relative z-10">
              <HiOutlineX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                  Permanent Identity <span className="opacity-40 font-bold ml-2">(ReadOnly)</span>
                </label>
                <div className="relative">
                   <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                   <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/2 border-white/5 text-white/40 cursor-not-allowed text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                  Full Nomenclature
                </label>
                <div className="relative">
                   <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                   <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm font-medium"
                      required
                   />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                Telecommunication Node
              </label>
              <div className="relative">
                 <HiOutlinePhone className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                 <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 03001234567"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm font-medium"
                    required
                 />
              </div>
            </div>

            <div className="space-y-6">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                Visual Bio-ID
              </label>
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0 relative group/avatar">
                    {formData.avatar ? (
                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-2xl italic">
                            {getInitials(formData.name)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                       <HiOutlineCamera size={24} />
                    </div>
                </div>
                <label className="flex-1 cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden" 
                    />
                    <div className="flex flex-col items-center justify-center p-6 py-8 rounded-[30px] border-2 border-dashed border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group/upload">
                        <HiOutlineUpload className="w-8 h-8 text-white/20 group-hover/upload:text-brand-primary mb-2 transition-transform group-hover/upload:-translate-y-1" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover/upload:text-white transition-colors">
                            {file ? 'Replace Component' : 'Upload Visual ID'}
                        </span>
                    </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Cancel Task
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 py-4 rounded-2xl bg-brand-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,107,0,0.3)] disabled:opacity-50"
              >
                {uploading ? 'Synching...' : submitting ? 'Configuring...' : 'Apply Modifications'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
