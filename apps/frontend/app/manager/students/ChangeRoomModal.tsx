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
  currentRoom?: IRoom; 
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

  const { data: roomsResponse } = useGetRoomsQuery(
    { hostelId: user?.hostelId, limit: 1000 },
    { skip: !open || !user?.hostelId }
  );
  
  const { data: studentsInRoomResponse } = useGetStudentsQuery(
      { roomId: selectedRoomId, limit: 100, feeStatus: 'ALL' }, 
      { skip: !selectedRoomId }
  );

  const rooms = roomsResponse?.data || [];
  const studentsInRoom = studentsInRoomResponse?.data || [];
  
  const selectedRoom = rooms.find(r => r._id === selectedRoomId);

  const takenBeds = useMemo(() => {
      const set = new Set<string>();
      studentsInRoom.forEach(s => {
          if (s.bedNumber) set.add(s.bedNumber);
      });
      return set;
  }, [studentsInRoom]);

  const bedGrid = useMemo(() => {
      if (!selectedRoom) return [];
      return Array.from({ length: selectedRoom.totalBeds }).map((_, i) => {
          const bedNum = (i + 1).toString(); 
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
      <div className="fixed inset-0 z-[100] bg-surface-container-highest/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface">
            <div>
              <h2 className="text-body-xl font-bold text-primary">Change Room</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">Moving {studentName}</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-surface-container text-on-surface-variant rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
            
            <div className="flex items-center gap-4 bg-primary-container/20 p-5 rounded-2xl border border-primary-container">
                <div className="flex-1">
                    <p className="text-label-sm font-bold uppercase text-on-surface-variant mb-1">Current Location</p>
                    <p className="font-bold text-primary">
                        Room {currentRoom?.roomNumber || 'N/A'} <span className="text-on-surface-variant/50 mx-1">•</span> Bed {currentBed || 'N/A'}
                    </p>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-3xl">arrow_forward</span>
                <div className="flex-1 text-right">
                    <p className="text-label-sm font-bold uppercase text-on-surface-variant mb-1">Target Location</p>
                    <p className="font-bold text-primary">
                        {selectedRoom ? `Room ${selectedRoom.roomNumber}` : 'Select Room'} <span className="text-on-surface-variant/50 mx-1">•</span> {selectedBed ? `Bed ${selectedBed}` : 'Select Bed'}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-label-lg font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">meeting_room</span>
                    Select New Room
                </label>
                <select 
                    value={selectedRoomId}
                    onChange={(e) => {
                        setSelectedRoomId(e.target.value);
                        setSelectedBed('');
                    }}
                    className="w-full px-4 py-3.5 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                >
                    <option value="">-- Choose a Room --</option>
                    {[...rooms]
                        .sort((a,b) => a.roomNumber.localeCompare(b.roomNumber))
                        .map((room) => {
                            const freeCount = room.totalBeds - room.occupiedBeds;
                            const isCurrent = room._id === currentRoom?._id;
                            const isFull = freeCount <= 0;
                            
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

            {selectedRoomId && (
                <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label className="text-label-lg font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">bed</span>
                            Select Bed
                        </label>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-surface border border-outline-variant"></div> Available</span>
                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-error-container border border-error-container"></div> Taken</span>
                            <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-primary"></div> Selected</span>
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
                                        aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all
                                        ${bed.isTaken 
                                            ? 'bg-error-container/20 border-error-container text-error/40 cursor-not-allowed' 
                                            : isSelected 
                                                ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/30 scale-105'
                                                : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/50 hover:bg-primary-container hover:text-primary'
                                        }
                                    `}
                                 >
                                     <span className="material-symbols-outlined text-[28px]">bed</span>
                                     <span className="text-xs font-bold">{bed.bedNumber}</span>
                                 </button>
                             );
                        })}
                    </div>
                </div>
            )}
          </div>

          <div className="p-6 border-t border-outline-variant flex justify-end gap-3 bg-surface-container">
            <button 
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold bg-surface border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                disabled={!selectedRoomId || !selectedBed || isUpdating}
                className="px-6 py-2.5 flex items-center gap-2 rounded-xl font-bold bg-primary text-on-primary hover:bg-on-primary-fixed-variant shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <span className="material-symbols-outlined">{isUpdating ? 'hourglass_top' : 'move_up'}</span>
                {isUpdating ? 'Moving Student...' : 'Confirm Move'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
