"use client"

import * as React from "react"
import * as DrawerPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const Drawer = DrawerPrimitive.Root
export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerClose = DrawerPrimitive.Close

// ✅ Drawer Content (main container)
export function DrawerContent({ className, children, ...props }) {
  return (
    <DrawerPrimitive.Portal>
      {/* overlay */}
      <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]" />
      {/* drawer box */}
      <DrawerPrimitive.Content
        {...props}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[10001] bg-[#121212] text-white rounded-t-2xl shadow-lg animate-slideUp max-h-[85vh] flex flex-col",
          className
        )}
      >
        {children}
        <DrawerPrimitive.Close asChild>
          <button className="absolute top-3 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  )
}

// ✅ Drawer Header
export function DrawerHeader({ children, className }) {
  return (
    <div className={cn("p-4 pb-2 flex flex-col space-y-1.5 text-left", className)}>
      {children}
    </div>
  )
}

// ✅ Drawer Title
export function DrawerTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

// ✅ Drawer Description
export function DrawerDescription({ children }) {
  return <p className="text-sm text-gray-400">{children}</p>
}

// ✅ Drawer Body (scrollable area for cart items)
export function DrawerBody({ children, className }) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto no-scrollbar px-4",
        className
      )}
    >
      {children}
    </div>
  )
}

// ✅ Drawer Footer (fixed bottom section)
export function DrawerFooter({ children, className }) {
  return (
    <div
      className={cn(
        "border-t border-gray-800 p-4 sticky bottom-0 bg-[#121212]",
        className
      )}
    >
      {children}
    </div>
  )
}

// ✅ Drawer Skeleton (loading state)
export function DrawerSkeleton() {
  return (
    <div className="space-y-4 px-4 py-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-[80px] w-full bg-[#1e1e1e] rounded-xl animate-pulse"
        />
      ))}
    </div>
  )
}

// ✅ Hide scrollbar utility
const style = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`
if (typeof window !== "undefined") {
  const existing = document.getElementById("no-scrollbar-style")
  if (!existing) {
    const el = document.createElement("style")
    el.id = "no-scrollbar-style"
    el.innerHTML = style
    document.head.appendChild(el)
  }
}
