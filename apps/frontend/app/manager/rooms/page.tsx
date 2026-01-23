'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useBulkCreateRoomsMutation, useGetRoomsQuery, useDeleteRoomMutation } from '@/lib/services/roomApi';
import { toast } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineOfficeBuilding, HiOutlineSave } from 'react-icons/hi';
import { ROOM_TYPES } from '@hostelite/shared-constants';

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

export default function ManageRoomsPage() {
  const { user } = useAppSelector((state) => state.auth);
  // Manager's hostelId should be in user object or fetched. 
  // Need to handle if user.hostelId is missing (e.g. reload).
  // For now assuming existing flow populates it or sidebar handles it.
  
  const [floors, setFloors] = useState<number[]>([0, 1, 2]); // Default floors
  const [selectedFloor, setSelectedFloor] = useState<number>(1); // Default to 1st floor
  const [roomCount, setRoomCount] = useState<number>(0);
  const [draftRooms, setDraftRooms] = useState<RoomDraft[]>([]);
  
  const [bulkCreate, { isLoading: isCreating }] = useBulkCreateRoomsMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  // Fetch existing rooms for selected floor to display or avoid duplicates
  const { data: existingRoomsData, refetch } = useGetRoomsQuery({
     hostelId: user?.hostelId, // Check if this exists on user type
     floor: selectedFloor,
     limit: 100 // Reasonable limit for a floor
  }, { skip: !user?.hostelId });

  // Handle Generate
  const handleGenerate = () => {
    if (roomCount <= 0) return;
    
    // Generate room numbers based on floor
    // Floor 0 -> 001..010 ? Or G01? Let's assume 001 for ground.
    // Floor 1 -> 101..110
    // Floor 2 -> 201..210
    
    // Determine start number
    let startNum = 1;
    if (selectedFloor > 0) {
        startNum = selectedFloor * 100 + 1;
    } else {
        startNum = 1; // Ground floor starts at 001
    }

    const newDrafts: RoomDraft[] = [];
    
    for (let i = 0; i < roomCount; i++) {
        const currentNum = startNum + i;
        // Pad number: 1 -> 001, 101 -> 101
        const numStr = currentNum.toString().padStart(3, '0');
        
        newDrafts.push({
            roomNumber: numStr,
            floor: selectedFloor,
            roomType: 'SINGLE',
            totalBeds: 1,
            rent: 0 // Default rent
        });
    }
    setDraftRooms(newDrafts);
  };

  const handleUpdateDraft = (index: number, field: keyof RoomDraft, value: any) => {
    const updated = [...draftRooms];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-update beds/type if one changes?
    if (field === 'totalBeds' || field === 'roomType') {
        // The Select changes both usually via the "Bed Option"
    }
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
          refetch();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">Manage Rooms</h1>
          <p className="text-sm text-brand-text/60 dark:text-dark-text/60">Organize floors and rooms</p>
        </div>
        <button 
            disabled // Placeholder or global settings
            className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl font-medium"
        >
            Settings
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Floor Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
            <div className="p-4 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5">
                <h3 className="font-semibold text-brand-text dark:text-dark-text mb-4">Floors</h3>
                <div className="space-y-1">
                    {floors.map(floor => (
                        <button
                            key={floor}
                            onClick={() => setSelectedFloor(floor)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                                selectedFloor === floor
                                    ? 'bg-brand-primary text-white font-semibold shadow-lg shadow-brand-primary/20'
                                    : 'text-brand-text/70 dark:text-dark-text/70 hover:bg-brand-primary/5'
                            }`}
                        >
                            {floor === 0 ? 'Ground Floor' : `${floor}${getOrdinal(floor)} Floor`}
                        </button>
                    ))}
                    <button
                        onClick={addFloor}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 transition-colors font-medium mt-2"
                    >
                        <HiOutlinePlus />
                        Add Floor
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
            {/* Generator Section */}
            <div className="p-6 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5">
                <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4">
                    Create Rooms on {selectedFloor === 0 ? 'Ground Floor' : `${selectedFloor}${getOrdinal(selectedFloor)} Floor`}
                </h3>
                
                <div className="flex gap-4 items-end">
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm font-semibold text-brand-text dark:text-dark-text mb-2">
                            Number of rooms to create
                        </label>
                        <input 
                            type="number"
                            min="1"
                            max="50"
                            value={roomCount || ''}
                            onChange={(e) => setRoomCount(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl bg-brand-bg dark:bg-dark-bg border border-brand-primary/10 transition-all focus:ring-2 focus:ring-brand-primary hover:border-brand-primary/30"
                            placeholder="e.g. 10"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={!roomCount}
                        className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Generate Lists
                    </button>
                </div>

                {/* Drafts List */}
                {draftRooms.length > 0 && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-brand-text dark:text-dark-text">New Rooms Preview ({draftRooms.length})</h4>
                            <button
                                onClick={handleSave}
                                disabled={isCreating}
                                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                            >
                                <HiOutlineSave size={20} />
                                {isCreating ? 'Saving...' : 'Save Rooms'}
                            </button>
                        </div>
                        
                        <div className="grid gap-3">
                            {draftRooms.map((draft, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-brand-bg/50 dark:bg-dark-bg/50 border border-brand-primary/5 hover:border-brand-primary/20 transition-all">
                                    <div className="w-full sm:w-24">
                                        <label className="text-xs font-bold text-brand-text/50 uppercase mb-1">Room No.</label>
                                        <input
                                            value={draft.roomNumber}
                                            onChange={(e) => handleUpdateDraft(idx, 'roomNumber', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-card border border-brand-primary/10 font-mono font-bold text-center"
                                        />
                                    </div>
                                    
                                    <div className="flex-1 w-full">
                                        <label className="text-xs font-bold text-brand-text/50 uppercase mb-1">Configuration</label>
                                        <div className="flex flex-wrap gap-2">
                                            {BED_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.label}
                                                    onClick={() => handleApplyOption(idx, opt.label)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                        (draft.totalBeds === opt.beds && draft.roomType === opt.type) 
                                                        || (opt.label === 'Single' && draft.roomType === 'SINGLE' && draft.totalBeds === 1)
                                                        || (opt.label === '1 Bed' && draft.roomType === 'SINGLE' && draft.totalBeds === 1)
                                                            ? 'bg-brand-primary text-white shadow-md'
                                                            : 'bg-white dark:bg-dark-card text-brand-text hover:bg-brand-primary/10'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rent field removed as per request */}

                                    <button
                                        onClick={() => handleRemoveDraft(idx)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-4 sm:mt-0"
                                    >
                                        <HiOutlineTrash size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Existing Rooms List */}
            <div className="p-6 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5">
                <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4">
                    Existing Rooms
                </h3>
                {existingRoomsData?.data && existingRoomsData.data.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {existingRoomsData.data.map((room) => (
                            <div key={room._id} className="p-4 rounded-xl bg-brand-bg dark:bg-dark-bg border border-brand-primary/10 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono font-bold text-xl text-brand-primary">{room.roomNumber}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-brand-primary/10 text-brand-primary font-bold">
                                        {room.roomType}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm text-brand-text/70 dark:text-dark-text/70">
                                    <p>Beds: {room.totalBeds}</p>
                                    <p>Rent: ${room.rent}</p>
                                    <p className={room.occupiedBeds > 0 ? 'text-orange-500' : 'text-green-500'}>
                                        {room.occupiedBeds} Occupied
                                    </p>
                                </div>
                                {/* TODO: Edit/Delete Actions */}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-brand-text/50 text-center py-8">No rooms on this floor yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
