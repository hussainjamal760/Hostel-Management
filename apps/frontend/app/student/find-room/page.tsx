'use client';

import React, { useMemo } from 'react';
import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { IRoom } from '@hostelite/shared-types';
import { HiOutlineOfficeBuilding, HiOutlineUser } from 'react-icons/hi';
import { RiHotelBedLine } from 'react-icons/ri';

export default function FindRoomPage() {
  const { data: studentResponse, isLoading: studentLoading } = useGetStudentMeQuery();
  const hostelId = studentResponse?.data?.hostelId;

  const { data: roomsResponse, isLoading: roomsLoading } = useGetRoomsQuery(
    { hostelId: hostelId as string, limit: 1000, status: 'PARTIAL' }, // or fetch all
    { skip: !hostelId }
  );

  const { data: allRoomsResponse, isLoading: allRoomsLoading } = useGetRoomsQuery(
      { hostelId: hostelId as string, limit: 1000 },
      { skip: !hostelId }
  );

  const rooms = allRoomsResponse?.data || [];

  const roomsByFloor = useMemo(() => {
    const grouped: Record<number, IRoom[]> = {};
    rooms.forEach((room) => {
      if (!grouped[room.floor]) {
        grouped[room.floor] = [];
      }
      grouped[room.floor].push(room);
    });
    return grouped;
  }, [rooms]);

  const floors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => a - b);

  if (studentLoading || allRoomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!hostelId) {
     return (
         <div className="p-6 text-center text-red-500">
             Unable to load hostel information.
         </div>
     )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">Find Room</h1>
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200 flex items-center justify-center">
                    <RiHotelBedLine className="text-red-500 w-3 h-3" />
                </div>
                <span className="text-brand-text/70 dark:text-dark-text/70">Taken</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200 flex items-center justify-center">
                     <RiHotelBedLine className="text-green-500 w-3 h-3" />
                </div>
                <span className="text-brand-text/70 dark:text-dark-text/70">Free</span>
            </div>
        </div>
      </div>

      <div className="space-y-8">
        {floors.map((floor) => (
          <div key={floor} className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-brand-card/20 dark:border-dark-card/20">
            <h2 className="text-lg font-semibold text-brand-text dark:text-dark-text mb-4 flex items-center gap-2">
              <HiOutlineOfficeBuilding className="text-brand-primary" />
              {floor === 0 ? 'Ground Floor' : `${floor}${getOrdinalSuffix(floor)} Floor`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {roomsByFloor[floor]
                .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                .map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </div>
        ))}
        
        {floors.length === 0 && (
            <div className="text-center py-10 text-brand-text/50">
                No rooms found.
            </div>
        )}
      </div>
    </div>
  );
}

function RoomCard({ room }: { room: IRoom }) {
  const freeBeds = room.totalBeds - room.occupiedBeds;
  const isFull = freeBeds === 0;
  const beds = Array.from({ length: room.totalBeds }).map((_, i) => ({
    id: i,
    isTaken: i < room.occupiedBeds,
  }));

  return (
    <div className={`
        relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md
        ${isFull 
            ? 'bg-gray-50 dark:bg-dark-bg/50 border-gray-200 dark:border-gray-800' 
            : 'bg-white dark:bg-dark-card border-brand-card dark:border-dark-card-border'}
    `}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-brand-text dark:text-dark-text text-lg">{room.roomNumber}</h3>
          <p className="text-xs text-brand-text/60 dark:text-dark-text/60 uppercase tracking-wider">{room.roomType}</p>
        </div>
        <div className={`
            px-2 py-1 rounded-lg text-xs font-medium
            ${isFull
                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'}
        `}>
          {isFull ? 'Full' : `${freeBeds} Free`}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {beds.map((bed) => (
            <div 
                key={bed.id}
                title={bed.isTaken ? 'Taken' : 'Free'}
                className={`
                    aspect-square rounded-lg flex items-center justify-center transition-colors
                    ${bed.isTaken
                        ? 'bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400' // Taken
                        : 'bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30' // Free
                    }
                `}
            >
                <RiHotelBedLine size={20} />
            </div>
        ))}
      </div>
    </div>
  );
}

function getOrdinalSuffix(i: number) {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return 'st';
  }
  if (j == 2 && k != 12) {
    return 'nd';
  }
  if (j == 3 && k != 13) {
    return 'rd';
  }
  return 'th';
}
