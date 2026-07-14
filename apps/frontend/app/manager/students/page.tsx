'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useGetStudentsQuery } from '@/lib/services/studentApi';
import { useRouter } from 'next/navigation';

import ChangeRoomModal from './ChangeRoomModal';
import StudentDetailsModal from '../rooms/[id]/StudentDetailsModal';

export default function StudentsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [feeStatus, setFeeStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [changeRoomModalOpen, setChangeRoomModalOpen] = useState(false);
  const [selectedStudentForMove, setSelectedStudentForMove] = useState<{
      id: string;
      name: string;
      currentRoom: any;
      currentBed: string;
  } | null>(null);
  
  const { data: studentsData, isLoading, refetch, isFetching } = useGetStudentsQuery({
     hostelId: user?.hostelId,
     search: search || undefined,
     feeStatus,
     page,
     limit: 20
  }, { skip: !user?.hostelId });

  const students = studentsData?.data || [];
  
  const totalStudents = studentsData?.pagination?.total || 0;
  
  const handleViewDetails = (studentId: string) => {
      setSelectedStudentId(studentId);
      setDetailsModalOpen(true);
  };

  const handleChangeRoomClick = (student: any) => {
      setSelectedStudentForMove({
          id: student._id,
          name: student.fullName,
          currentRoom: student.roomId,
          currentBed: student.bedNumber
      });
      setChangeRoomModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-secondary">group</span>
            Students
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-1">Manage all registered students and their details</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                    type="text" 
                    placeholder="Search by name, CNIC, or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface border border-outline-variant outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary transition-all shadow-sm"
                />
            </div>
            <button 
                onClick={() => refetch()}
                className={`p-3 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary hover:border-primary transition-colors shadow-sm flex items-center justify-center ${isFetching ? 'animate-spin text-primary border-primary' : ''}`}
                title="Refresh List"
            >
                <span className="material-symbols-outlined">refresh</span>
            </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
         {['ALL', 'PAID', 'DUE'].map((status) => {
             const isSelected = (status === 'ALL' && !feeStatus) || feeStatus === status;
             return (
                 <button
                    key={status}
                    onClick={() => setFeeStatus(status === 'ALL' ? undefined : status)}
                    className={`px-6 py-2.5 rounded-full text-label-md uppercase tracking-wider font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                        isSelected
                        ? 'bg-primary text-on-primary shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                    }`}
                 >
                    {status === 'ALL' && <span className="material-symbols-outlined text-[18px]">groups</span>}
                    {status === 'PAID' && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                    {status === 'DUE' && <span className="material-symbols-outlined text-[18px]">error</span>}
                    {status === 'ALL' ? 'All Students' : status === 'PAID' ? 'Fee Paid' : 'Fee Due'}
                 </button>
             );
         })}
      </div>

      {/* Main Table Card */}
      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        {isLoading ? (
            <div className="p-16 text-center flex flex-col items-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
                <p className="text-body-lg text-on-surface-variant font-medium">Loading students...</p>
            </div>
        ) : students.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-lowest border-b border-outline-variant">
                            <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Student Details</th>
                            <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Room Allocation</th>
                            <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Contact Info</th>
                            <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Fee Status</th>
                            <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Join Date</th>
                            <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                        {students.map((student) => (
                            <tr key={student._id} className="hover:bg-surface-container-lowest transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
                                            {student.fullName[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary text-body-lg group-hover:text-secondary transition-colors">{student.fullName}</p>
                                            <p className="text-body-sm text-on-surface-variant font-mono mt-0.5">{student.cnic}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <span className="font-bold text-on-surface flex items-center gap-1.5 bg-surface-container-highest/20 px-2.5 py-1 rounded-lg">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">meeting_room</span>
                                            Room {(student.roomId as any)?.roomNumber || 'N/A'}
                                        </span>
                                        <span className="text-label-sm uppercase tracking-wider font-bold text-primary bg-primary-container px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">bed</span>
                                            Bed {student.bedNumber}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-body-md text-on-surface font-medium flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">phone</span>
                                            {(student.userId as any)?.phone || 'N/A'}
                                        </div>
                                        <div className="text-body-sm text-on-surface-variant flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">mail</span>
                                            {(student.userId as any)?.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1.5 text-label-md uppercase tracking-wider font-bold rounded-xl flex items-center gap-1.5 w-fit ${
                                        student.feeStatus === 'PAID' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        student.feeStatus === 'DUE' ? 'bg-error-container text-error border border-error/20' :
                                        'bg-surface-container text-on-surface'
                                    }`}>
                                        <span className="material-symbols-outlined text-[16px]">
                                            {student.feeStatus === 'PAID' ? 'check_circle' : 'error'}
                                        </span>
                                        {student.feeStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-body-md text-on-surface-variant font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        {new Date(student.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button 
                                            onClick={() => handleChangeRoomClick(student)}
                                            className="px-4 py-2 text-label-md uppercase tracking-wider font-bold border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-xl transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                                            Change Room
                                        </button>
                                        <button 
                                            onClick={() => handleViewDetails(student._id)}
                                            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-full transition-all"
                                            title="View Details"
                                        >
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-16 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[40px]">person_off</span>
                </div>
                <h3 className="text-display-sm text-primary mb-2">No Students Found</h3>
                <p className="text-body-lg text-on-surface-variant max-w-md">
                    {search ? 'We couldn\'t find any students matching your search criteria.' : 'There are no students added yet. Start by assigning students to rooms from the Room Management page.'}
                </p>
                {!search && (
                    <button 
                        onClick={() => router.push('/manager/rooms')}
                        className="mt-8 px-8 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined">hotel</span>
                        Go to Rooms
                    </button>
                )}
            </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (studentsData?.pagination?.total || 0) > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-2xl shadow-sm border border-outline-variant">
              <div className="text-body-sm text-on-surface-variant text-center sm:text-left">
                  Showing <span className="font-bold text-primary">{(page - 1) * 20 + 1}</span> to <span className="font-bold text-primary">{Math.min(page * 20, studentsData?.pagination?.total || 0)}</span> of <span className="font-bold text-primary">{studentsData?.pagination?.total}</span> students
              </div>
              
              <div className="flex items-center gap-2">
                  <button
                      onClick={() => setPage(page - 1)}
                      disabled={!studentsData?.pagination?.hasPrev}
                      className="px-4 py-2 text-label-md font-bold uppercase tracking-wider rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      Prev
                  </button>
                  <span className="hidden sm:flex items-center justify-center min-w-[40px] h-10 px-4 text-label-md font-bold bg-primary-container text-primary rounded-xl">
                      {page} / {studentsData?.pagination?.totalPages}
                  </span>
                  <button
                      onClick={() => setPage(page + 1)}
                      disabled={!studentsData?.pagination?.hasNext}
                      className="px-4 py-2 text-label-md font-bold uppercase tracking-wider rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                      Next
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
              </div>
          </div>
      )}
      
      {detailsModalOpen && (
          <StudentDetailsModal 
            open={detailsModalOpen} 
            setOpen={setDetailsModalOpen} 
            studentId={selectedStudentId}
            onSuccess={() => refetch()}
          />
      )}

      {changeRoomModalOpen && selectedStudentForMove && (
          <ChangeRoomModal 
              open={changeRoomModalOpen}
              setOpen={setChangeRoomModalOpen}
              studentId={selectedStudentForMove.id}
              studentName={selectedStudentForMove.name}
              currentRoom={selectedStudentForMove.currentRoom}
              currentBed={selectedStudentForMove.currentBed}
              onSuccess={() => refetch()}
          />
      )}
    </div>
  );
}
