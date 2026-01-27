'use client';

import React, { useState, useMemo } from 'react';
import { HiX, HiOutlineOfficeBuilding, HiArrowRight } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { useGetStudentsQuery, useUpdateStudentMutation } from '@/lib/services/studentApi';
import { useAppSelector } from '@/lib/hooks';
import { IRoom } from '@hostelite/shared-types';
import { RiHotelBedLine } from 'react-icons/ri';

interface ChangeRoomModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  studentId: string;
  studentName: string;
  currentRoom?: IRoom; // Object or partial
  currentBed?: string;
  onSuccess: () => void;
}

export default function ChangeRoomModal({
  open,
  setOpen,
  studentId,
  studentName,
  currentRoom,
  currentBed,
  onSuccess,
}: ChangeRoomModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedBed, setSelectedBed] = useState<string>('');

  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  // Fetch API data
  const { data: roomsResponse } = useGetRoomsQuery(
    { hostelId: user?.hostelId, limit: 1000 },
    { skip: !open || !user?.hostelId }
  );
  
  // Get occupied beds for the selected room
  const { data: studentsInRoomResponse } = useGetStudentsQuery(
      { roomId: selectedRoomId, limit: 100, feeStatus: 'ALL' }, // 'feeStatus: ALL' ensures we get everyone regardless of status
      { skip: !selectedRoomId }
  );

  const rooms = roomsResponse?.data || [];
  const studentsInRoom = studentsInRoomResponse?.data || [];
  
  const selectedRoom = rooms.find(r => r._id === selectedRoomId);

  // Determine taken beds
  const takenBeds = useMemo(() => {
      const set = new Set<string>();
      studentsInRoom.forEach(s => {
          if (s.bedNumber) set.add(s.bedNumber);
      });
      return set;
  }, [studentsInRoom]);

  // Generate bed list for grid
  const bedGrid = useMemo(() => {
      if (!selectedRoom) return [];
      return Array.from({ length: selectedRoom.totalBeds }).map((_, i) => {
          const bedNum = (i + 1).toString(); // Assuming beds 1..N
          return {
              bedNumber: bedNum,
              isTaken: takenBeds.has(bedNum),
          };
      });
  }, [selectedRoom, takenBeds]);

  const handleSubmit = async () => {
    if (!selectedRoomId || !selectedBed) {
        toast.error('Please select a room and a bed');
        return;
    }

    try {
        await updateStudent({
            id: studentId,
            data: {
                roomId: selectedRoomId,
                bedNumber: selectedBed
            }
        }).unwrap();
        
        toast.success('Student moved successfully');
        onSuccess();
        setOpen(false);
        setSelectedRoomId('');
        setSelectedBed('');
    } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to move student');
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-[#1a0f0a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a0f0a]">
            <div>
              <h2 className="text-xl font-bold text-brand-text dark:text-dark-text">Change Room</h2>
              <p className="text-sm text-brand-text/60">Moving {studentName}</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <HiX size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Current Status */}
            <div className="flex items-center gap-4 bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
                <div className="flex-1">
                    <p className="text-xs font-bold uppercase text-brand-text/50">Current Location</p>
                    <p className="font-semibold text-brand-text dark:text-dark-text">
                        Room {currentRoom?.roomNumber || 'N/A'} • Bed {currentBed || 'N/A'}
                    </p>
                </div>
                <HiArrowRight className="text-brand-primary/40" size={24} />
                <div className="flex-1 text-right">
                    <p className="text-xs font-bold uppercase text-brand-text/50">Target Location</p>
                    <p className="font-semibold text-brand-text dark:text-dark-text">
                        {selectedRoom ? `Room ${selectedRoom.roomNumber}` : 'Select Room'} • {selectedBed ? `Bed ${selectedBed}` : 'Select Bed'}
                    </p>
                </div>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-brand-text dark:text-dark-text">Select New Room</label>
                <select 
                    value={selectedRoomId}
                    onChange={(e) => {
                        setSelectedRoomId(e.target.value);
                        setSelectedBed('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                    <option value="">-- Choose a Room --</option>
                    {[...rooms]
                        .sort((a,b) => a.roomNumber.localeCompare(b.roomNumber))
                        .map((room) => {
                            const freeCount = room.totalBeds - room.occupiedBeds;
                            // Disable current room and full rooms (though logic allows swapping if we implement it, but for now simple move)
                            const isCurrent = room._id === currentRoom?._id;
                            const isFull = freeCount <= 0;
                            
                            // Allow selecting even if full? No, prevent it.
                            // Unless we were swapping.. but let's stick to moving to free bed.
                            return (
                                <option 
                                    key={room._id} 
                                    value={room._id}
                                    disabled={isCurrent || isFull}
                                >
                                    Room {room.roomNumber} ({room.roomType}) - {isFull ? 'FULL' : `${freeCount} beds free`}
                                    {isCurrent ? ' (Current)' : ''}
                                </option>
                            );
                        })}
                </select>
            </div>

            {/* Bed Selection Grid */}
            {selectedRoomId && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-brand-text dark:text-dark-text">Select Bed</label>
                        <div className="flex gap-4 text-xs font-medium">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div> Available</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Taken</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-brand-primary text-white"></div> Selected</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {bedGrid.map((bed) => {
                             const isSelected = selectedBed === bed.bedNumber;
                             return (
                                 <button
                                    key={bed.bedNumber}
                                    onClick={() => !bed.isTaken && setSelectedBed(bed.bedNumber)}
                                    disabled={bed.isTaken}
                                    className={`
                                        aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all
                                        ${bed.isTaken 
                                            ? 'bg-red-50 border-red-100 text-red-300 cursor-not-allowed' 
                                            : isSelected 
                                                ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-green-300 hover:bg-green-50 hover:text-green-600'
                                        }
                                    `}
                                 >
                                     <RiHotelBedLine size={24} />
                                     <span className="text-xs font-bold">{bed.bedNumber}</span>
                                 </button>
                             );
                        })}
                    </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#1a0f0a]/50">
            <button 
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                disabled={!selectedRoomId || !selectedBed || isUpdating}
                className="px-6 py-2.5 rounded-xl font-bold bg-brand-primary text-white hover:brightness-110 shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isUpdating ? 'Moving Student...' : 'Confirm Move'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
