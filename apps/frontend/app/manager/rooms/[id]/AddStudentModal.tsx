'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCreateStudentMutation } from '@/lib/services/studentApi';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  cnic: z.string().min(13, 'CNIC is required'), 
  fatherCnic: z.string().min(13, "Father's CNIC is required"),
  phone: z.string().min(10, 'Phone is required'),
  fatherPhone: z.string().min(10, "Father's phone is required"),
  email: z.string().email('Invalid email'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'), 
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
        cnic: data.cnic.replace(/[^0-9]/g, ''),
        fatherCnic: data.fatherCnic.replace(/[^0-9]/g, ''),
        phone: data.phone.replace(/[^0-9]/g, ''),
        fatherPhone: data.fatherPhone.replace(/[^0-9]/g, ''),
        roomId,
        bedNumber,
        dateOfBirth: new Date(data.dateOfBirth),
        agreementDate: new Date(data.agreementDate),
        joinDate: new Date(data.agreementDate), 
      };

      const response = await createStudent(payload as any).unwrap();
      
      const result = response.data || response;
      
      setCredentials({
        username: result.user.username,
        password: result.password 
      });
      
      toast.success('Student created successfully');
      onSuccess();
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
      <div className="fixed inset-0 z-[100] bg-surface-container-highest/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-surface rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-outline-variant custom-scrollbar">
          {credentials ? (
             <div className="p-10 text-center space-y-6">
                <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mx-auto text-primary">
                    <span className="material-symbols-outlined text-[48px]">check_circle</span>
                </div>
                <h2 className="text-display-lg text-primary">Success!</h2>
                <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">Student account has been created. Please safely store these credentials.</p>
                
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-dashed border-outline inline-block w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="text-label-md uppercase tracking-wider text-on-surface-variant">Username</div>
                        <div className="font-mono font-bold text-lg text-primary select-all bg-surface-container p-2 rounded-lg text-center border border-outline-variant">{credentials.username}</div>
                        
                        <div className="text-label-md uppercase tracking-wider text-on-surface-variant">Password</div>
                        <div className="font-mono font-bold text-lg text-primary select-all bg-surface-container p-2 rounded-lg text-center border border-outline-variant">{credentials.password}</div>
                    </div>
                </div>
                
                <button 
                    onClick={handleClose}
                    className="w-full max-w-md py-4 bg-primary text-on-primary font-bold rounded-xl mt-6 hover:bg-on-primary-fixed-variant transition-colors shadow-sm text-lg"
                >
                    Done
                </button>
             </div>
          ) : (
          <>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur-md z-10">
                <div>
                    <h2 className="text-display-lg-mobile md:text-display-lg text-primary">Add Student</h2>
                    <p className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">bed</span>
                        Assigning to Bed {bedNumber}
                    </p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-surface-container text-on-surface-variant rounded-full transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-10">
                {/* Personal Info */}
                <section>
                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                        <span className="material-symbols-outlined text-secondary">person</span> 
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Full Name" icon="badge" {...register('fullName')} error={errors.fullName?.message} />
                        <Input label="Date of Birth" icon="calendar_month" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">wc</span>
                                Gender
                            </label>
                            <select {...register('gender')} className="w-full px-4 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <Input label="Email" icon="mail" type="email" {...register('email')} error={errors.email?.message} />
                        <Input label="Phone" icon="phone_iphone" {...register('phone')} error={errors.phone?.message} />
                        <Input label="CNIC" icon="id_card" placeholder="xxxxx-xxxxxxx-x" {...register('cnic')} error={errors.cnic?.message} />
                        <div className="md:col-span-2 lg:col-span-3">
                             <Input label="Permanent Address" icon="home_pin" {...register('permanentAddress')} error={errors.permanentAddress?.message} />
                        </div>
                    </div>
                </section>

                {/* Parent/Guardian */}
                <section>
                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                        <span className="material-symbols-outlined text-secondary">family_restroom</span>
                        Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Father's Name" icon="person" {...register('fatherName')} error={errors.fatherName?.message} />
                        <Input label="Father's Phone" icon="phone" {...register('fatherPhone')} error={errors.fatherPhone?.message} />
                        <Input label="Father's CNIC" icon="id_card" {...register('fatherCnic')} error={errors.fatherCnic?.message} />
                    </div>
                </section>
                
                <section>
                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                        <span className="material-symbols-outlined text-secondary">emergency</span>
                        Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Name" icon="person_alert" {...register('emergencyContact.name')} error={errors.emergencyContact?.name?.message} />
                        <Input label="Relation" icon="hub" {...register('emergencyContact.relation')} error={errors.emergencyContact?.relation?.message} />
                        <Input label="Phone" icon="contact_phone" {...register('emergencyContact.phone')} error={errors.emergencyContact?.phone?.message} />
                    </div>
                </section>

                <section>
                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                        <span className="material-symbols-outlined text-secondary">payments</span>
                        Admission & Fees
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Agreement Date" icon="calendar_today" type="date" {...register('agreementDate')} error={errors.agreementDate?.message} />
                        <Input label="Monthly Fee" icon="attach_money" type="number" {...register('monthlyFee', { valueAsNumber: true })} error={errors.monthlyFee?.message} />
                        <Input label="Security Deposit" icon="account_balance" type="number" {...register('securityDeposit', { valueAsNumber: true })} error={errors.securityDeposit?.message} />
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-outline-variant">
                    <button 
                        type="button" 
                        onClick={handleClose}
                        className="px-8 py-3 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl font-bold bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">{isLoading ? 'hourglass_top' : 'person_add'}</span>
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

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string, icon?: string, error?: string }>(
  ({ label, icon, error, className, ...props }, ref) => (
    <div className="space-y-2 w-full">
        <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
            {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
            {label}
        </label>
        <input 
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-background border transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary font-bold ${error ? 'border-error ring-error/20' : 'border-outline-variant hover:border-outline'} ${className}`}
            {...props}
        />
        {error && <p className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
