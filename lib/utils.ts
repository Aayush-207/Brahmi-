import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function toHindiNum(num: number | string): string {
  return String(num).split('').map(d => '०१२३४५६७८९'[parseInt(d)] || d).join('');
}

export function localizeDigits(value: string, language: string): string {
  const digitSets: Record<string, string> = {
    hi: '०१२३४५६७८९',
    kn: '೦೧೨೩೪೫೬೭೮೯',
    ta: '௦௧௨௩௪௫௬௭௮௯'
  }

  const digits = digitSets[language]
  if (!digits) return value

  return value.replace(/\d/g, (d) => digits[Number(d)] || d)
}
