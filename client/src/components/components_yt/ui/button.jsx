import * as React from "react"
import { clsx } from "clsx"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false, 
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  
  const buttonClasses = clsx(
    'btn',
    `btn-${variant}`,
    {
      'btn-sm': size === 'sm',
      'btn-lg': size === 'lg',
      'btn-icon': size === 'icon'
    },
    className
  )
  
  return (
    <Comp
      className={buttonClasses}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button }