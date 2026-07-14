'use client';

import { useRouter } from 'next/navigation';
import { IRoom } from '@hostelite/shared-types';

interface RoomVisualMapProps {
    rooms: IRoom[];
}

export default function RoomVisualMap({ rooms }: RoomVisualMapProps) {
    const router = useRouter();

    const floors = rooms.reduce((acc, room) => {
        const floorKey = room.floor; 
        if (!acc[floorKey]) acc[floorKey] = [];
        acc[floorKey].push(room);
        return acc;
    }, {} as Record<number, IRoom[]>);

    const sortedFloors = Object.keys(floors).map(Number).sort((a, b) => a - b);

    return (
        <div className="space-y-8">
            {sortedFloors.map((floor) => (
                <div key={floor} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-3 pb-4 border-b border-outline-variant">
                        <span className="w-2 h-6 bg-secondary rounded-full"></span>
                        {floor === 0 ? 'Ground Floor' : `Floor ${floor}`}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4">
                        {floors[floor].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)).map((room) => {
                             const isFull = room.occupiedBeds >= room.totalBeds;
                             const isEmpty = room.occupiedBeds === 0;
                             
                             return (
                                <div 
                                    key={room._id}
                                    className={`relative group w-40 p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center h-32
                                        ${isFull 
                                            ? 'border-error/30 bg-error-container' 
                                            : isEmpty 
                                                ? 'border-secondary/30 bg-secondary-container'
                                                : 'border-primary/30 bg-primary-container'
                                        }
                                        hover:shadow-md hover:-translate-y-1 hover:border-opacity-100
                                    `}
                                    onClick={() => router.push(`/manager/rooms/${room._id}`)}
                                >
                                    <div className="text-center mb-3">
                                        <span className={`font-bold text-lg ${isFull ? 'text-error' : isEmpty ? 'text-secondary' : 'text-primary'}`}>
                                            {room.roomNumber}
                                        </span>
                                        <p className="text-[10px] uppercase font-bold text-on-surface-variant opacity-70 tracking-wider mt-0.5">{room.roomType}</p>
                                    </div>

                                    <div className="flex justify-center gap-1.5 flex-wrap">
                                        {Array.from({ length: room.totalBeds }).map((_, i) => (
                                            <div 
                                                key={i}
                                                className={`w-2.5 h-2.5 rounded-full ${i < room.occupiedBeds 
                                                    ? (isFull ? 'bg-error' : 'bg-primary') 
                                                    : 'bg-outline-variant border border-outline/30'}`
                                                }
                                                title={i < room.occupiedBeds ? "Occupied" : "Empty"}
                                            />
                                        ))}
                                    </div>

                                    {!isFull && (
                                        <div className="absolute inset-0 bg-surface/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                             <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/manager/students/create?roomId=${room._id}`);
                                                }}
                                                className="bg-primary text-on-primary w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-white"
                                                title="Quick Add Student"
                                            >
                                                <span className="material-symbols-outlined">person_add</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                             );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
