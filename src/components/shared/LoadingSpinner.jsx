import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <p className="text-base-content/70 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;