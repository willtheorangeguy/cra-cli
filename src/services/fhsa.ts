/**
 * FHSA contribution room calculation logic
 * Based on CRA rules: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account
 */

import type { UserData, RoomCalculation, FutureProjection, Transaction } from '../types/index.js';
import { 
  FHSA_ANNUAL_LIMIT,
  FHSA_LIFETIME_LIMIT,
  FHSA_MAX_CARRY_FORWARD,
  FHSA_MAX_DURATION_YEARS,
  FHSA_MAX_AGE,
  FHSA_START_YEAR
} from '../utils/constants.js';
import { 
  getCurrentYear, 
  getYearFromDateString,
  isValidDateString
} from '../utils/dates.js';

/**
 * Check if FHSA is opened
 */
export function isFHSAOpened(data: UserData): boolean {
  return data.profile.fhsaOpenedDate !== null;
}

/**
 * Get the year FHSA was opened
 */
export function getFHSAOpenedYear(data: UserData): number | null {
  if (!data.profile.fhsaOpenedDate) {
    return null;
  }
  return getYearFromDateString(data.profile.fhsaOpenedDate);
}

/**
 * Calculate years since FHSA was opened (including opening year)
 */
export function getYearsSinceFHSAOpened(data: UserData, upToYear: number = getCurrentYear()): number {
  const openedYear = getFHSAOpenedYear(data);
  if (openedYear === null) {
    return 0;
  }
  return Math.max(0, upToYear - openedYear + 1);
}

/**
 * Check if FHSA has expired (15 years or age 71)
 */
export function isFHSAExpired(data: UserData, year: number = getCurrentYear()): boolean {
  const openedYear = getFHSAOpenedYear(data);
  if (openedYear === null) {
    return false;
  }
  
  // Check 15-year limit
  const yearsOpen = year - openedYear + 1;
  if (yearsOpen > FHSA_MAX_DURATION_YEARS) {
    return true;
  }
  
  // Check age 71 limit (must close by end of year turning 71)
  const { birthYear } = data.profile;
  const age = year - birthYear;
  if (age > FHSA_MAX_AGE) {
    return true;
  }
  
  return false;
}

/**
 * Get the year FHSA will expire
 */
export function getFHSAExpiryYear(data: UserData): number | null {
  const openedYear = getFHSAOpenedYear(data);
  if (openedYear === null) {
    return null;
  }
  
  // 15 years from opening
  const yearBy15Years = openedYear + FHSA_MAX_DURATION_YEARS - 1;
  
  // Year turning 71
  const yearTurning71 = data.profile.birthYear + FHSA_MAX_AGE;
  
  return Math.min(yearBy15Years, yearTurning71);
}

/**
 * Calculate total FHSA contributions
 */
export function calculateTotalFHSAContributions(contributions: Transaction[]): number {
  return contributions.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate FHSA contributions in a specific year
 */
export function calculateFHSAContributionsInYear(
  contributions: Transaction[],
  year: number
): number {
  return contributions
    .filter(t => getYearFromDateString(t.date) === year)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate FHSA contribution room
 * 
 * Rules:
 * - First year: $8,000 annual limit
 * - Subsequent years: $8,000 + min($8,000, unused room from previous year)
 * - Never exceed $40,000 lifetime limit
 */
export function calculateFHSARoom(data: UserData): RoomCalculation {
  const currentYear = getCurrentYear();
  const { contributions } = data.fhsa;
  
  // Check if FHSA is opened
  if (!isFHSAOpened(data)) {
    return {
      currentRoom: 0,
      totalContributed: 0,
      accumulatedRoom: 0,
      lifetimeLimit: FHSA_LIFETIME_LIMIT,
    };
  }
  
  // Check if expired
  if (isFHSAExpired(data)) {
    return {
      currentRoom: 0,
      totalContributed: calculateTotalFHSAContributions(contributions),
      accumulatedRoom: 0,
      lifetimeLimit: FHSA_LIFETIME_LIMIT,
    };
  }
  
  const openedYear = getFHSAOpenedYear(data)!;
  const totalContributed = calculateTotalFHSAContributions(contributions);
  
  // Calculate accumulated room year by year (respecting carry-forward rules)
  let accumulatedRoom = 0;
  
  for (let year = openedYear; year <= currentYear; year++) {
    // Unused room from previous year (capped at $8,000)
    const unusedFromPrevYear = year === openedYear 
      ? 0 
      : Math.min(FHSA_MAX_CARRY_FORWARD, accumulatedRoom - calculateContributionsUpToYear(contributions, year - 1));
    
    // This year's room: annual limit + carry-forward
    const yearRoom = FHSA_ANNUAL_LIMIT + (year === openedYear ? 0 : Math.max(0, unusedFromPrevYear));
    
    // Contributions this year
    const yearContributions = calculateFHSAContributionsInYear(contributions, year);
    
    // Running total
    accumulatedRoom = Math.min(
      FHSA_LIFETIME_LIMIT,
      accumulatedRoom + FHSA_ANNUAL_LIMIT
    );
  }
  
  // Current room = accumulated - contributed, capped by remaining lifetime limit
  const remainingLifetime = FHSA_LIFETIME_LIMIT - totalContributed;
  const currentRoom = Math.min(accumulatedRoom - totalContributed, remainingLifetime);
  
  return {
    currentRoom: Math.max(0, currentRoom),
    totalContributed,
    accumulatedRoom,
    lifetimeLimit: FHSA_LIFETIME_LIMIT,
  };
}

/**
 * Calculate contributions up to end of a specific year
 */
function calculateContributionsUpToYear(contributions: Transaction[], year: number): number {
  return contributions
    .filter(t => getYearFromDateString(t.date) <= year)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate FHSA room with proper carry-forward logic
 * This is a more detailed calculation showing yearly breakdown
 */
export function calculateFHSARoomDetailed(data: UserData): {
  currentRoom: number;
  totalContributed: number;
  lifetimeRemaining: number;
  yearlyBreakdown: Array<{
    year: number;
    openingRoom: number;
    annualAddition: number;
    carryForward: number;
    contributions: number;
    closingRoom: number;
  }>;
} {
  const currentYear = getCurrentYear();
  const { contributions } = data.fhsa;
  
  if (!isFHSAOpened(data)) {
    return {
      currentRoom: 0,
      totalContributed: 0,
      lifetimeRemaining: FHSA_LIFETIME_LIMIT,
      yearlyBreakdown: [],
    };
  }
  
  const openedYear = getFHSAOpenedYear(data)!;
  const totalContributed = calculateTotalFHSAContributions(contributions);
  const yearlyBreakdown = [];
  
  let previousClosingRoom = 0;
  
  for (let year = openedYear; year <= currentYear; year++) {
    if (isFHSAExpired(data, year)) {
      break;
    }
    
    const isFirstYear = year === openedYear;
    
    // Carry-forward from previous year (capped at $8,000)
    const carryForward = isFirstYear ? 0 : Math.min(FHSA_MAX_CARRY_FORWARD, previousClosingRoom);
    
    // Opening room (carry-forward only for first year is 0)
    const openingRoom = carryForward;
    
    // Annual addition
    const annualAddition = FHSA_ANNUAL_LIMIT;
    
    // Contributions this year
    const yearContributions = calculateFHSAContributionsInYear(contributions, year);
    
    // Closing room (cannot exceed what remains of lifetime limit)
    const contributedUpToThisYear = calculateContributionsUpToYear(contributions, year);
    const roomBeforeContributions = openingRoom + annualAddition;
    const closingRoom = Math.min(
      roomBeforeContributions - yearContributions,
      FHSA_LIFETIME_LIMIT - contributedUpToThisYear
    );
    
    yearlyBreakdown.push({
      year,
      openingRoom,
      annualAddition,
      carryForward,
      contributions: yearContributions,
      closingRoom: Math.max(0, closingRoom),
    });
    
    previousClosingRoom = Math.max(0, closingRoom);
  }
  
  const currentRoom = yearlyBreakdown.length > 0 
    ? yearlyBreakdown[yearlyBreakdown.length - 1].closingRoom 
    : 0;
  
  return {
    currentRoom: Math.max(0, currentRoom),
    totalContributed,
    lifetimeRemaining: Math.max(0, FHSA_LIFETIME_LIMIT - totalContributed),
    yearlyBreakdown,
  };
}

/**
 * Project FHSA room for future years
 * Assumes no future contributions
 */
export function projectFHSARoom(
  data: UserData,
  yearsAhead: number = 5
): FutureProjection[] {
  const currentYear = getCurrentYear();
  
  if (!isFHSAOpened(data)) {
    return [];
  }
  
  const projections: FutureProjection[] = [];
  const { contributions } = data.fhsa;
  const totalContributed = calculateTotalFHSAContributions(contributions);
  const expiryYear = getFHSAExpiryYear(data);
  
  // Get current detailed calculation as baseline
  const detailed = calculateFHSARoomDetailed(data);
  let previousRoom = detailed.currentRoom;
  
  for (let i = 0; i <= yearsAhead; i++) {
    const year = currentYear + i;
    
    // Check if account would be expired
    if (expiryYear && year > expiryYear) {
      projections.push({
        year,
        projectedRoom: 0,
        annualLimit: 0,
        cumulativeLimit: FHSA_LIFETIME_LIMIT,
        notes: 'Account expired',
      });
      continue;
    }
    
    // Check if lifetime limit reached
    const lifetimeRemaining = FHSA_LIFETIME_LIMIT - totalContributed;
    if (lifetimeRemaining <= 0) {
      projections.push({
        year,
        projectedRoom: 0,
        annualLimit: 0,
        cumulativeLimit: FHSA_LIFETIME_LIMIT,
        notes: 'Lifetime limit reached',
      });
      continue;
    }
    
    if (i === 0) {
      // Current year
      projections.push({
        year,
        projectedRoom: detailed.currentRoom,
        annualLimit: FHSA_ANNUAL_LIMIT,
        cumulativeLimit: FHSA_LIFETIME_LIMIT,
        notes: 'Current',
      });
      previousRoom = detailed.currentRoom;
    } else {
      // Future year: add annual limit + carry-forward (capped)
      const carryForward = Math.min(FHSA_MAX_CARRY_FORWARD, previousRoom);
      const newRoom = Math.min(
        carryForward + FHSA_ANNUAL_LIMIT,
        lifetimeRemaining
      );
      
      projections.push({
        year,
        projectedRoom: newRoom,
        annualLimit: FHSA_ANNUAL_LIMIT,
        cumulativeLimit: FHSA_LIFETIME_LIMIT,
        notes: carryForward < previousRoom ? `Carry-forward capped at $${FHSA_MAX_CARRY_FORWARD.toLocaleString()}` : undefined,
      });
      
      previousRoom = newRoom;
    }
  }
  
  return projections;
}

/**
 * Check if a contribution would exceed available room or lifetime limit
 */
export function checkFHSAContributionRoom(
  data: UserData,
  amount: number
): { 
  hasRoom: boolean; 
  currentRoom: number; 
  overContribution: number;
  lifetimeRemaining: number;
  exceedsLifetime: boolean;
} {
  const detailed = calculateFHSARoomDetailed(data);
  const overContribution = Math.max(0, amount - detailed.currentRoom);
  const exceedsLifetime = amount > detailed.lifetimeRemaining;
  
  return {
    hasRoom: amount <= detailed.currentRoom,
    currentRoom: detailed.currentRoom,
    overContribution,
    lifetimeRemaining: detailed.lifetimeRemaining,
    exceedsLifetime,
  };
}
