import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-800 text-text-50 disabled:bg-primary-300 hover:bg-primary-1000 ease-out duration-300",
        secondary:
          "text-text-1000 border border-primary-1000 hover:bg-primary-100 ease-out duration-300 disabled:bg-primary-300 disabled:border-primary-300 disabled:text-text-300",
        ghost: "hover:bg-primary-100 hover:text-primaryDark disabled:text-text-300",
        link: "text-link-500 underline-offset-4 hover:underline dark:text-slate-50",
        outline: "border border-secondary-100",
      },
      size: {
        primary: "h-10 px-4 py-3 paragraph1_regular rounded-full",
        sm: "h-8 rounded-md px-3 py-[10px] paragraph2_regular rounded-full",
        lg: "h-14 rounded-md px-8 py-[18px] paragraph1_bold rounded-full",
        icon: "h-10 w-10 rounded-full flex items-center justify-center",
        ghost: "h-10 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
