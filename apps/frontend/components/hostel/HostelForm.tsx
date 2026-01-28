'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createHostelSchema, CreateHostelInput } from '@hostelite/shared-validators';
import { toast } from 'react-hot-toast';
import { useCreateHostelMutation, useUpdateHostelMutation } from '@/lib/services/hostelApi';
import MapPicker from '../ui/MapPicker';
import { z } from 'zod';
import { IHostel } from '@hostelite/shared-types';

type FormValues = z.infer<typeof createHostelSchema>;

const CITIES = ['Lahore', 'Islamabad', 'Karachi', 'Faisalabad'];

interface HostelFormProps {
  initialValues?: IHostel;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function HostelForm({ initialValues, isEditMode = false, onSuccess, onCancel }: HostelFormProps) {
  const [createHostel, { isLoading: isCreating }] = useCreateHostelMutation();
  const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();
  
  const isLoading = isCreating || isUpdating;

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialValues?.address?.coordinates || null
  );
  const [isOtherCity, setIsOtherCity] = useState(false);

  const getDefaultCity = () => {
    if (!initialValues?.address?.city) return '';
    return CITIES.includes(initialValues.address.city) ? initialValues.address.city : 'Other';
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createHostelSchema),
    defaultValues: {
      name: initialValues?.name || '',
      phoneNumber: initialValues?.phoneNumber || '',
      monthlyRent: initialValues?.monthlyRent || 0,
      address: {
        street: initialValues?.address?.street || '',
        city: initialValues?.address?.city || '',
        coordinates: initialValues?.address?.coordinates,
      },
    },
  });

  useEffect(() => {
    if (initialValues?.address?.city && !CITIES.includes(initialValues.address.city)) {
      setIsOtherCity(true);
      setValue('address.city', initialValues.address.city);
    }
  }, [initialValues, setValue]);

  const selectedCity = watch('address.city');

  const onSubmit = async (data: FormValues) => {
    if (!location) {
      toast.error('Please select a location on the map');
      return;
    }

    try {
      const payload = {
        ...data,
        address: {
          ...data.address,
          coordinates: location,
        },
      };

      if (isEditMode && initialValues?._id) {
        await updateHostel({ id: initialValues._id, data: payload }).unwrap();
        toast.success('Hostel updated successfully!');
      } else {
        await createHostel(payload).unwrap();
        toast.success('Hostel created successfully!');
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} hostel`);
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setValue('address.coordinates', { lat, lng });

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        if (data && data.address) {
            setValue('address.street', data.display_name); 
            toast.success('Address auto-filled!');
        }
    } catch (error) {
        console.error("Failed to reverse geocode", error);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsOtherCity(true);
      setValue('address.city', ''); 
    } else {
      setIsOtherCity(false);
      setValue('address.city', value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Hostel' : 'Create New Hostel'}
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

      <form onSubmit={handleSubmit(onSubmit, (errors) => console.error("Form Errors:", errors))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Hostel Name</label>
            <input
              {...register('name')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g. Sunshine Boys Hostel"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Business Phone Number</label>
            <input
              {...register('phoneNumber')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="+92 300 1234567"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Location</label>
           <p className="text-sm text-gray-500 mb-2">Click or drag the map to pinpoint the hostel location. Street address will be auto-filled.</p>
           <MapPicker 
             coordinates={location || { lat: 33.6844, lng: 73.0479 }} 
             onLocationChange={(coords) => handleLocationSelect(coords.lat, coords.lng)} 
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Street Address / Full Address</label>
            <input
              {...register('address.street')}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            {errors.address?.street && <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>}
          </div>
          <div>
             <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">City</label>
             {!isOtherCity ? (
               <select
                 className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                 onChange={handleCityChange}
                 defaultValue={getDefaultCity()}
               >
                 <option value="" disabled>Select City</option>
                 {CITIES.map(city => (
                   <option key={city} value={city}>{city}</option>
                 ))}
                 <option value="Other">Other</option>
               </select>
             ) : (
               <div className="flex gap-2">
                  <input
                    {...register('address.city')}
                    placeholder="Enter city name"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    autoFocus
                  />
                  <button 
                    type="button" 
                    onClick={() => { setIsOtherCity(false); setValue('address.city', ''); }}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Cancel custom city"
                  >
                    ✕
                  </button>
               </div>
             )}
            {errors.address?.city && <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
           <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Monthly Rent</label>
            <input
              type="number"
              {...register('monthlyRent', { valueAsNumber: true })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            {errors.monthlyRent && <p className="text-red-500 text-sm mt-1">{errors.monthlyRent.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50"
        >
          {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Hostel' : 'Create Hostel')}
        </button>
      </form>
    </div>
  );
}
