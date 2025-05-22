"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// Simplified Select component that doesn't rely on @radix-ui/react-select
export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  disabled?: boolean
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, disabled }, ref) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    return (
      <div ref={containerRef} className="relative">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === SelectTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: () => setOpen(!open),
              disabled
            })
          }
          if (React.isValidElement(child) && child.type === SelectContent) {
            return open ? React.cloneElement(child as React.ReactElement<any>, {
              value,
              onValueChange: (val: string) => {
                onValueChange?.(val)
                setOpen(false)
              }
            }) : null
          }
          return child
        })}
      </div>
    )
  }
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    className={cn("w-full justify-between", className)}
    {...props}
  >
    {children}
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </Button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ children, placeholder }: { children?: React.ReactNode, placeholder?: string }) => {
  return <span>{children || placeholder}</span>
}
SelectValue.displayName = "SelectValue"

interface SelectContentProps {
  children?: React.ReactNode
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, value, onValueChange }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md",
          className
        )}
      >
        <div className="p-1 max-h-60 overflow-auto">
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return React.cloneElement(child as React.ReactElement<any>, {
                isSelected: child.props.value === value,
                onSelect: () => onValueChange?.(child.props.value)
              })
            }
            return child
          })}
        </div>
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  isSelected?: boolean
  onSelect?: () => void
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, isSelected, onSelect, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={onSelect}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
