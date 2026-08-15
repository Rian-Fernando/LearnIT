import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Class name composer. `twMerge` resolves conflicting Tailwind utilities so a
 * `className` prop passed by a caller reliably wins over a component default,
 * rather than depending on CSS source order.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
