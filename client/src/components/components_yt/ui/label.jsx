import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { clsx } from "clsx"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={clsx("label", className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }