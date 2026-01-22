'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: IconType;
  iconBg?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBg = 'bg-brand-primary dark:bg-dark-primary',
}) => {
  const changeColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-brand-text/60 dark:text-dark-text/60',
  };

  return (
    <div className="bg-white dark:bg-dark-card/50 rounded-2xl p-6 shadow-sm border border-brand-card/30 dark:border-dark-card/30 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-brand-text/60 dark:text-dark-text/60 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-brand-text dark:text-dark-text">
            {value}
          </p>
          {change && (
            <p className={`text-sm font-medium mt-2 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white dark:text-dark-bg" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
