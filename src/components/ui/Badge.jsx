import React from 'react'
import { cn } from '../../lib/utils'
import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`,
  {
    variants: {
      variant: {
        default: `bg-primary-100 text-primary-800 border border-primary-200`,
        secondary: `bg-secondary-100 text-secondary-800 border border-secondary-200`,
        success: `bg-green-100 text-green-800 border border-green-200`,
        warning: `bg-amber-100 text-amber-800 border border-amber-200`,
        error: `bg-red-100 text-red-800 border border-red-200`,
        info: `bg-blue-100 text-blue-800 border border-blue-200`,
        gray: `bg-gray-100 text-gray-800 border border-gray-200`,
        outline: `border border-current bg-transparent text-gray-600`,
        gradient: `bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-none`
      },
      size: {
        sm: `text-xs px-2 py-0.5`,
        default: `text-xs px-2.5 py-0.5`,
        lg: `text-sm px-3 py-1`
      }
    },
    defaultVariants: {
      variant: `default`,
      size: `default`
    }
  }
)

const Badge = React.forwardRef(({ className, variant, size, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
Badge.displayName = `Badge`

// Status Badge Component with predefined status mappings
const StatusBadge = ({ status, ...props }) => {
  const statusMap = {
    'pending': { variant: 'warning', children: 'Pending' },
    'in-progress': { variant: 'info', children: 'In Progress' },
    'completed': { variant: 'success', children: 'Completed' },
    'success': { variant: 'success', children: 'Success' },
    'failed': { variant: 'error', children: 'Failed' },
    'error': { variant: 'error', children: 'Error' },
    'cancelled': { variant: 'gray', children: 'Cancelled' },
    'active': { variant: 'success', children: 'Active' },
    'inactive': { variant: 'gray', children: 'Inactive' },
    'draft': { variant: 'gray', children: 'Draft' },
    'published': { variant: 'success', children: 'Published' },
  }

  const config = statusMap[status?.toLowerCase()] || { variant: 'gray', children: status }
  
  return (
    <Badge variant={config.variant} {...props}>
      {config.children}
    </Badge>
  )
}

export { Badge, StatusBadge, badgeVariants }