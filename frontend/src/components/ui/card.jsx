/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

const cardVariants = cva("rounded-lg shadow-sm border transition-all", {
  variants: {
    variant: {
      default:
        "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800",
      outlined: "border border-slate-300 bg-transparent dark:border-slate-700",
      shadow: "shadow-lg border-none",
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-4 text-base",
      lg: "p-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const Card = forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
));

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
));

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, cardVariants };
