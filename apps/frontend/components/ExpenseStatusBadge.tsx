import React from 'react';

interface ExpenseStatusBadgeProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const ExpenseStatusBadge: React.FC<ExpenseStatusBadgeProps> = ({ status }) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export default ExpenseStatusBadge;
