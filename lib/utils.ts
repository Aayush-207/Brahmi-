import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function toHindiNum(num: number | string): string {
  return String(num).split('').map(d => '०१२३४५६७८९'[parseInt(d)] || d).join('');
}
