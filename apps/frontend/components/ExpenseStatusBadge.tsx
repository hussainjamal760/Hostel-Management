import React from 'react';

interface ExpenseStatusBadgeProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const ExpenseStatusBadge: React.FC<ExpenseStatusBadgeProps> = ({ status }) => {
  const styles = {
    PENDING: {
      colors: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: 'schedule',
    },
    APPROVED: {
      colors: 'bg-green-100 text-green-700 border-green-200',
      icon: 'check_circle',
    },
    REJECTED: {
      colors: 'bg-error-container text-error border-error/20',
      icon: 'cancel',
    },
  };

  const config = styles[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.colors}`}>
      <span className="material-symbols-outlined text-[14px]">
        {config.icon}
      </span>
      {status}
    </span>
  );
};

export default ExpenseStatusBadge;
