import React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(({ className, type, error, icon, suffix, ...props }, ref) => {
  return (
    <div className={`relative`}>
      {/* Icon */}
      {icon && (
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm`}>
          {icon}
        </div>
      )}
      
      {/* Input */}
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50`,
          icon && `pl-10`,
          suffix && `pr-10`,
          error && `border-red-500 focus:border-red-500 focus:ring-red-500/20`,
          className
        )}
        ref={ref}
        {...props}
      />
      
      {/* Suffix */}
      {suffix && (
        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm`}>
          {suffix}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <p className={`mt-1 text-xs text-red-500`}>
          {error}
        </p>
      )}
    </div>
  )
})
Input.displayName = `Input`

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className={`relative`}>
      <textarea
        className={cn(
          `flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none`,
          error && `border-red-500 focus:border-red-500 focus:ring-red-500/20`,
          className
        )}
        ref={ref}
        {...props}
      />
      
      {/* Error Message */}
      {error && (
        <p className={`mt-1 text-xs text-red-500`}>
          {error}
        </p>
      )}
    </div>
  )
})
Textarea.displayName = `Textarea`

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      `text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`,
      className
    )}
    {...props}
  />
))
Label.displayName = `Label`

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className={`relative`}>
      <select
        className={cn(
          `flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer`,
          error && `border-red-500 focus:border-red-500 focus:ring-red-500/20`,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      
      {/* Dropdown Arrow */}
      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none`}>
        <svg className={`w-4 h-4 text-gray-400`} fill={`none`} stroke={`currentColor`} viewBox={`0 0 24 24`}>
          <path strokeLinecap={`round`} strokeLinejoin={`round`} strokeWidth={2} d={`M19 9l-7 7-7-7`} />
        </svg>
      </div>
      
      {/* Error Message */}
      {error && (
        <p className={`mt-1 text-xs text-red-500`}>
          {error}
        </p>
      )}
    </div>
  )
})
Select.displayName = `Select`

export { Input, Textarea, Label, Select }