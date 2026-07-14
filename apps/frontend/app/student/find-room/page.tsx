'use client';

import React, { useMemo } from 'react';
import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { IRoom } from '@hostelite/shared-types';

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
      <div className="flex flex-col items-center justify-center h-[50vh] bg-surface rounded-3xl border border-outline-variant shadow-sm">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
        <p className="text-body-lg text-on-surface-variant font-medium">Loading rooms...</p>
      </div>
    );
  }

  if (!hostelId) {
     return (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
          <div className="w-24 h-24 bg-error-container rounded-[32px] flex items-center justify-center text-error mb-6 shadow-sm relative z-10 rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-110">
            <span className="material-symbols-outlined text-[48px]">domain_disabled</span>
          </div>
          <h3 className="text-display-sm font-bold text-error mb-3 relative z-10">Hostel Not Found</h3>
          <p className="text-body-lg text-on-surface-variant text-center max-w-md relative z-10 font-medium">
            Unable to load your hostel information. Please try again or contact support.
          </p>
        </div>
     )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-[36px] text-secondary">search</span>
                Find Room
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-1">Browse available rooms in your hostel</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/50">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-error-container text-error flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">single_bed</span>
                </div>
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Taken</span>
            </div>
            <div className="w-px h-6 bg-outline-variant"></div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-100 text-green-700 flex items-center justify-center shadow-sm">
                     <span className="material-symbols-outlined text-[14px]">single_bed</span>
                </div>
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Free</span>
            </div>
        </div>
      </div>

      <div className="space-y-10">
        {floors.map((floor) => (
          <div key={floor} className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[24px]">layers</span>
              </div>
              <h2 className="text-display-sm font-bold text-primary">
                {floor === 0 ? 'Ground Floor' : `${floor}${getOrdinalSuffix(floor)} Floor`}
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roomsByFloor[floor]
                  .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                  .map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {floors.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-[48px] mb-3 opacity-50">search_off</span>
              <p className="text-body-lg font-medium">No rooms found in this hostel.</p>
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
        relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md
        ${isFull 
            ? 'bg-surface-container-lowest border-outline-variant/50 opacity-75 grayscale-[0.5]' 
            : 'bg-surface border-outline-variant'}
    `}>
      <div className="p-5 border-b border-outline-variant/50 bg-surface-container-lowest flex justify-between items-start">
        <div>
          <h3 className="font-bold text-display-xs text-on-surface mb-0.5">{room.roomNumber}</h3>
          <p className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{room.roomType}</p>
        </div>
        <div className={`
            px-3 py-1 rounded-xl text-label-sm font-bold uppercase tracking-wider border shadow-sm
            ${isFull
                ? 'bg-error-container text-error border-error/20'
                : 'bg-green-100 text-green-700 border-green-200'}
        `}>
          {isFull ? 'Full' : `${freeBeds} Free`}
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface">
        {beds.map((bed) => (
            <div 
                key={bed.id}
                title={bed.isTaken ? 'Taken' : 'Free'}
                className={`
                    aspect-square rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm border
                    ${bed.isTaken
                        ? 'bg-error-container text-error border-error/20' // Taken
                        : 'bg-green-100 text-green-600 border-green-200 cursor-pointer' // Free
                    }
                `}
            >
                <span className="material-symbols-outlined text-[24px]">single_bed</span>
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
