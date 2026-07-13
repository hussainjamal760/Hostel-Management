'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createHostelSchema, CreateHostelInput } from '@hostelite/shared-validators';
import { toast } from 'react-hot-toast';
import { useCreateHostelMutation, useUpdateHostelMutation } from '@/lib/services/hostelApi';
import { useGetPaymentCardsQuery, useCreatePaymentCardMutation } from '@/lib/services/paymentCardApi';
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
  const { data: cardsData } = useGetPaymentCardsQuery();
  const [createPaymentCard] = useCreatePaymentCardMutation();
  
  const isLoading = isCreating || isUpdating;

  const paymentCards = cardsData?.data || [];

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
      paymentDetails: {
        bankName: initialValues?.paymentDetails?.bankName || '',
        accountTitle: initialValues?.paymentDetails?.accountTitle || '',
        accountNumber: initialValues?.paymentDetails?.accountNumber || '',
        instructions: initialValues?.paymentDetails?.instructions || '',
      },
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

      // Auto-save new payment method to library if it doesn't exist
      if (data.paymentDetails?.accountNumber) {
          const existsInLibrary = paymentCards.some(
              (card: any) => card.accountNumber === data.paymentDetails!.accountNumber
          );
          if (!existsInLibrary) {
              await createPaymentCard(data.paymentDetails).unwrap().catch(() => {});
          }
      }

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
    <div className="w-full relative overflow-hidden pb-12">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="flex justify-between items-center mb-10 pb-6 border-b border-outline-variant/40">
        <div>
          <h2 className="font-headline-lg text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-primary/80">{isEditMode ? 'edit_square' : 'domain_add'}</span>
            {isEditMode ? 'Edit Property' : 'Create New Property'}
          </h2>
          <p className="text-on-surface-variant font-body-md mt-2 ml-12">
            {isEditMode ? 'Update your hostel details and location.' : 'Add a new hostel to your portfolio by filling out the details below.'}
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

      <form onSubmit={handleSubmit(onSubmit, (errors) => console.error("Form Errors:", errors))} className="space-y-10">
        
        {/* Basic Details Section */}
        <div className="space-y-6">
          <h3 className="font-label-lg text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-outline-variant/60"></span>
            Basic Information
            <span className="flex-1 h-px bg-outline-variant/60"></span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Hostel Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">apartment</span>
                <input
                  {...register('name')}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="e.g. The Heritage Grand"
                />
              </div>
              {errors.name && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.name.message}</p>}
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Business Phone
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
            
            <div className="relative group md:col-span-2">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Monthly Rent Base (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">payments</span>
                <input
                  type="number"
                  {...register('monthlyRent', { valueAsNumber: true })}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="25000"
                />
              </div>
              {errors.monthlyRent && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.monthlyRent.message}</p>}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-6">
           <h3 className="font-label-lg text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-outline-variant/60"></span>
            Location Details
            <span className="flex-1 h-px bg-outline-variant/60"></span>
           </h3>
           
           <div className="mb-8">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <span className="material-symbols-outlined">pin_drop</span>
               </div>
               <div>
                 <p className="font-label-md text-primary uppercase tracking-wider">Map Coordinates</p>
                 <p className="text-sm font-body-md text-on-surface-variant opacity-80">Drag the pin to exactly locate your property.</p>
               </div>
             </div>
             <div className="rounded-2xl overflow-hidden border-2 border-outline-variant/50 shadow-sm relative">
               <MapPicker 
                 coordinates={location || { lat: 33.6844, lng: 73.0479 }} 
                 onLocationChange={(coords) => handleLocationSelect(coords.lat, coords.lng)} 
               />
               <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-center">
                 <div className="bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-2 rounded-full border border-outline-variant/30 text-xs font-label-md text-primary shadow-sm">
                   Coordinates auto-sync with address
                 </div>
               </div>
             </div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group md:col-span-2">
              <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                Street Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">signpost</span>
                <input
                  {...register('address.street')}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                  placeholder="Street No, Area, Sector"
                />
              </div>
              {errors.address?.street && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.address.street.message}</p>}
            </div>

            <div className="relative group md:col-span-2">
               <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                City
               </label>
               {!isOtherCity ? (
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">location_city</span>
                   <select
                     className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant appearance-none"
                     onChange={handleCityChange}
                     defaultValue={getDefaultCity()}
                   >
                     <option value="" disabled>Select City</option>
                     {CITIES.map(city => (
                       <option key={city} value={city}>{city}</option>
                     ))}
                     <option value="Other">Other</option>
                   </select>
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-on-surface-variant">expand_more</span>
                 </div>
               ) : (
                 <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">location_city</span>
                      <input
                        {...register('address.city')}
                        placeholder="Enter custom city name"
                        className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                        autoFocus
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setIsOtherCity(false); setValue('address.city', ''); }}
                      className="px-4 text-error bg-error-container/20 hover:bg-error-container/40 border border-error/20 rounded-2xl transition-colors flex items-center justify-center"
                      title="Cancel custom city"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                 </div>
               )}
              {errors.address?.city && <p className="text-error text-xs font-label-md mt-2 pl-4">{errors.address.city.message}</p>}
            </div>
          </div>
        </div>

        {/* Payment Configuration Section */}
        <div className="space-y-6">
           <h3 className="font-label-lg text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-outline-variant/60"></span>
            Payment Configuration
            <span className="flex-1 h-px bg-outline-variant/60"></span>
           </h3>

           {paymentCards.length > 0 && (
             <div className="mb-6">
               <p className="text-sm font-label-md text-on-surface-variant uppercase tracking-widest mb-3">Or Select from Saved Cards:</p>
               <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                 {paymentCards.map((payment: any) => (
                   <button
                     key={payment._id}
                     type="button"
                     onClick={() => {
                       setValue('paymentDetails.bankName', payment.bankName);
                       setValue('paymentDetails.accountTitle', payment.accountTitle);
                       setValue('paymentDetails.accountNumber', payment.accountNumber);
                       setValue('paymentDetails.instructions', payment.instructions);
                       toast.success('Payment details auto-filled!');
                     }}
                     className="min-w-[280px] aspect-[1.6/1] snap-start flex-shrink-0 relative rounded-[20px] overflow-hidden group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                   >
                     {/* Card Background */}
                     <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-surface-container-highest to-black z-0"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                     
                     <div className="relative z-10 h-full p-5 flex flex-col justify-between border border-white/10 rounded-[20px]">
                       {/* Top */}
                       <div className="flex justify-between items-start text-white/40">
                           <span className="material-symbols-outlined text-sm rotate-90">sim_card</span>
                           <span className="material-symbols-outlined text-sm">wifi</span>
                       </div>
                       
                       {/* Middle */}
                       <div className="w-full mt-auto mb-3">
                           <p className="font-mono text-base text-white tracking-[0.15em] mb-1 truncate drop-shadow-md">{payment.accountNumber}</p>
                           <p className="font-mono text-[10px] text-white/60 tracking-widest uppercase truncate">{payment.accountTitle}</p>
                       </div>

                       {/* Bottom */}
                       <div className="w-full flex justify-between items-end border-t border-white/10 pt-3">
                           <p className="font-bold text-sm text-white/90 truncate pr-2">{payment.bankName}</p>
                           <div className="relative w-7 h-4 flex-shrink-0 opacity-80">
                               <div className="absolute left-0 w-4 h-4 rounded-full bg-error/90 mix-blend-screen"></div>
                               <div className="absolute right-0 w-4 h-4 rounded-full bg-tertiary/90 mix-blend-screen"></div>
                           </div>
                       </div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
           )}

           <div className="bg-surface-container-low p-6 md:p-8 rounded-[24px] border border-outline-variant/50 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                      Provider / Bank Name
                  </label>
                  <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">account_balance</span>
                      <input
                          {...register('paymentDetails.bankName')}
                          className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                          placeholder="e.g. Meezan Bank, JazzCash"
                      />
                  </div>
                </div>

                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                      Account Title
                  </label>
                  <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">badge</span>
                      <input
                          {...register('paymentDetails.accountTitle')}
                          className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                          placeholder="e.g. John Doe Hostels"
                      />
                  </div>
                </div>
             </div>

             <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                    Account Number / IBAN
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">tag</span>
                    <input
                        {...register('paymentDetails.accountNumber')}
                        className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant"
                        placeholder="e.g. 03001234567 or PKRIBAN..."
                    />
                </div>
             </div>

             <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                    Additional Instructions
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-5 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors">description</span>
                    <textarea
                        {...register('paymentDetails.instructions')}
                        rows={3}
                        className="w-full p-4 pl-12 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-lg hover:border-outline-variant resize-none"
                        placeholder="e.g. Please upload a screenshot after payment. Verification takes 24 hours."
                    />
                </div>
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
            <span className="material-symbols-outlined text-[24px] relative z-10">{isEditMode ? 'check_circle' : 'add_business'}</span>
            <span className="relative z-10">{isLoading ? (isEditMode ? 'Updating Property...' : 'Creating Property...') : (isEditMode ? 'Save Property Details' : 'Create Property Profile')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
