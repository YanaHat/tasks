import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'error' | 'secondary'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  isLoading,
  disabled,
  type = 'button',
  ...props
}) => {
  // Базовые стили для всех кнопок (динамика, скругления, шрифты из ТЗ)
  const baseStyles = 'flex items-center justify-center gap-sm px-md py-sm font-label-md text-label-md rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  
  // Стили для конкретных вариантов из твоей палитры Tailwind
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-md',
    outline: 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-high',
    error: 'border border-error text-error hover:bg-error-container/20',
    secondary: 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}