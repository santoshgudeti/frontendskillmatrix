import React from 'react'
import { cn } from '../../lib/utils'
import { cva } from 'class-variance-authority'

const cardVariants = cva(
  `rounded-2xl transition-all duration-300`,
  {
    variants: {
      variant: {
        default: `bg-white border border-gray-200/50 shadow-lg hover:shadow-xl`,
        glass: `bg-white/90 backdrop-blur-xl border border-white/20 shadow-glass`,
        neumorphic: `bg-gray-50 shadow-neumorphism`,
        gradient: `bg-card-gradient border border-gray-200/50 shadow-lg`,
        interactive: `bg-white border border-gray-200/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-primary-200 cursor-pointer`,
        outline: `border border-gray-300 bg-transparent`,
        ghost: `shadow-none border-none bg-transparent`
      },
      padding: {
        none: `p-0`,
        sm: `p-4`,
        default: `p-6`,
        lg: `p-8`,
        xl: `p-10`
      }
    },
    defaultVariants: {
      variant: `default`,
      padding: `default`
    }
  }
)

const Card = React.forwardRef(({ className, variant, padding, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding }), className)}
    {...props}
  >
    {children}
  </div>
))
Card.displayName = `Card`

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`flex flex-col space-y-1.5 p-6 pb-3`, className)}
    {...props}
  />
))
CardHeader.displayName = `CardHeader`

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(`text-2xl font-semibold leading-none tracking-tight`, className)}
    {...props}
  />
))
CardTitle.displayName = `CardTitle`

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(`text-sm text-gray-500`, className)}
    {...props}
  />
))
CardDescription.displayName = `CardDescription`

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(`p-6 pt-0`, className)} 
    {...props} 
  />
))
CardContent.displayName = `CardContent`

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`flex items-center p-6 pt-0`, className)}
    {...props}
  />
))
CardFooter.displayName = `CardFooter`

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }