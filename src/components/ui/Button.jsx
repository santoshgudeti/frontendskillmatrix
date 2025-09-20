import React from 'react'
import { cn } from '../../lib/utils'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group`,
  {
    variants: {
      variant: {
        default: `bg-primary-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`,
        secondary: `bg-secondary-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`,
        success: `bg-success-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`,
        destructive: `bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`,
        outline: `border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98]`,
        ghost: `text-gray-600 hover:bg-gray-100 hover:text-gray-900`,
        link: `text-primary-600 underline-offset-4 hover:underline`,
        glass: `bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20`,
        neumorphic: `bg-gray-50 shadow-neumorphism hover:shadow-neumorphism-inset text-gray-700`
      },
      size: {
        default: `h-10 px-4 py-2`,
        sm: `h-8 px-3 text-xs`,
        lg: `h-12 px-8 text-base`,
        xl: `h-14 px-10 text-lg`,
        icon: `h-10 w-10`,
        iconSm: `h-8 w-8`,
        iconLg: `h-12 w-12`
      },
    },
    defaultVariants: {
      variant: `default`,
      size: `default`,
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, loading, children, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Ripple Effect */}
      <span className={`absolute inset-0 rounded-lg bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150`} />
      
      {/* Loading Spinner */}
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin`} />
        </div>
      )}
      
      {/* Content */}
      <span className={cn(`flex items-center gap-2`, loading && `opacity-0`)}>
        {children}
      </span>
    </button>
  )
})

Button.displayName = `Button`

export { Button, buttonVariants }