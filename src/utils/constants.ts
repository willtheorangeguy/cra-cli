/**
 * Constants for TFSA and FHSA contribution limits
 * Based on CRA rules: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account
 */

/** TFSA annual contribution limits by year */
export const TFSA_ANNUAL_LIMITS: Record<number, number> = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

/** TFSA program start year */
export const TFSA_START_YEAR = 2009;

/**
 * Latest year for which the CRA has announced a TFSA dollar limit.
 * Limits for years after this are estimates, not published figures.
 */
export const TFSA_LATEST_KNOWN_YEAR = Math.max(...Object.keys(TFSA_ANNUAL_LIMITS).map(Number));

/** Minimum age to accumulate TFSA room (must be 18 or older) */
export const TFSA_MINIMUM_AGE = 18;

/** FHSA annual contribution limit */
export const FHSA_ANNUAL_LIMIT = 8000;

/** FHSA lifetime contribution limit */
export const FHSA_LIFETIME_LIMIT = 40000;

/** FHSA maximum carry-forward per year */
export const FHSA_MAX_CARRY_FORWARD = 8000;

/** FHSA maximum account duration in years */
export const FHSA_MAX_DURATION_YEARS = 15;

/** FHSA maximum age (account must be closed by end of year turning 71) */
export const FHSA_MAX_AGE = 71;

/** FHSA program start year */
export const FHSA_START_YEAR = 2023;

/**
 * Whether the limit for a year is an estimate rather than a published CRA figure
 */
export function isTFSALimitEstimated(year: number): boolean {
  return year > TFSA_LATEST_KNOWN_YEAR;
}

/**
 * Get the TFSA annual limit for a given year
 * For future years not yet announced, estimates using the most recent known limit
 * (see isTFSALimitEstimated to tell announced figures from estimates)
 */
export function getTFSAAnnualLimit(year: number): number {
  if (year < TFSA_START_YEAR) {
    return 0;
  }
  
  const limit = TFSA_ANNUAL_LIMITS[year];
  if (limit !== undefined) {
    return limit;
  }
  
  return TFSA_ANNUAL_LIMITS[TFSA_LATEST_KNOWN_YEAR];
}

/**
 * Get all TFSA limits from start year to given year
 */
export function getTFSALimitsRange(startYear: number, endYear: number): Record<number, number> {
  const limits: Record<number, number> = {};
  for (let year = startYear; year <= endYear; year++) {
    limits[year] = getTFSAAnnualLimit(year);
  }
  return limits;
}

/** Data storage path relative to user's home directory */
export const DATA_DIR_NAME = '.cra-cli';
export const DATA_FILE_NAME = 'data.json';

/** Application metadata */
export const APP_NAME = 'CRA CLI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Track your TFSA and FHSA contributions';
