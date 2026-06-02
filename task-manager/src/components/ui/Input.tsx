import React, { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, type = 'text', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-xs w-full">
        {label && (
          <label className="font-label-md text-on-surface-variant ml-xs" htmlFor={id}>
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-md text-outline pointer-events-none select-none">
              {icon}
            </span>
          )}
          
          <input
            ref={ref}
            type={type}
            id={id}
            className={`w-full py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-150 outline-none placeholder:text-outline/60 text-on-surface ${
              icon ? 'pl-[44px]' : 'px-md'
            } ${error ? 'border-error focus:border-error focus:ring-error/10' : ''} ${className}`}
            {...props}
          />
        </div>

        {error && (
          <span className="text-error text-label-sm ml-xs animate-in fade-in duration-200">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'