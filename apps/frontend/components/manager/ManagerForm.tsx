'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createManagerSchema, CreateManagerInput } from '@hostelite/shared-validators';
import { toast } from 'react-hot-toast';
import { useCreateManagerMutation, useUpdateManagerMutation, IManager } from '@/lib/services/managerApi';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import { z } from 'zod';

type FormValues = z.infer<typeof createManagerSchema>;

interface ManagerFormProps {
  initialValues?: IManager;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ManagerForm({ initialValues, isEditMode = false, onSuccess, onCancel }: ManagerFormProps) {
  const [createManager, { isLoading: isCreating }] = useCreateManagerMutation();
  const [updateManager, { isLoading: isUpdating }] = useUpdateManagerMutation();
  const { data: hostelsResponse } = useGetOwnerHostelsQuery();
  
  const hostels = hostelsResponse?.data || [];
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createManagerSchema),
    defaultValues: {
      name: initialValues?.name || '',
      phoneNumber: initialValues?.phoneNumber || '',
      cnic: initialValues?.cnic || '',
      salary: initialValues?.salary || 0,
      hostelId: initialValues?.hostelId || (hostels.length === 1 ? hostels[0]._id : ''),
    },
  });

  const watchedName = watch('name');
  const watchedCnic = watch('cnic');

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode && initialValues?._id) {
        await updateManager({ id: initialValues._id, data }).unwrap();
        toast.success('Manager updated successfully!');
      } else {
        await createManager(data).unwrap();
        toast.success('Manager created successfully!');
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} manager`);
    }
  };

  return (
    <div className="w-full relative overflow-hidden pb-12">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="flex justify-between items-center mb-10 pb-6 border-b border-outline-variant/40">
        <div>
          <h2 className="font-headline-lg text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-primary/80">{isEditMode ? 'edit_square' : 'person_add'}</span>
            {isEditMode ? 'Edit Manager' : 'Add New Manager'}
          </h2>
          <p className="text-on-surface-variant font-body-md mt-2 ml-12">
            {isEditMode ? 'Update this manager\'s profile and access.' : 'Fill out the details below to assign a new manager to your property.'}
          </p>
        </div>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all self-start"
            title="Cancel"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Basic Details Section */}
        <div className="space-y-6">
          <h3 className="font-label-lg text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-outline-variant/60"></span>
            Personal Details
            <span className="flex-1 h-px bg-outline-variant/60"></span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">person</span>
                <input
                  {...register('name')}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="e.g. John Doe"
                />
              </div>
              {errors.name && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.name.message}</p>}
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">call</span>
                <input
                  {...register('phoneNumber')}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="+92 300 1234567"
                />
              </div>
              {errors.phoneNumber && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.phoneNumber.message}</p>}
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                CNIC / ID Card No
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">badge</span>
                <input
                  {...register('cnic')}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="35202-1234567-1"
                />
              </div>
              {errors.cnic && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.cnic.message}</p>}
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Monthly Salary (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">payments</span>
                <input
                  type="number"
                  {...register('salary', { valueAsNumber: true })}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="30000"
                />
              </div>
              {errors.salary && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.salary.message}</p>}
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="space-y-6">
           <h3 className="font-label-lg text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-outline-variant/60"></span>
            Property Assignment
            <span className="flex-1 h-px bg-outline-variant/60"></span>
           </h3>
           
           <div className="relative group md:w-1/2">
             <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
               Assign to Hostel
             </label>
             <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">domain</span>
               <select
                 {...register('hostelId')}
                 className="w-full p-4 pl-12 pr-10 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant appearance-none"
                 disabled={isEditMode}
               >
                 <option value="">Select a Hostel</option>
                 {hostels.map((hostel) => (
                   <option key={hostel._id} value={hostel._id}>
                     {hostel.name} ({hostel.address.city || 'Unknown'})
                   </option>
                 ))}
               </select>
               <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-on-surface-variant">expand_more</span>
             </div>
             {errors.hostelId && <p className="text-error text-xs font-label-md mt-2 pl-4">Hostel selection is required</p>}
           </div>
        </div>

        {/* Credentials Section */}
        <div className="mt-8 bg-surface-container-low border border-outline-variant/50 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
          
          <h3 className="font-headline-sm text-primary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]">key</span>
            Login Credentials
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                {isEditMode ? 'Login ID (Username)' : 'Auto-Generated Username'}
              </label>
              <div className="w-full p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 text-primary font-mono text-lg flex items-center gap-3 shadow-inner">
                  <span className="material-symbols-outlined text-outline-variant">account_circle</span>
                  {isEditMode ? (
                    initialValues?.userId?.username || 'N/A'
                  ) : (
                    (() => {
                      const name = watchedName || '';
                      const cnic = watchedCnic || '';
                      const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                      const cnicSuffix = cnic.length >= 3 ? cnic.slice(-3) : '...';
                      return name && cnic.length >= 3 ? `${firstName}-${cnicSuffix}` : 'Pending Input...';
                    })()
                  )}
              </div>
              <p className="text-xs text-on-surface-variant/80 mt-2 flex items-center gap-1.5 font-label-md">
                <span className="material-symbols-outlined text-[14px]">info</span>
                This will be the manager's Login ID.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Password
              </label>
              {isEditMode ? (
                 <div className="w-full p-4 rounded-2xl bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant font-mono text-lg flex items-center gap-3">
                   <span className="material-symbols-outlined text-outline-variant">password</span>
                   ••••••••
                 </div>
              ) : (
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">password</span>
                  <input
                    type="text" 
                    {...register('password')}
                    className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-0 transition-all text-primary font-mono text-lg hover:border-outline-variant shadow-inner"
                    placeholder="Set strong password"
                  />
                </div>
              )}
              {!isEditMode && errors.password && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.password.message}</p>}
              <p className={`text-xs mt-2 font-label-md flex items-center gap-1.5 ${isEditMode ? 'text-on-surface-variant/80' : 'text-tertiary'}`}>
                <span className="material-symbols-outlined text-[14px]">{isEditMode ? 'lock' : 'visibility'}</span>
                {isEditMode ? 'Hidden for security' : 'Visible as requested'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-primary hover:bg-primary/90 text-on-primary font-label-lg tracking-widest uppercase rounded-2xl transition-all shadow-[0_8px_20px_-4px_rgba(var(--color-primary-rgb),0.4)] hover:shadow-[0_12px_24px_-6px_rgba(var(--color-primary-rgb),0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:active:translate-y-0 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="material-symbols-outlined text-[24px] relative z-10">{isEditMode ? 'save' : 'person_add'}</span>
            <span className="relative z-10">{isLoading ? (isEditMode ? 'Updating Manager...' : 'Creating Manager...') : (isEditMode ? 'Save Manager Details' : 'Add New Manager')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
