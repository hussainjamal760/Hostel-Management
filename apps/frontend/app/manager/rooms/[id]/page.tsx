'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetRoomQuery, useDeleteRoomMutation } from '@/lib/services/roomApi';
import { useGetStudentsQuery } from '@/lib/services/studentApi';
import { useAppSelector } from '@/lib/hooks';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import AddStudentModal from './AddStudentModal';
import StudentDetailsModal from './StudentDetailsModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: roomData, isLoading, error, refetch: refetchRoom } = useGetRoomQuery(id as string);
  const room = roomData?.data;

  const { data: studentsData, refetch: refetchStudents } = useGetStudentsQuery({
    hostelId: user?.hostelId,
    roomId: id as string,
    limit: 100 
  }, { skip: !user?.hostelId || !id });
  
  const students = studentsData?.data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<string>('');

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleCreateStudent = (bedIndex: number) => {
    setSelectedBed((bedIndex + 1).toString());
    setModalOpen(true);
  };
  
  const handleViewDetails = (studentId: string) => {
      setSelectedStudentId(studentId);
      setDetailsModalOpen(true);
  };

  const [deleteRoom, { isLoading: isDeletingRoom }] = useDeleteRoomMutation();

  const handleDeleteRoomClick = () => {
      setDeleteModalOpen(true);
  };

  const onConfirmDeleteRoom = async () => {
      try {
          await deleteRoom(room?._id!).unwrap();
          toast.success('Room deleted successfully');
          router.push('/manager/rooms');
      } catch (err: any) {
          toast.error(err?.data?.message || 'Failed to delete room');
          setDeleteModalOpen(false);
      }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (error || !room) {
    return (
        <div className="text-center py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[40px]">error</span>
            </div>
            <h3 className="text-body-lg font-bold text-error mb-2">Error loading room</h3>
            <button 
                onClick={() => router.back()}
                className="mt-4 px-6 py-2 bg-surface border border-outline-variant rounded-xl hover:bg-surface-container transition-colors font-medium text-on-surface"
            >
                Go Back
            </button>
        </div>
    );
  }

  return (
    <>
      {/* Header section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-2">
            <button 
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant flex items-center justify-center"
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                Room {room.roomNumber}
                <span className="text-label-md bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full uppercase font-bold tracking-wider align-middle">
                    {room.roomType}
                </span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">layers</span>
                {room.floor === 0 ? 'Ground Floor' : `Floor ${room.floor}`}
              </p>
            </div>
            <button 
                onClick={handleDeleteRoomClick}
                className="px-5 py-2.5 bg-error-container/50 text-error hover:bg-error-container rounded-xl font-bold transition-colors flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Delete Room
            </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Details Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-surface rounded-2xl shadow-sm border border-outline-variant hover:border-secondary transition-colors group">
                <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">info</span>
                    Room Details
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50">
                        <span className="text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">category</span> Type
                        </span>
                        <span className="font-bold text-primary">{room.roomType}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50">
                        <span className="text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">layers</span> Floor
                        </span>
                        <span className="font-bold text-primary">{room.floor}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50">
                        <span className="text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">bed</span> Total Beds
                        </span>
                        <span className="font-bold text-primary">{room.totalBeds}</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/50">
                        <span className="text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">group</span> Occupied
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded-md ${room.occupiedBeds > 0 ? (room.occupiedBeds >= room.totalBeds ? 'bg-error-container text-error' : 'bg-primary-container text-primary') : 'bg-surface-container text-on-surface'}`}>
                            {room.occupiedBeds} / {room.totalBeds}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Bed Configuration Main Content */}
        <div className="lg:col-span-2">
            <div className="p-6 bg-surface rounded-2xl shadow-sm border border-outline-variant">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
                    <h3 className="text-body-lg font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">hotel</span>
                        Bed Configuration
                    </h3>
                    <div className="text-label-md text-on-surface-variant">
                        {room.totalBeds - room.occupiedBeds} beds available
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: room.totalBeds }).map((_, index) => {
                        const bedNumber = (index + 1).toString();
                        const student = students.find(s => s.bedNumber === bedNumber);
                        const isOccupied = !!student;
                        
                        return (
                            <div 
                                key={index}
                                className={`p-5 rounded-2xl border-2 transition-all group relative overflow-hidden ${
                                    isOccupied 
                                        ? 'border-primary/20 bg-primary-container/20 hover:border-primary/40' 
                                        : 'border-dashed border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-surface-container'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-on-surface-variant uppercase tracking-wider text-label-md flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">bed</span>
                                        Bed {bedNumber}
                                    </span>
                                    {isOccupied ? (
                                        <span className="px-2.5 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                            Occupied
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                            Available
                                        </span>
                                    )}
                                </div>

                                {isOccupied ? (
                                    <div className="flex items-center justify-between gap-3 bg-surface p-3 rounded-xl shadow-sm border border-outline-variant/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-lg shadow-sm">
                                                {student.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary text-sm truncate max-w-[120px]">
                                                    {student.fullName}
                                                </p>
                                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                                                    ID: {student._id.substring(student._id.length - 6)}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleViewDetails(student._id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-primary transition-colors"
                                            title="View Student Details"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleCreateStudent(index)}
                                        className="w-full py-3 flex items-center justify-center gap-2 bg-background border border-outline-variant rounded-xl text-on-surface-variant transition-all font-bold group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary"
                                    >
                                        <span className="material-symbols-outlined">person_add</span>
                                        Assign Student
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>

      {room && (
        <AddStudentModal 
            open={modalOpen} 
            setOpen={setModalOpen}
            roomId={room._id}
            bedNumber={selectedBed}
            onSuccess={() => {
                // Keep modal open to show credentials (handled inside modal), 
                // but refresh room data to show occupied status
                refetchRoom();
                refetchStudents();
            }}
        />
      )}
      
      {detailsModalOpen && (
          <StudentDetailsModal
            open={detailsModalOpen}
            setOpen={setDetailsModalOpen}
            studentId={selectedStudentId}
            onSuccess={() => {
                refetchStudents();
            }}
          />
      )}
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onConfirmDeleteRoom}
        title="Delete Room"
        message="Are you sure you want to delete this room? All students assigned to this room will also be removed. This action cannot be undone."
        isDeleting={isDeletingRoom}
      />
    </>
  );
}
