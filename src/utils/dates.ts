/**
 * Date utility functions
 */

import { getYear, parseISO, isValid, format, startOfYear, endOfYear } from 'date-fns';

/**
 * Get the current year
 */
export function getCurrentYear(): number {
  return getYear(new Date());
}

/**
 * Get the year a person turns a specific age
 */
export function getYearTurningAge(birthYear: number, age: number): number {
  return birthYear + age;
}

/**
 * Check if a person was at least a certain age at start of a given year
 */
export function wasAgeAtStartOfYear(birthYear: number, year: number, minAge: number): boolean {
  // You reach the age during the year you turn that age
  // For TFSA, you accumulate room for any year in which you turn 18 or older
  return (year - birthYear) >= minAge;
}

/**
 * Parse a date string and return the year
 */
export function getYearFromDateString(dateString: string): number {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return getYear(date);
}

/**
 * Validate a date string is in ISO format (YYYY-MM-DD)
 */
export function isValidDateString(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  const date = parseISO(dateString);
  return isValid(date);
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Format a date string for display
 */
export function formatDateForDisplay(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return dateString;
  }
  return format(date, 'MMM d, yyyy');
}

/**
 * Check if a date is in a specific year
 */
export function isDateInYear(dateString: string, year: number): boolean {
  return getYearFromDateString(dateString) === year;
}

/**
 * Check if a date is before a specific year
 */
export function isDateBeforeYear(dateString: string, year: number): boolean {
  return getYearFromDateString(dateString) < year;
}

/**
 * Get the start of a year as ISO string
 */
export function getStartOfYearISO(year: number): string {
  return format(startOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');
}

/**
 * Get the end of a year as ISO string
 */
export function getEndOfYearISO(year: number): string {
  return format(endOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');
}
