import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dark" | "light";
}

export function Card({ variant = "dark", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[4px] p-6",
        variant === "dark" && "bg-[var(--color-gray-950)] border border-[var(--color-gray-700)]",
        variant === "light" && "bg-[var(--color-white)] text-[var(--color-black)] shadow-[0_8px_24px_rgba(10,10,10,0.08)]",
        className
      )}
      {...props}
    />
  );
}
