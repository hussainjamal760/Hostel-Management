'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useBulkCreateRoomsMutation } from '@/lib/services/roomApi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Config options
const BED_OPTIONS = [
  { label: '1 Bed', type: 'SINGLE', beds: 1 },
  { label: '2 Bed', type: 'DOUBLE', beds: 2 },
  { label: '3 Bed', type: 'TRIPLE', beds: 3 },
  { label: '4 Bed', type: 'DORMITORY', beds: 4 },
  { label: '5 Bed', type: 'DORMITORY', beds: 5 },
];

interface RoomDraft {
  roomNumber: string;
  floor: number;
  roomType: string;
  totalBeds: number;
  rent: number;
}

export default function CreateRoomPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  const [floors, setFloors] = useState<number[]>([0, 1, 2]); // Default floors
  const [selectedFloor, setSelectedFloor] = useState<number>(1); // Default to 1st floor
  const [roomCount, setRoomCount] = useState<number>(0);
  const [draftRooms, setDraftRooms] = useState<RoomDraft[]>([]);
  
  const [bulkCreate, { isLoading: isCreating }] = useBulkCreateRoomsMutation();

  const handleGenerate = () => {
    if (roomCount <= 0) return;
    
    let startNum = 1;
    if (selectedFloor > 0) {
        startNum = selectedFloor * 100 + 1;
    } else {
        startNum = 1; 
    }

    const newDrafts: RoomDraft[] = [];
    
    for (let i = 0; i < roomCount; i++) {
        const currentNum = startNum + i;
        const numStr = currentNum.toString().padStart(3, '0');
        
        newDrafts.push({
            roomNumber: numStr,
            floor: selectedFloor,
            roomType: 'SINGLE',
            totalBeds: 1,
            rent: 0     
        });
    }
    setDraftRooms(newDrafts);
  };

  const handleUpdateDraft = (index: number, field: keyof RoomDraft, value: any) => {
    const updated = [...draftRooms];
    updated[index] = { ...updated[index], [field]: value };
    setDraftRooms(updated);
  };

  const handleApplyOption = (index: number, optionLabel: string) => {
    const option = BED_OPTIONS.find(o => o.label === optionLabel);
    if (option) {
        const updated = [...draftRooms];
        updated[index] = { 
            ...updated[index], 
            roomType: option.type, 
            totalBeds: option.beds 
        };
        setDraftRooms(updated);
    }
  };

  const handleSave = async () => {
      if (!user?.hostelId) {
          toast.error('Hostel ID missing');
          return;
      }
      try {
          await bulkCreate({ hostelId: user.hostelId, rooms: draftRooms }).unwrap();
          toast.success('Rooms created successfully');
          setDraftRooms([]);
          router.push('/manager/rooms');
      } catch (error: any) {
          toast.error(error?.data?.message || 'Failed to create rooms');
      }
  };

  const handleRemoveDraft = (index: number) => {
      setDraftRooms(draftRooms.filter((_, i) => i !== index));
  };
  
  const addFloor = () => {
      const nextFloor = floors.length > 0 ? Math.max(...floors) + 1 : 0;
      setFloors([...floors, nextFloor]);
      setSelectedFloor(nextFloor);
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-display-lg-mobile md:text-display-lg text-primary">Create Rooms</h2>
            <p className="text-body-md text-on-surface-variant mt-2">Generate and configure new rooms for your hostel.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
            <div className="p-6 bg-surface rounded-2xl shadow-sm border border-outline-variant hover:border-secondary transition-colors group">
                <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">layers</span>
                    Floors
                </h3>
                <div className="space-y-2">
                    {floors.map(floor => (
                        <button
                            key={floor}
                            onClick={() => setSelectedFloor(floor)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                selectedFloor === floor
                                    ? 'bg-primary text-on-primary shadow-md scale-[1.02]'
                                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{selectedFloor === floor ? 'check_circle' : 'radio_button_unchecked'}</span>
                            {floor === 0 ? 'Ground Floor' : `${floor}${getOrdinal(floor)} Floor`}
                        </button>
                    ))}
                    <button
                        onClick={addFloor}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-outline hover:border-primary text-on-surface-variant hover:text-primary bg-surface-container-lowest hover:bg-surface-container transition-colors font-bold mt-4"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add Floor
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-1 space-y-6">
            <div className="p-6 bg-surface rounded-2xl shadow-sm border border-outline-variant">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-body-lg font-bold text-primary">
                        Configure {selectedFloor === 0 ? 'Ground Floor' : `${selectedFloor}${getOrdinal(selectedFloor)} Floor`}
                    </h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-end bg-surface-container-low p-6 rounded-2xl border border-outline-variant/50">
                    <div className="flex-1 w-full">
                        <label className="block text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
                            Number of rooms to generate
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-outline">
                                <span className="material-symbols-outlined">meeting_room</span>
                            </span>
                            <input 
                                type="number"
                                min="1"
                                max="50"
                                value={roomCount || ''}
                                onChange={(e) => setRoomCount(parseInt(e.target.value) || 0)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-outline-variant transition-all focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-outline/70 text-primary font-bold"
                                placeholder="e.g. 10"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={!roomCount}
                        className="w-full sm:w-auto px-8 py-3 bg-secondary text-on-secondary font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">magic_button</span>
                        Generate List
                    </button>
                </div>

                {draftRooms.length > 0 && (
                    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                            <div>
                                <h4 className="text-body-lg font-bold text-primary">Preview Drafts</h4>
                                <p className="text-body-sm text-on-surface-variant">Configuring {draftRooms.length} rooms</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isCreating}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-all shadow-sm disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">{isCreating ? 'hourglass_top' : 'save'}</span>
                                {isCreating ? 'Saving...' : 'Save Rooms'}
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            {draftRooms.map((draft, idx) => (
                                <div key={idx} className="flex flex-col lg:flex-row items-center gap-6 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant hover:border-secondary transition-all group">
                                    <div className="w-full lg:w-32 flex-shrink-0">
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Room No.</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-3 flex items-center text-outline text-xs font-bold">#</span>
                                            <input
                                                value={draft.roomNumber}
                                                onChange={(e) => handleUpdateDraft(idx, 'roomNumber', e.target.value)}
                                                className="w-full pl-6 pr-3 py-2 rounded-lg bg-background border border-outline-variant font-mono font-bold text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Configuration</label>
                                        <div className="flex flex-wrap gap-2">
                                            {BED_OPTIONS.map((opt) => {
                                                const isSelected = (draft.totalBeds === opt.beds && draft.roomType === opt.type) 
                                                || (opt.label === 'Single' && draft.roomType === 'SINGLE' && draft.totalBeds === 1)
                                                || (opt.label === '1 Bed' && draft.roomType === 'SINGLE' && draft.totalBeds === 1);
                                                
                                                return (
                                                    <button
                                                        key={opt.label}
                                                        onClick={() => handleApplyOption(idx, opt.label)}
                                                        className={`px-4 py-2 rounded-lg text-label-md font-bold transition-all border ${
                                                            isSelected
                                                                ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                                                                : 'bg-background text-on-surface-variant border-outline-variant hover:border-outline hover:text-primary'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveDraft(idx)}
                                        className="w-full lg:w-auto p-3 text-error hover:bg-error-container/50 rounded-xl transition-colors border border-transparent hover:border-error-container flex justify-center items-center"
                                        title="Remove Room"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
}

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
