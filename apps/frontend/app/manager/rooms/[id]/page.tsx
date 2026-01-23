'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetRoomQuery } from '@/lib/services/roomApi';
import { HiArrowLeft, HiOutlineUserAdd, HiUser } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: roomData, isLoading, error } = useGetRoomQuery(id as string);
  const room = roomData?.data;

  const handleCreateStudent = (bedIndex: number) => {
    // Placeholder for next task
    toast('Student creation flow coming soon!', { icon: '🚧' });
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
    );
  }

  if (error || !room) {
    return (
        <div className="text-center py-12">
            <h3 className="text-xl font-bold text-red-500">Error loading room</h3>
            <button 
                onClick={() => router.back()}
                className="mt-4 text-brand-primary hover:underline"
            >
                Go Back
            </button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-brand-primary/10 transition-colors"
        >
            <HiArrowLeft size={24} className="text-brand-text dark:text-dark-text" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">
            Room {room.roomNumber}
          </h1>
          <p className="text-sm text-brand-text/60 dark:text-dark-text/60">
            {room.floor === 0 ? 'Ground Floor' : `Floor ${room.floor}`} • {room.roomType}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5">
                <h3 className="font-semibold text-brand-text dark:text-dark-text mb-4">Details</h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-brand-text/60 dark:text-dark-text/60">Type</span>
                        <span className="font-medium text-brand-text dark:text-dark-text">{room.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-brand-text/60 dark:text-dark-text/60">Floor</span>
                        <span className="font-medium text-brand-text dark:text-dark-text">{room.floor}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-brand-text/60 dark:text-dark-text/60">Total Beds</span>
                        <span className="font-medium text-brand-text dark:text-dark-text">{room.totalBeds}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-brand-text/60 dark:text-dark-text/60">Occupied</span>
                        <span className={`font-medium ${room.occupiedBeds > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                            {room.occupiedBeds}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Beds Grid */}
        <div className="lg:col-span-2">
            <div className="p-6 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5">
                <h3 className="font-semibold text-brand-text dark:text-dark-text mb-6">Bed Configuration</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: room.totalBeds }).map((_, index) => {
                        const isOccupied = index < room.occupiedBeds;
                        
                        return (
                            <div 
                                key={index}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    isOccupied 
                                        ? 'border-brand-primary/20 bg-brand-primary/5' 
                                        : 'border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-primary/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-brand-text/70 dark:text-dark-text/70">
                                        Bed {index + 1}
                                    </span>
                                    {isOccupied ? (
                                        <span className="px-2 py-1 bg-brand-primary text-white text-xs font-bold rounded-lg">
                                            Occupied
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-lg">
                                            Available
                                        </span>
                                    )}
                                </div>

                                {isOccupied ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                                            <HiUser size={20} />
                                        </div>
                                        <div>
                                            {/* Placeholder for student data since we don't have it in room object yet */}
                                            <p className="font-medium text-brand-text dark:text-dark-text">Student Name</p>
                                            <p className="text-xs text-brand-text/60">View Details</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleCreateStudent(index)}
                                        className="w-full py-2 flex items-center justify-center gap-2 bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-primary hover:text-brand-primary transition-all text-sm font-medium text-gray-500"
                                    >
                                        <HiOutlineUserAdd size={18} />
                                        Add Student
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
