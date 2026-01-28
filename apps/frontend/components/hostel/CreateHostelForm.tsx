'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createHostelSchema } from '@hostelite/shared-validators';
import { toast } from 'react-hot-toast';
import { useCreateHostelMutation } from '@/lib/services/hostelApi';
import MapPicker from '../ui/MapPicker';
import { z } from 'zod';

type FormValues = z.infer<typeof createHostelSchema>;

const CITIES = ['Lahore', 'Islamabad', 'Karachi', 'Faisalabad'];

export default function CreateHostelForm() {
  const [createHostel, { isLoading }] = useCreateHostelMutation();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isOtherCity, setIsOtherCity] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createHostelSchema),
    defaultValues: {
      monthlyRent: 0,
    },
  });

  const selectedCity = watch('address.city');

  const onSubmit = async (data: FormValues) => {
    if (!location) {
      toast.error('Please select a location on the map');
      return;
    }

    try {
      await createHostel({
        ...data,
        address: {
          ...data.address,
          coordinates: location,
        },
      }).unwrap();
      toast.success('Hostel created successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create hostel');
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
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create Your Hostel</h2>
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
                 defaultValue=""
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
          {isLoading ? 'Creating Hostel...' : 'Create Hostel'}
        </button>
      </form>
    </div>
  );
}
