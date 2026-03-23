/**
 * TFSA calculation tests
 */

import { describe, it, expect } from 'vitest';
import {
  getFirstEligibleYear,
  calculateAccumulatedRoom,
  calculateTotalContributions,
  calculateWithdrawalsInYear,
  calculateWithdrawalsRoomAdded,
  calculateContributionsInYear,
} from '../src/services/tfsa.js';
import { TFSA_ANNUAL_LIMITS } from '../src/utils/constants.js';

describe('TFSA Calculations', () => {
  describe('getFirstEligibleYear', () => {
    it('should return 2009 for someone born before 1991', () => {
      // Born 1980, turned 18 in 1998, but TFSA started in 2009
      expect(getFirstEligibleYear(1980)).toBe(2009);
    });

    it('should return 2009 for someone born in 1991 (turned 18 in 2009)', () => {
      expect(getFirstEligibleYear(1991)).toBe(2009);
    });

    it('should return year turning 18 for someone born after 1991', () => {
      // Born 2000, turns 18 in 2018
      expect(getFirstEligibleYear(2000)).toBe(2018);
    });

    it('should return future year for someone not yet 18', () => {
      // Born 2010, turns 18 in 2028
      expect(getFirstEligibleYear(2010)).toBe(2028);
    });
  });

  describe('calculateAccumulatedRoom', () => {
    it('should return 0 for someone not yet eligible', () => {
      // Born 2010, would turn 18 in 2028
      expect(calculateAccumulatedRoom(2010, 2025)).toBe(0);
    });

    it('should calculate correct room for someone eligible since 2009', () => {
      // Born 1980, eligible since 2009
      // Sum of all limits from 2009 to 2025
      const expected = Object.values(TFSA_ANNUAL_LIMITS).reduce((a, b) => a + b, 0);
      expect(calculateAccumulatedRoom(1980, 2025)).toBe(expected);
    });

    it('should calculate correct room for partial years', () => {
      // Born 2000, eligible since 2018
      // 2018-2022: 5500 + 6000 + 6000 + 6000 + 6000 = 29500
      // 2023: 6500
      // 2024-2025: 7000 + 7000 = 14000
      // Total: 5500 + 6000*4 + 6500 + 7000*2 = 5500 + 24000 + 6500 + 14000 = 50000
      const result = calculateAccumulatedRoom(2000, 2025);
      expect(result).toBe(5500 + 6000 + 6000 + 6000 + 6000 + 6500 + 7000 + 7000);
    });

    it('should handle single year eligibility', () => {
      // Born 2007, turns 18 in 2025
      expect(calculateAccumulatedRoom(2007, 2025)).toBe(7000);
    });
  });

  describe('calculateTotalContributions', () => {
    it('should return 0 for empty contributions', () => {
      expect(calculateTotalContributions([])).toBe(0);
    });

    it('should sum all contributions', () => {
      const contributions = [
        { id: '1', date: '2023-01-15', amount: 5000 },
        { id: '2', date: '2023-06-01', amount: 1500 },
        { id: '3', date: '2024-02-01', amount: 3000 },
      ];
      expect(calculateTotalContributions(contributions)).toBe(9500);
    });

    it('should filter contributions up to a specific year', () => {
      const contributions = [
        { id: '1', date: '2022-01-15', amount: 5000 },
        { id: '2', date: '2023-06-01', amount: 1500 },
        { id: '3', date: '2024-02-01', amount: 3000 },
      ];
      expect(calculateTotalContributions(contributions, 2023)).toBe(6500);
    });
  });

  describe('calculateWithdrawalsInYear', () => {
    it('should return 0 for empty withdrawals', () => {
      expect(calculateWithdrawalsInYear([], 2023)).toBe(0);
    });

    it('should sum withdrawals for a specific year', () => {
      const withdrawals = [
        { id: '1', date: '2023-03-01', amount: 2000 },
        { id: '2', date: '2023-09-15', amount: 1000 },
        { id: '3', date: '2024-01-10', amount: 500 },
      ];
      expect(calculateWithdrawalsInYear(withdrawals, 2023)).toBe(3000);
    });

    it('should return 0 for year with no withdrawals', () => {
      const withdrawals = [
        { id: '1', date: '2023-03-01', amount: 2000 },
      ];
      expect(calculateWithdrawalsInYear(withdrawals, 2024)).toBe(0);
    });
  });

  describe('calculateWithdrawalsRoomAdded', () => {
    it('should return 0 for empty withdrawals', () => {
      expect(calculateWithdrawalsRoomAdded([], 2025)).toBe(0);
    });

    it('should sum withdrawals from previous years only', () => {
      const withdrawals = [
        { id: '1', date: '2022-03-01', amount: 1000 },
        { id: '2', date: '2023-06-01', amount: 2000 },
        { id: '3', date: '2024-01-01', amount: 500 }, // Current year, not counted
      ];
      // For 2024, only 2022 and 2023 withdrawals add to room
      expect(calculateWithdrawalsRoomAdded(withdrawals, 2024)).toBe(3000);
    });

    it('should not include current year withdrawals', () => {
      const withdrawals = [
        { id: '1', date: '2024-06-01', amount: 5000 },
      ];
      expect(calculateWithdrawalsRoomAdded(withdrawals, 2024)).toBe(0);
    });
  });

  describe('calculateContributionsInYear', () => {
    it('should return 0 for empty contributions', () => {
      expect(calculateContributionsInYear([], 2023)).toBe(0);
    });

    it('should sum contributions for a specific year', () => {
      const contributions = [
        { id: '1', date: '2023-01-15', amount: 3000 },
        { id: '2', date: '2023-12-31', amount: 2000 },
        { id: '3', date: '2024-01-01', amount: 1000 },
      ];
      expect(calculateContributionsInYear(contributions, 2023)).toBe(5000);
    });
  });
});

describe('TFSA Room Scenarios', () => {
  it('should calculate room for new account holder with no activity', () => {
    // Born 1990, eligible since 2009, no contributions
    const accumulatedRoom = calculateAccumulatedRoom(1990, 2025);
    const totalLimits = Object.values(TFSA_ANNUAL_LIMITS).reduce((a, b) => a + b, 0);
    expect(accumulatedRoom).toBe(totalLimits);
  });

  it('should reduce room by contributions', () => {
    // Born 1990, contributed 50000 total
    const accumulatedRoom = calculateAccumulatedRoom(1990, 2025);
    const contributions = [{ id: '1', date: '2020-01-01', amount: 50000 }];
    const totalContributed = calculateTotalContributions(contributions);
    
    const currentRoom = accumulatedRoom - totalContributed;
    expect(currentRoom).toBe(accumulatedRoom - 50000);
  });

  it('should add back withdrawals from previous years', () => {
    // Scenario: Accumulated 95500, contributed 50000, withdrew 10000 in 2023
    // For 2024: Room = 95500 - 50000 + 10000 = 55500
    // (assuming born 1990, up to 2024)
    const accumulatedRoom = calculateAccumulatedRoom(1990, 2024);
    const contributions = [{ id: '1', date: '2020-01-01', amount: 50000 }];
    const withdrawals = [{ id: '2', date: '2023-06-01', amount: 10000 }];
    
    const totalContributed = calculateTotalContributions(contributions);
    const withdrawalRoomAdded = calculateWithdrawalsRoomAdded(withdrawals, 2024);
    
    const currentRoom = accumulatedRoom - totalContributed + withdrawalRoomAdded;
    expect(currentRoom).toBe(accumulatedRoom - 50000 + 10000);
  });
});
