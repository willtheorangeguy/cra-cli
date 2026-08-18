/**
 * TFSA contribution room calculation logic
 * Based on CRA rules: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account
 */

import type { UserData, RoomCalculation, FutureProjection, Transaction } from '../types/index.js';
import { 
  getTFSAAnnualLimit, 
  isTFSALimitEstimated,
  TFSA_START_YEAR, 
  TFSA_MINIMUM_AGE 
} from '../utils/constants.js';
import { 
  getCurrentYear, 
  getYearFromDateString, 
  wasAgeAtStartOfYear,
  isDateBeforeYear
} from '../utils/dates.js';

/**
 * Get the first year a person can accumulate TFSA room
 * This is the later of: 2009, or the year they turn 18
 */
export function getFirstEligibleYear(birthYear: number): number {
  const yearTurning18 = birthYear + TFSA_MINIMUM_AGE;
  return Math.max(TFSA_START_YEAR, yearTurning18);
}

/**
 * Calculate total accumulated TFSA room from eligible years
 * (sum of annual limits from first eligible year to current year)
 */
export function calculateAccumulatedRoom(birthYear: number, upToYear: number = getCurrentYear()): number {
  const firstYear = getFirstEligibleYear(birthYear);
  
  if (firstYear > upToYear) {
    return 0; // Not yet eligible
  }
  
  let total = 0;
  for (let year = firstYear; year <= upToYear; year++) {
    total += getTFSAAnnualLimit(year);
  }
  
  return total;
}

/**
 * Calculate total contributions made up to a specific year
 */
export function calculateTotalContributions(
  contributions: Transaction[],
  upToYear?: number
): number {
  const filterYear = upToYear ?? getCurrentYear();
  
  return contributions
    .filter(t => getYearFromDateString(t.date) <= filterYear)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total withdrawals made in a specific year
 */
export function calculateWithdrawalsInYear(
  withdrawals: Transaction[],
  year: number
): number {
  return withdrawals
    .filter(t => getYearFromDateString(t.date) === year)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total withdrawals from previous years (adds to room on Jan 1 of following year)
 * For current year calculation, this means withdrawals from all years before current year
 */
export function calculateWithdrawalsRoomAdded(
  withdrawals: Transaction[],
  currentYear: number = getCurrentYear()
): number {
  return withdrawals
    .filter(t => getYearFromDateString(t.date) < currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total withdrawals ever made
 */
export function calculateTotalWithdrawals(withdrawals: Transaction[]): number {
  return withdrawals.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate contributions made in a specific year
 */
export function calculateContributionsInYear(
  contributions: Transaction[],
  year: number
): number {
  return contributions
    .filter(t => getYearFromDateString(t.date) === year)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate current TFSA contribution room
 * 
 * Formula: 
 * Room = Accumulated Room (sum of annual limits from eligible year to now)
 *      - Total Contributions Ever Made
 *      + Withdrawals from Previous Years (added back on Jan 1)
 */
export function calculateTFSARoom(data: UserData): RoomCalculation {
  const currentYear = getCurrentYear();
  const { birthYear } = data.profile;
  const { contributions, withdrawals } = data.tfsa;
  
  // Check eligibility
  if (birthYear === 0) {
    return {
      currentRoom: 0,
      totalContributed: 0,
      totalWithdrawn: 0,
      accumulatedRoom: 0,
      withdrawalRoomAdded: 0,
    };
  }
  
  const accumulatedRoom = calculateAccumulatedRoom(birthYear, currentYear);
  const totalContributed = calculateTotalContributions(contributions);
  const totalWithdrawn = calculateTotalWithdrawals(withdrawals);
  const withdrawalRoomAdded = calculateWithdrawalsRoomAdded(withdrawals, currentYear);
  
  const currentRoom = accumulatedRoom - totalContributed + withdrawalRoomAdded;
  
  return {
    currentRoom: Math.max(0, currentRoom),
    totalContributed,
    totalWithdrawn,
    accumulatedRoom,
    withdrawalRoomAdded,
  };
}

/**
 * Project TFSA room for future years
 * Assumes no future contributions or withdrawals
 */
export function projectTFSARoom(
  data: UserData,
  yearsAhead: number = 5
): FutureProjection[] {
  const currentYear = getCurrentYear();
  const { birthYear } = data.profile;
  const { contributions, withdrawals } = data.tfsa;
  
  if (birthYear === 0) {
    return [];
  }
  
  const projections: FutureProjection[] = [];
  
  // Get current totals as baseline
  const totalContributed = calculateTotalContributions(contributions);
  const totalWithdrawn = calculateTotalWithdrawals(withdrawals);
  
  // Include current year withdrawals that will add to room next year
  const currentYearWithdrawals = calculateWithdrawalsInYear(withdrawals, currentYear);
  
  for (let i = 0; i <= yearsAhead; i++) {
    const year = currentYear + i;
    const accumulatedRoom = calculateAccumulatedRoom(birthYear, year);
    
    // For future years, previous year's withdrawals add to room
    // Current year (i=0): withdrawals from years before current year
    // Year+1 (i=1): also include current year withdrawals
    let withdrawalRoomAdded = calculateWithdrawalsRoomAdded(withdrawals, currentYear);
    if (i > 0) {
      withdrawalRoomAdded += currentYearWithdrawals;
    }
    
    const projectedRoom = accumulatedRoom - totalContributed + withdrawalRoomAdded;
    const annualLimit = getTFSAAnnualLimit(year);
    
    projections.push({
      year,
      projectedRoom: Math.max(0, projectedRoom),
      annualLimit,
      cumulativeLimit: accumulatedRoom,
      notes: i === 0 ? 'Current' : (isTFSALimitEstimated(year) ? 'Estimated limit' : undefined),
    });
  }
  
  return projections;
}

/**
 * Check if a contribution would exceed available room
 * Returns remaining room and whether there's an over-contribution
 */
export function checkTFSAContributionRoom(
  data: UserData,
  amount: number
): { hasRoom: boolean; currentRoom: number; overContribution: number } {
  const { currentRoom } = calculateTFSARoom(data);
  const overContribution = Math.max(0, amount - currentRoom);
  
  return {
    hasRoom: amount <= currentRoom,
    currentRoom,
    overContribution,
  };
}

/**
 * Get yearly breakdown of TFSA activity
 */
export function getTFSAYearlyBreakdown(data: UserData): Array<{
  year: number;
  annualLimit: number;
  contributions: number;
  withdrawals: number;
  roomChange: number;
}> {
  const currentYear = getCurrentYear();
  const firstYear = getFirstEligibleYear(data.profile.birthYear);
  const { contributions, withdrawals } = data.tfsa;
  
  if (data.profile.birthYear === 0 || firstYear > currentYear) {
    return [];
  }
  
  const breakdown = [];
  
  for (let year = firstYear; year <= currentYear; year++) {
    const annualLimit = getTFSAAnnualLimit(year);
    const yearContributions = calculateContributionsInYear(contributions, year);
    const yearWithdrawals = calculateWithdrawalsInYear(withdrawals, year);
    
    // Room change for the year:
    // + annual limit
    // - contributions
    // + withdrawals from previous year (handled in accumulated total)
    const roomChange = annualLimit - yearContributions;
    
    breakdown.push({
      year,
      annualLimit,
      contributions: yearContributions,
      withdrawals: yearWithdrawals,
      roomChange,
    });
  }
  
  return breakdown;
}
