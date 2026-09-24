import {
  Wallet,
  Briefcase,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  FileText,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  Plane,
  MoreHorizontal,
} from 'lucide-react';
import { ALL_CATEGORIES } from '../data/seedData';

export const CATEGORY_META = {
  Salary: { icon: Wallet, tone: 'success' },
  Freelance: { icon: Briefcase, tone: 'accent' },
  Food: { icon: UtensilsCrossed, tone: 'warning' },
  Shopping: { icon: ShoppingBag, tone: 'primary' },
  Transport: { icon: Car, tone: 'neutral' },
  Bills: { icon: FileText, tone: 'danger' },
  Entertainment: { icon: Clapperboard, tone: 'accent' },
  Health: { icon: HeartPulse, tone: 'danger' },
  Education: { icon: GraduationCap, tone: 'primary' },
  Travel: { icon: Plane, tone: 'success' },
  Other: { icon: MoreHorizontal, tone: 'neutral' },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.Other;
}

const TONE_COLOR_VAR = {
  success: '--color-success',
  warning: '--color-warning',
  danger: '--color-danger',
  accent: '--color-accent',
  primary: '--color-primary',
  neutral: '--color-text-faint',
};

const TONE_SOFT_VAR = {
  success: '--color-success-soft',
  warning: '--color-warning-soft',
  danger: '--color-danger-soft',
  accent: '--color-accent-soft',
  primary: '--color-primary-soft',
  neutral: '--color-surface-alt',
};

export function categoryColorVar(category) {
  const tone = getCategoryMeta(category).tone;
  return `var(${TONE_COLOR_VAR[tone]})`;
}

export function categorySoftVar(category) {
  const tone = getCategoryMeta(category).tone;
  return `var(${TONE_SOFT_VAR[tone]})`;
}

// Deterministic chart-palette color (one of 8 hues) so every chart —
// dashboard donut, analytics breakdown — colors the same category the same way.
export function categoryChartColor(category) {
  const index = ALL_CATEGORIES.indexOf(category);
  const slot = index === -1 ? 7 : index % 8;
  return `var(--chart-${slot + 1})`;
}
