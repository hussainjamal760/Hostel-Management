'use client';

import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetMeQuery } from '@/lib/services/userApi';
import { HiOutlineUser, HiOutlineHome, HiOutlineAcademicCap, HiOutlineCash, HiOutlinePhone, HiOutlineShieldExclamation, HiOutlineInformationCircle } from 'react-icons/hi';

export default function StudentProfilePage() {
  const { data: studentResponse, isLoading: isLoadingStudent, error: studentError, isError: isStudentError } = useGetStudentMeQuery();
  
  const { data: userResponse, isLoading: isLoadingUser } = useGetMeQuery();
  
  const student = studentResponse?.data;
  const user = userResponse?.data;

  const isLoading = isLoadingStudent || isLoadingUser;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900 dark:text-gray-100 break-words">
        {value || <span className="text-gray-400 text-sm italic">Not provided</span>}
      </p>
    </div>
  );

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );

  if (!student && user) {
      return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">My Profile</h1>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                    Applicant / Guest
                </span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <HiOutlineInformationCircle className="text-blue-500 mt-0.5 shrink-0" size={24} />
                <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-200">Admission Pending</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        You have not been assigned a room yet. Once your admission is finalized by the manager, your full resident profile will appear here.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Personal Information" icon={HiOutlineUser}>
                    <DetailItem label="Full Name" value={user.name} />
                    <DetailItem label="Email" value={user.email} />
                    <DetailItem label="Phone" value={user.phone} />
                    <DetailItem label="Account Type" value={user.role} />
                </Section>
            </div>
        </div>
      );
  }

  if (!student) return null;

  return (
    <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">My Profile</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                student.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                {student.isActive ? 'Active Resident' : 'Inactive'}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Section title="Personal Information" icon={HiOutlineUser}>
                <DetailItem label="Full Name" value={student.fullName} />
                <DetailItem label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
                <DetailItem label="Gender" value={student.gender} />
                <DetailItem label="Blood Group" value={student.bloodGroup} />
                <DetailItem label="CNIC" value={student.cnic} />
            </Section>

            <Section title="Contact Details" icon={HiOutlinePhone}>
                <DetailItem label="Email" value={(student.userId as any)?.email || user?.email} />
                <DetailItem label="Phone" value={(student.userId as any)?.phone || user?.phone} />
                <DetailItem label="Permanent Address" value={student.permanentAddress} />
            </Section>

            <Section title="Accommodation" icon={HiOutlineHome}>
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Room Number" value={(student.roomId as any)?.roomNumber || 'N/A'} />
                    <DetailItem label="Bed Number" value={student.bedNumber} />
                </div>
                <DetailItem label="Room Type" value={(student.roomId as any)?.roomType || 'N/A'} />
                <DetailItem label="Join Date" value={new Date(student.joinDate).toLocaleDateString()} />
                <DetailItem label="Agreement Date" value={new Date(student.agreementDate).toLocaleDateString()} />
            </Section>

            <Section title="Guardian Info" icon={HiOutlineShieldExclamation}>
                <DetailItem label="Father's Name" value={student.fatherName} />
                <DetailItem label="Father's Phone" value={student.fatherPhone} />
                <DetailItem label="Father's CNIC" value={student.fatherCnic} />
            </Section>

            <Section title="Emergency Contact" icon={HiOutlineShieldExclamation}>
                <DetailItem label="Name" value={student.emergencyContact?.name} />
                <DetailItem label="Relation" value={student.emergencyContact?.relation} />
                <DetailItem label="Phone" value={student.emergencyContact?.phone} />
            </Section>

            <Section title="Academic & Financial" icon={HiOutlineAcademicCap}>
                <DetailItem label="Institution" value={student.institution} />
                <DetailItem label="Course/Degree" value={student.course} />
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Monthly Fee" value={`${student.monthlyFee}`} />
                        <DetailItem label="Security Deposit" value={`${student.securityDeposit}`} />
                    </div>
                </div>
            </Section>
        </div>
    </div>
  );
}
