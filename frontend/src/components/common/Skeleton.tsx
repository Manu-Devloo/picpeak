import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-neutral-200';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

// Skeleton group for consistent loading states
interface SkeletonGroupProps {
  count?: number;
  className?: string;
  children?: React.ReactNode;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 1,
  className,
  children
}) => {
  if (children) {
    return <div className={cn('space-y-3', className)}>{children}</div>;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} height={20} />
      ))}
    </div>
  );
};

// Common skeleton patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
    <Skeleton height={24} width="60%" className="mb-4" />
    <SkeletonGroup count={3} />
    <div className="flex gap-3 mt-6">
      <Skeleton width={100} height={36} />
      <Skeleton width={100} height={36} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className 
}) => (
  <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
    <div className="border-b border-neutral-200 p-4">
      <div className="flex gap-4">
        <Skeleton width="30%" height={20} />
        <Skeleton width="25%" height={20} />
        <Skeleton width="20%" height={20} />
        <Skeleton width="25%" height={20} />
      </div>
    </div>
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4">
          <div className="flex gap-4">
            <Skeleton width="30%" height={16} />
            <Skeleton width="25%" height={16} />
            <Skeleton width="20%" height={16} />
            <Skeleton width="25%" height={16} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonGalleryGrid: React.FC<{ count?: number; className?: string }> = ({ 
  count = 12, 
  className 
}) => (
  <div className={cn('gallery-grid', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="aspect-square w-full"
      />
    ))}
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 5, 
  className 
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton height={20} width="70%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
    ))}
  </div>
);