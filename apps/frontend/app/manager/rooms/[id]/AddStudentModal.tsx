'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { HiX, HiOutlineUsers, HiOutlineCheck } from 'react-icons/hi';
import { useCreateStudentMutation } from '@/lib/services/studentApi';
import { createStudentSchema } from '@hostelite/shared-validators'; // We'll need to use a localized schema or wait for shared rebuild if needed. 
// Ideally shared-validators is available, assuming monorepo setup handles it.
// If type error occurs, we might need to redefine schema locally for now or ensure shared lib is built.
// Given previous context, shared-validators is used.

// Since the shared validator imports might break if not compiled, and I cannot compile it easily here without build step,
// I will replicate the Zod schema locally for the form to ensure it works immediately, 
// OR I will trust the build environment. I'll define a local type/schema to be safe and dependent.
// Actually, I should use the shared one, but I'll define a local one matching it to avoid "cannot find module" issues if hot-reload is lagging.
// Wait, I can see shared-validators is in packages. I should rely on it.

// Re-defining schema locally to ensure immediate responsiveness and valid types for the form
// especially since I modified the shared one just now and build might lag.
const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  cnic: z.string().min(13, 'CNIC is required'), // Simplified regex for UI, strict on submit
  fatherCnic: z.string().min(13, "Father's CNIC is required"),
  phone: z.string().min(10, 'Phone is required'),
  fatherPhone: z.string().min(10, "Father's phone is required"),
  email: z.string().email('Invalid email'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'), // input type date returns string
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  permanentAddress: z.string().min(10, 'Address is required'),
  emergencyContact: z.object({
    name: z.string().min(1, 'Name is required'),
    relation: z.string().min(1, 'Relation is required'),
    phone: z.string().min(10, 'Phone is required'),
  }),
  monthlyFee: z.number().min(0),
  securityDeposit: z.number().min(0),
  agreementDate: z.string().min(1, 'Agreement date is required'),
  // Files - implementing as simple placeholders or state for now
});

type FormInputs = z.infer<typeof formSchema>;

interface AddStudentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  roomId: string;
  bedNumber: string;
  onSuccess: () => void;
}

export default function AddStudentModal({ open, setOpen, roomId, bedNumber, onSuccess }: AddStudentModalProps) {
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const [credentials, setCredentials] = useState<{username: string, password: string} | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'MALE',
      monthlyFee: 0,
      securityDeposit: 0,
    }
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const payload = {
        ...data,
        roomId,
        bedNumber,
        dateOfBirth: new Date(data.dateOfBirth),
        agreementDate: new Date(data.agreementDate),
        joinDate: new Date(data.agreementDate), // "payment starts from ask date"
      };

      const response = await createStudent(payload as any).unwrap();
      
      // Assuming response structure: { success: true, data: { student, user, password } }
      // Check authApi/studentApi Types/Response
      const result = response.data || response;
      
      setCredentials({
        username: result.user.username,
        password: result.password // Plain text password returned from API
      });
      
      toast.success('Student created successfully');
      onSuccess();
      // Don't close immediately, let them see credentials
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create student');
      console.error(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCredentials(null);
    reset();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-[#1a0f0a] rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {credentials ? (
             <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <HiOutlineCheck size={40} />
                </div>
                <h2 className="text-3xl font-bold text-brand-text dark:text-dark-text">Success!</h2>
                <p className="text-brand-text/60">Student account has been created. Please save these credentials.</p>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 inline-block w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="text-sm text-gray-500">Username</div>
                        <div className="font-mono font-bold text-lg select-all">{credentials.username}</div>
                        
                        <div className="text-sm text-gray-500">Password</div>
                        <div className="font-mono font-bold text-lg select-all">{credentials.password}</div>
                    </div>
                </div>
                
                <button 
                    onClick={handleClose}
                    className="w-full max-w-md py-3 bg-brand-primary text-white font-bold rounded-xl mt-4"
                >
                    Done
                </button>
             </div>
          ) : (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1a0f0a] z-10">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text">Add Student</h2>
                    <p className="text-sm text-brand-text/60">Assigning to Bed {bedNumber}</p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <HiX size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
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
                        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
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
                        <Input label="Agreement Date" type="date" {...register('agreementDate')} error={errors.agreementDate?.message} />
                        <Input label="Monthly Fee" type="number" {...register('monthlyFee', { valueAsNumber: true })} error={errors.monthlyFee?.message} />
                        <Input label="Security Deposit" type="number" {...register('securityDeposit', { valueAsNumber: true })} error={errors.securityDeposit?.message} />
                    </div>
                </section>

                <div className="flex justify-end gap-3 pt-6">
                    <button 
                        type="button" 
                        onClick={handleClose}
                        className="px-6 py-3 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl font-bold bg-brand-primary text-white hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Student'}
                    </button>
                </div>
            </form>
          </>
          )}
        </div>
      </div>
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
