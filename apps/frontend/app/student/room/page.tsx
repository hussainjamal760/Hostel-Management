'use client';

import { useGetStudentMeQuery, useGetStudentsQuery } from '@/lib/services/studentApi';
import { useGetRoomQuery } from '@/lib/services/roomApi';
import { FaWhatsapp } from 'react-icons/fa';

export default function StudentRoomPage() {
  const { data: studentResponse, isLoading: isLoadingMe } = useGetStudentMeQuery();
  const student = studentResponse?.data;
  
  const roomId = (student?.roomId as any)?._id || (typeof student?.roomId === 'string' ? student.roomId : null);
  
  const { data: roomResponse, isLoading: isLoadingRoom } = useGetRoomQuery(roomId, {
    skip: !roomId
  });
  
  const { data: roommatesResponse, isLoading: isLoadingRoommates } = useGetStudentsQuery({ 
    roomId: String(roomId),
    hostelId: String(student?.hostelId)
  }, {
    skip: !roomId || !student?.hostelId
  });

  const room = roomResponse?.data;
  const roommates = roommatesResponse?.data;

  const isLoading = isLoadingMe || isLoadingRoom || isLoadingRoommates;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-surface rounded-3xl border border-outline-variant shadow-sm">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
        <p className="text-body-lg text-on-surface-variant font-medium">Loading room details...</p>
      </div>
    );
  }

  if (!student) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-surface rounded-3xl border border-outline-variant shadow-sm">
          <p className="text-body-lg text-on-surface-variant font-medium">Profile not found.</p>
        </div>
      );
  }

  if (!roomId || !room) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-48 h-48 bg-primary/5 rounded-bl-full transition-transform duration-700 group-hover:scale-125"></div>
        <div className="w-24 h-24 bg-surface-container-highest rounded-[32px] flex items-center justify-center text-on-surface-variant mb-6 shadow-sm relative z-10 rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-110">
          <span className="material-symbols-outlined text-[48px]">domain_disabled</span>
        </div>
        <h3 className="text-display-sm font-bold text-primary mb-3 relative z-10">No Room Assigned</h3>
        <p className="text-body-lg text-on-surface-variant text-center max-w-md relative z-10 font-medium">
          You have not been assigned to a room yet. Please contact your hostel manager to complete your room allocation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                    <span className="material-symbols-outlined text-[36px] text-secondary">meeting_room</span>
                    My Room
                </h1>
                <p className="text-body-lg text-on-surface-variant mt-1">View your room allocation and roommates</p>
            </div>
            <span className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-label-lg uppercase tracking-wider flex items-center gap-2 shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">door_open</span>
                Room {room.roomNumber}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-125"></div>
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 block relative z-10">Floor</span>
                <div className="flex items-center gap-4 mt-auto relative z-10">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">stairs</span>
                    </div>
                    <span className="text-display-md font-bold text-on-surface">{room.floor === 0 ? 'Ground' : `${room.floor}th`}</span>
                </div>
            </div>

            <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-secondary/5 rounded-bl-full transition-transform group-hover:scale-125"></div>
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 block relative z-10">Room Type</span>
                <div className="flex items-center gap-4 mt-auto relative z-10">
                    <div className="w-12 h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">group</span>
                    </div>
                    <span className="text-display-md font-bold text-on-surface capitalize">{room.roomType.toLowerCase()}</span>
                </div>
            </div>

            <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary/5 rounded-bl-full transition-transform group-hover:scale-125"></div>
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 block relative z-10">Capacity</span>
                <div className="flex items-center gap-4 mt-auto relative z-10">
                    <div className="w-12 h-12 bg-tertiary text-on-tertiary rounded-xl flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">bed</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-display-md font-bold text-on-surface">{room.occupiedBeds}</span>
                      <span className="text-body-lg font-medium text-on-surface-variant">/ {room.totalBeds}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                <h3 className="text-display-sm font-bold text-primary flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">groups</span>
                    </div>
                    Roommates
                </h3>
                <span className="px-3 py-1 bg-surface-container rounded-lg text-label-sm font-bold text-on-surface-variant">
                    {roommates?.length || 0} Residents
                </span>
            </div>
            
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roommates && roommates.length > 0 ? (
                        roommates.map((mate) => {
                            const isMe = mate._id === student._id;
                            const mateUser = mate.userId as any;
                            
                            return (
                                <div key={mate._id} className={`flex flex-col sm:flex-row sm:items-center p-5 rounded-2xl border transition-all ${isMe ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/50 hover:bg-surface-container-low'}`}>
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0 ${isMe ? 'bg-primary' : 'bg-secondary'}`}>
                                          {mate.fullName.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-body-lg text-on-surface flex items-center gap-2">
                                              {mate.fullName} 
                                              {isMe && <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">YOU</span>}
                                          </h4>
                                          <p className="text-body-md text-on-surface-variant font-medium flex items-center gap-1.5 mt-0.5">
                                            <span className="material-symbols-outlined text-[16px]">single_bed</span>
                                            Bed {mate.bedNumber}
                                          </p>
                                      </div>
                                    </div>
                                    {!isMe && (
                                        <div className="mt-4 sm:mt-0 sm:ml-4 flex justify-end">
                                          <a 
                                              href={getWhatsAppLink(mateUser?.phone)} 
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors flex items-center gap-2 font-bold text-label-md border border-green-200 shadow-sm group"
                                              title="Chat on WhatsApp"
                                          >
                                              <FaWhatsapp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                              Message
                                          </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-1 md:col-span-2 py-12 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
                          <span className="material-symbols-outlined text-[48px] mb-3 opacity-50">person_off</span>
                          <p className="text-body-lg font-medium">You are currently the only one in this room.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

const getWhatsAppLink = (phone: string) => {
  if (!phone) return '#';
  let clean = phone.replace(/\D/g, '');
  
  if (clean.startsWith('03')) {
    clean = '92' + clean.substring(1);
  }
  
  return `https://wa.me/${clean}`;
};

