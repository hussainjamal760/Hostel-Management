'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { HiX, HiOutlineUsers, HiOutlinePencilAlt, HiTrash } from 'react-icons/hi';
import { useGetStudentQuery, useUpdateStudentMutation, useDeleteStudentMutation } from '@/lib/services/studentApi';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { useAppSelector } from '@/lib/hooks';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  cnic: z.string().min(1, 'CNIC is required'),
  fatherCnic: z.string().min(1, "Father's CNIC is required"),
  phone: z.string().min(10, 'Phone is required'),
  fatherPhone: z.string().min(10, "Father's phone is required"),
  email: z.string().email().optional(),
  dateOfBirth: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  permanentAddress: z.string().min(10),
  emergencyContact: z.object({
    name: z.string().min(1),
    relation: z.string().min(1),
    phone: z.string().min(10),
  }),
  monthlyFee: z.number().min(0),
  securityDeposit: z.number().min(0),
  agreementDate: z.string().min(1),
  feeStatus: z.enum(['PAID', 'PARTIAL', 'DUE', 'OVERDUE']).optional(),
  username: z.string().optional(),
});

type FormInputs = z.infer<typeof formSchema>;

interface StudentDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  studentId: string;
  onSuccess: () => void;
}

export default function StudentDetailsModal({ open, setOpen, studentId, onSuccess }: StudentDetailsModalProps) {
  const { data: studentResponse, isLoading: isLoadingData, refetch } = useGetStudentQuery(studentId, {
    skip: !open || !studentId
  });
  const student = studentResponse?.data;
  
  const { user } = useAppSelector((state) => state.auth);
  const isManager = user?.role === 'MANAGER';

  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (student && open) {
       setValue('fullName', student.fullName);
       setValue('fatherName', student.fatherName);
       setValue('cnic', student.cnic);
       setValue('fatherCnic', student.fatherCnic);
       setValue('phone', (student.userId as any)?.phone || '');
       setValue('fatherPhone', student.fatherPhone);
       setValue('email', (student.userId as any)?.email || '');
       setValue('dateOfBirth', student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ''); // Assuming ISO format from backend
       setValue('gender', student.gender as any);
       setValue('bloodGroup', student.bloodGroup);
       setValue('permanentAddress', student.permanentAddress);
       setValue('emergencyContact', student.emergencyContact);
       setValue('monthlyFee', student.monthlyFee);
       setValue('securityDeposit', student.securityDeposit);
       setValue('agreementDate', student.agreementDate ? new Date(student.agreementDate).toISOString().split('T')[0] : '');
       setValue('feeStatus', student.feeStatus);
       
       setValue('username', (student.userId as any)?.username || '');
    }
  }, [student, open, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const payload: any = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        agreementDate: new Date(data.agreementDate),
      };
      
      delete payload.username;
      
      await updateStudent({ id: studentId, data: payload }).unwrap();
      
      toast.success('Student details updated successfully');
      onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update student');
    }
  };

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleDeleteClick = () => {
      setDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
      try {
          await deleteStudent(studentId).unwrap();
          toast.success('Student deleted successfully');
          onSuccess(); 
          setOpen(false);
      } catch (err: any) {
          toast.error(err?.data?.message || 'Failed to delete student');
          setDeleteModalOpen(false);
      }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-[#1a0f0a] rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
           {isLoadingData ? (
               <div className="p-12 text-center">
                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                   <p className="mt-2 text-gray-500">Loading details...</p>
               </div>
           ) : (
                <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1a0f0a] z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text">Student Details</h2>
                        <p className="text-sm text-brand-text/60">View and edit information</p>
                    </div>
                    <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <HiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                     {/* Account Info (Read Only) */}
                     <section className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
                        <h3 className="text-sm font-bold uppercase text-brand-primary mb-3">Account Credentials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Username" {...register('username')} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                            <div className="space-y-1 w-full">
                                <label className="text-xs font-bold uppercase text-brand-text/50">Password</label>
                                <input 
                                    type="text"
                                    value="********" // Still hashed
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed font-mono"
                                />
                            </div>
                        </div>
                    </section>
                    
                    {/* Personal Info */}
                    <section>
                        <h3 className="text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
                            <HiOutlineUsers /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
                            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-brand-text/50">Gender</label>
                                <select {...register('gender')} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} className="bg-white dark:bg-dark-card" />
                            <Input label="Phone" {...register('phone')} error={errors.phone?.message} className="bg-white dark:bg-dark-card" />
                            <Input label="CNIC" placeholder="xxxxx-xxxxxxx-x" {...register('cnic')} error={errors.cnic?.message} />
                            <div className="md:col-span-2 lg:col-span-3">
                                <Input label="Permanent Address" {...register('permanentAddress')} error={errors.permanentAddress?.message} />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200 dark:border-gray-800" />
                    
                    {/* Parent/Guardian */}
                    <section>
                        <h3 className="text-lg font-bold text-brand-primary mb-4">Guardian Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Father's Name" {...register('fatherName')} error={errors.fatherName?.message} />
                            <Input label="Father's Phone" {...register('fatherPhone')} error={errors.fatherPhone?.message} />
                            <Input label="Father's CNIC" {...register('fatherCnic')} error={errors.fatherCnic?.message} />
                        </div>
                    </section>

                    <hr className="border-gray-200 dark:border-gray-800" />
                    
                    {/* Emergency Contact */}
                    <section>
                        <h3 className="text-lg font-bold text-brand-primary mb-4">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Name" {...register('emergencyContact.name')} error={errors.emergencyContact?.name?.message} />
                            <Input label="Relation" {...register('emergencyContact.relation')} error={errors.emergencyContact?.relation?.message} />
                            <Input label="Phone" {...register('emergencyContact.phone')} error={errors.emergencyContact?.phone?.message} />
                        </div>
                    </section>
                    
                    <hr className="border-gray-200 dark:border-gray-800" />

                    {/* Admission & Fees */}
                    <section>
                        <h3 className="text-lg font-bold text-brand-primary mb-4">Admission & Fees</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input 
                                label="Agreement Date" 
                                type="date" 
                                {...register('agreementDate')} 
                                error={errors.agreementDate?.message} 
                                disabled={isManager}
                                className={isManager ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : ""}
                            />
                            <Input 
                                label="Monthly Fee" 
                                type="number" 
                                {...register('monthlyFee', { valueAsNumber: true })} 
                                error={errors.monthlyFee?.message} 
                                disabled={isManager}
                                className={isManager ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : ""}
                            />
                            <Input 
                                label="Security Deposit" 
                                type="number" 
                                {...register('securityDeposit', { valueAsNumber: true })} 
                                error={errors.securityDeposit?.message} 
                                disabled={isManager}
                                className={isManager ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : ""}
                            />
                             <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-brand-text/50">Fee Status</label>
                                <select 
                                    {...register('feeStatus')} 
                                    disabled={isManager}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isManager ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-50 dark:bg-gray-800"}`}
                                >
                                    <option value="PAID">Paid</option>
                                    <option value="DUE">Due</option>
                                    <option value="PARTIAL">Partial</option>
                                    <option value="OVERDUE">Overdue</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="px-6 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <HiTrash size={20} />
                            {isDeleting ? 'Deleting...' : 'Delete Student'}
                        </button>

                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setOpen(false)}
                                className="px-6 py-3 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isUpdating}
                                className="px-8 py-3 rounded-xl font-bold bg-brand-primary text-white hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                <HiOutlinePencilAlt size={20} />
                                {isUpdating ? 'Updating...' : 'Update Details'}
                            </button>
                        </div>
                    </div>
                </form>
                </>
           )}
        </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This will remove them from the room and deactivate their account. This action cannot be undone."
        isDeleting={isDeleting}
      />
    </>
  );
}

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-1 w-full">
        <label className="text-xs font-bold uppercase text-brand-text/50 dark:text-dark-text/50">{label}</label>
        <input 
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border transition-all outline-none focus:ring-2 focus:ring-brand-primary ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} ${className}`}
            {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
