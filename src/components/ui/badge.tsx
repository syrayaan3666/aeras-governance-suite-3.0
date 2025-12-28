import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/20 text-destructive border-destructive/30 animate-pulse",
        outline: "border-border text-foreground bg-transparent",
        // AERAS Risk variants
        critical: "border-red-500/30 bg-red-500/20 text-red-400",
        high: "border-orange-500/30 bg-orange-500/20 text-orange-400",
        medium: "border-amber-500/30 bg-amber-500/20 text-amber-400",
        low: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
        minimal: "border-cyan-500/30 bg-cyan-500/20 text-cyan-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
