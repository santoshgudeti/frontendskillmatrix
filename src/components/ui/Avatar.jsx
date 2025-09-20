import React from 'react'
import { cn } from '../../lib/utils'
import { cva } from 'class-variance-authority'

const avatarVariants = cva(
  `relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium select-none`,
  {
    variants: {
      size: {
        xs: `h-6 w-6 text-xs`,
        sm: `h-8 w-8 text-sm`,
        default: `h-10 w-10 text-sm`,
        lg: `h-12 w-12 text-base`,
        xl: `h-16 w-16 text-lg`,
        "2xl": `h-20 w-20 text-xl`,
        "3xl": `h-24 w-24 text-2xl`
      },
      variant: {
        default: `bg-gray-100 text-gray-600`,
        primary: `bg-primary-100 text-primary-700`,
        secondary: `bg-secondary-100 text-secondary-700`,
        success: `bg-green-100 text-green-700`,
        warning: `bg-amber-100 text-amber-700`,
        error: `bg-red-100 text-red-700`,
        gradient: `bg-gradient-to-br from-primary-500 to-secondary-500 text-white`
      }
    },
    defaultVariants: {
      size: `default`,
      variant: `default`
    }
  }
)

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt, 
  name, 
  fallback,
  size, 
  variant,
  status,
  onClick,
  ...props 
}, ref) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)
  
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return ''
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const initials = getInitials(name) || fallback || '?'
  const showImage = src && !imageError && imageLoaded
  
  return (
    <div
      ref={ref}
      className={cn(
        avatarVariants({ size, variant }),
        onClick && `cursor-pointer hover:opacity-80 transition-opacity`,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Image */}
      {src && (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(
            `h-full w-full object-cover transition-opacity duration-200`,
            imageLoaded ? `opacity-100` : `opacity-0`
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
      
      {/* Fallback */}
      {!showImage && (
        <span className={`leading-none`}>
          {initials}
        </span>
      )}
      
      {/* Status Indicator */}
      {status && (
        <span 
          className={cn(
            `absolute bottom-0 right-0 block rounded-full ring-2 ring-white`,
            size === "xs" && `h-1.5 w-1.5`,
            size === "sm" && `h-2 w-2`,
            size === "default" && `h-2.5 w-2.5`,
            size === "lg" && `h-3 w-3`,
            size === "xl" && `h-3.5 w-3.5`,
            size === "2xl" && `h-4 w-4`,
            size === "3xl" && `h-5 w-5`,
            status === "online" && `bg-green-400`,
            status === "offline" && `bg-gray-400`,
            status === "away" && `bg-yellow-400`,
            status === "busy" && `bg-red-400`
          )}
        />
      )}
      
      {/* Loading placeholder */}
      {src && !imageLoaded && !imageError && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded-full`} />
      )}
    </div>
  )
})
Avatar.displayName = `Avatar`

// Avatar Group Component
const AvatarGroup = ({ children, max = 3, size = `default`, className, ...props }) => {
  const avatars = React.Children.toArray(children)
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = Math.max(0, avatars.length - max)
  
  const getStackSpacing = () => {
    switch (size) {
      case "xs": return `-space-x-1`
      case "sm": return `-space-x-1.5`
      case "default": return `-space-x-2`
      case "lg": return `-space-x-2.5`
      case "xl": return `-space-x-3`
      case "2xl": return `-space-x-3.5`
      case "3xl": return `-space-x-4`
      default: return `-space-x-2`
    }
  }
  
  return (
    <div className={cn(`flex`, getStackSpacing(), className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <div 
          key={index} 
          className={`ring-2 ring-white rounded-full`} 
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.cloneElement(avatar, { size })}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <Avatar
          size={size}
          variant={`default`}
          fallback={`+${remainingCount}`}
          className={`ring-2 ring-white`}
          style={{ zIndex: 0 }}
        />
      )}
    </div>
  )
}

export { Avatar, AvatarGroup, avatarVariants }