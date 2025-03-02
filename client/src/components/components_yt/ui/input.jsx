import * as React from "react"
import { clsx } from "clsx"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={clsx("input", className)}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }