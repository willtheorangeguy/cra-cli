/**
 * Input validation utilities
 */

import { isValidDateString, getCurrentYear } from './dates.js';

/**
 * Validate a contribution/withdrawal amount
 */
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: 'Amount must be a number' };
  }
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  if (amount > 1000000000) {
    return { valid: false, error: 'Amount seems unreasonably large' };
  }
  // Check for more than 2 decimal places
  if (Math.round(amount * 100) !== amount * 100) {
    return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  return { valid: true };
}

/**
 * Validate a date string for a transaction
 */
export function validateTransactionDate(dateString: string): { valid: boolean; error?: string } {
  if (!isValidDateString(dateString)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }
  
  const year = parseInt(dateString.substring(0, 4), 10);
  const currentYear = getCurrentYear();
  
  if (year < 2009) {
    return { valid: false, error: 'Date cannot be before 2009 (TFSA program start)' };
  }
  
  if (year > currentYear) {
    return { valid: false, error: 'Date cannot be in the future' };
  }
  
  return { valid: true };
}

/**
 * Validate birth year
 */
export function validateBirthYear(year: number): { valid: boolean; error?: string } {
  const currentYear = getCurrentYear();
  
  if (typeof year !== 'number' || isNaN(year) || !Number.isInteger(year)) {
    return { valid: false, error: 'Birth year must be a whole number' };
  }
  
  if (year < 1900) {
    return { valid: false, error: 'Birth year seems too old' };
  }
  
  if (year > currentYear) {
    return { valid: false, error: 'Birth year cannot be in the future' };
  }
  
  return { valid: true };
}

/**
 * Validate FHSA opening date
 */
export function validateFHSAOpeningDate(dateString: string, birthYear: number): { valid: boolean; error?: string } {
  if (!isValidDateString(dateString)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }
  
  const year = parseInt(dateString.substring(0, 4), 10);
  const currentYear = getCurrentYear();
  
  if (year < 2023) {
    return { valid: false, error: 'FHSA program started in 2023' };
  }
  
  if (year > currentYear) {
    return { valid: false, error: 'Date cannot be in the future' };
  }
  
  // Check if person was at least 18
  const age = year - birthYear;
  if (age < 18) {
    return { valid: false, error: 'Must be at least 18 to open an FHSA' };
  }
  
  // Check if person was under 71
  if (age > 71) {
    return { valid: false, error: 'Cannot open FHSA after turning 71' };
  }
  
  return { valid: true };
}

/**
 * Parse and validate a currency string input
 */
export function parseCurrencyInput(input: string): number | null {
  // Remove currency symbols, commas, and whitespace
  const cleaned = input.replace(/[$,\s]/g, '');
  const amount = parseFloat(cleaned);
  
  if (isNaN(amount)) {
    return null;
  }
  
  // Round to 2 decimal places
  return Math.round(amount * 100) / 100;
}
