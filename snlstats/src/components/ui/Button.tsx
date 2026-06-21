import React from 'react';
 
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
 
export function Button({
  variant = 'outline',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-sans font-semibold rounded-lg transition-all duration-base cursor-pointer active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral';
 
  const variantStyles = {
    primary:
      'bg-primary text-neutral border border-primary hover:bg-tertiary hover:border-tertiary hover:text-neutral',
    secondary:
      'bg-secondary text-primary border-2 border-primary hover:bg-primary hover:text-neutral',
    outline:
      'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-neutral hover:shadow-gold',
  };
 
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
 
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
