import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 dark:backdrop-blur-md transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
