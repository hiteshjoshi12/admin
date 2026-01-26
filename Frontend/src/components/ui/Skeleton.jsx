// src/components/ui/Skeleton.jsx
export function Skeleton({ className, ...props }) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`} 
      {...props} 
    />
  );
}