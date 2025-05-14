import { useTheme } from 'next-themes';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  height?: string | number;
  width?: string | number;
}

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  height, 
  width 
}: SkeletonProps) => {
  const { theme } = useTheme();
  
  const baseClass = `animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`;
  const variantClass = 
    variant === 'circular' ? 'rounded-full' : 
    variant === 'text' ? 'rounded h-4' : 
    'rounded-lg';
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={{
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined
      }}
    />
  );
};

export default Skeleton;