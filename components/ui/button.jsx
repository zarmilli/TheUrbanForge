"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button"

    const variants = {
      default:
        "bg-[#ff4b1f] text-white hover:bg-[#ff4b1f]/80 active:scale-[0.98] transition",
      outline:
        "border border-white/20 text-white hover:bg-white/10 active:scale-[0.98] transition",
      ghost:
        "text-gray-300 hover:bg-white/10 active:scale-[0.98] transition",
    }

    const sizes = {
      default: "px-4 py-2 text-sm rounded-xl font-medium",
      sm: "px-3 py-1.5 text-xs rounded-lg font-medium",
      lg: "px-5 py-2.5 text-base rounded-2xl font-semibold",
      icon: "p-2 rounded-full",
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
