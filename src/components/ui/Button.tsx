import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body font-semibold text-body transition-colors duration-base rounded-[4px] min-w-[44px] min-h-[44px] focus-visible",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-red)] text-[var(--color-white)] hover:bg-[var(--color-red-dark)]",
        secondary: "bg-transparent border border-current hover:text-[var(--color-red)] hover:border-[var(--color-red)]",
      },
      size: {
        default: "px-6 py-3",
        icon: "p-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ variant, size, className, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
