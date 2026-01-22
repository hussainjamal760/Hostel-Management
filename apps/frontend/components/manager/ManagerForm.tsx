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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
            <input
              {...register('name')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              {...register('phoneNumber')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="+92 300 1234567"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          {/* CNIC */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">CNIC / ID Card No</label>
            <input
              {...register('cnic')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="35202-1234567-1"
            />
            {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic.message}</p>}
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Monthly Salary</label>
            <input
              type="number"
              {...register('salary', { valueAsNumber: true })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
          </div>

          {/* Hostel Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assign to Hostel</label>
            <select
              {...register('hostelId')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              disabled={isEditMode} // Usually moving managers between hostels isn't frequent, but can be enabled
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
        </div>

        {/* Submit Button */}
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
