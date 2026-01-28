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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Manager' : 'Add New Manager'}
        </h2>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
            <input
              {...register('name')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              {...register('phoneNumber')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="+92 300 1234567"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">CNIC / ID Card No</label>
            <input
              {...register('cnic')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="35202-1234567-1"
            />
            {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Monthly Salary</label>
            <input
              type="number"
              {...register('salary', { valueAsNumber: true })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assign to Hostel</label>
            <select
              {...register('hostelId')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              disabled={isEditMode}
            >
              <option value="">Select a Hostel</option>
              {hostels.map((hostel) => (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.name} ({hostel.address.city})
                </option>
              ))}
            </select>
            {errors.hostelId && <p className="text-red-500 text-sm mt-1">Hostel selection is required</p>}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Login Credentials</h3>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase">
                {isEditMode ? 'Login ID (Username)' : 'Auto-Generated Username'}
              </label>
              <div className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300 font-mono font-bold">
                  {isEditMode ? (
                    initialValues?.userId?.username || 'N/A'
                  ) : (
                    (() => {
                      const name = watchedName || '';
                      const cnic = watchedCnic || '';
                      const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                      const cnicSuffix = cnic.length >= 3 ? cnic.slice(-3) : '...';
                      return name && cnic.length >= 3 ? `${firstName}-${cnicSuffix}` : 'Enter Name & CNIC';
                    })()
                  )}
              </div>
              <p className="text-xs text-gray-400 mt-1">This will be the manager's Login ID.</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase">
                Password
              </label>
              {isEditMode ? (
                 <div className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-500 dark:text-gray-400 font-mono">
                   ******** (Hidden)
                 </div>
              ) : (
                <input
                  type="text" 
                  {...register('password')}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 font-mono"
                  placeholder="Set password"
                />
              )}
              {!isEditMode && errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              <p className="text-xs text-brand-primary mt-1 font-medium">{isEditMode ? 'Cannot view password' : 'Visible as requested'}</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50"
        >
          {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Manager' : 'Add Manager')}
        </button>
      </form>
    </div>
  );
}
