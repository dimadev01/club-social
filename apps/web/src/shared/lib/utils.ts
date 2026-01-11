import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const tw = String.raw;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function labelMapToFilterOptions<T extends Record<string, string>>(
  labelMap: T,
) {
  return Object.entries(labelMap)
    .map(([value, label]) => ({ text: label, value }))
    .sort((a, b) => a.text.localeCompare(b.text));
}

export function labelMapToSelectOptions<T extends Record<string, string>>(
  labelMap: T,
) {
  return Object.entries(labelMap)
    .map(([value, label]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function noop() {
  /* empty */
}
