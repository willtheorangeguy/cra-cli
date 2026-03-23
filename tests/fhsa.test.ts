/**
 * FHSA calculation tests
 */

import { describe, it, expect } from 'vitest';
import {
  isFHSAOpened,
  getFHSAOpenedYear,
  getYearsSinceFHSAOpened,
  isFHSAExpired,
  getFHSAExpiryYear,
  calculateTotalFHSAContributions,
  calculateFHSAContributionsInYear,
  calculateFHSARoomDetailed,
} from '../src/services/fhsa.js';
import type { UserData } from '../src/types/index.js';
import {
  FHSA_ANNUAL_LIMIT,
  FHSA_LIFETIME_LIMIT,
  FHSA_MAX_CARRY_FORWARD,
  FHSA_MAX_DURATION_YEARS,
} from '../src/utils/constants.js';

// Helper to create test user data
function createTestData(overrides: Partial<UserData> = {}): UserData {
  return {
    profile: {
      birthYear: 1990,
      fhsaOpenedDate: null,
      ...overrides.profile,
    },
    tfsa: {
      contributions: [],
      withdrawals: [],
      ...overrides.tfsa,
    },
    fhsa: {
      contributions: [],
      ...overrides.fhsa,
    },
  };
}

describe('FHSA Basic Functions', () => {
  describe('isFHSAOpened', () => {
    it('should return false if FHSA not opened', () => {
      const data = createTestData();
      expect(isFHSAOpened(data)).toBe(false);
    });

    it('should return true if FHSA is opened', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-04-01' },
      });
      expect(isFHSAOpened(data)).toBe(true);
    });
  });

  describe('getFHSAOpenedYear', () => {
    it('should return null if not opened', () => {
      const data = createTestData();
      expect(getFHSAOpenedYear(data)).toBeNull();
    });

    it('should return the year opened', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-04-01' },
      });
      expect(getFHSAOpenedYear(data)).toBe(2023);
    });
  });

  describe('getYearsSinceFHSAOpened', () => {
    it('should return 0 if not opened', () => {
      const data = createTestData();
      expect(getYearsSinceFHSAOpened(data, 2025)).toBe(0);
    });

    it('should return correct years including opening year', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-04-01' },
      });
      // 2023, 2024, 2025 = 3 years
      expect(getYearsSinceFHSAOpened(data, 2025)).toBe(3);
    });

    it('should return 1 for same year', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2025-01-01' },
      });
      expect(getYearsSinceFHSAOpened(data, 2025)).toBe(1);
    });
  });
});

describe('FHSA Expiry', () => {
  describe('isFHSAExpired', () => {
    it('should not be expired in first year', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-04-01' },
      });
      expect(isFHSAExpired(data, 2023)).toBe(false);
    });

    it('should expire after 15 years', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-04-01' },
      });
      // Opened 2023, expires end of 2037 (15 years)
      expect(isFHSAExpired(data, 2037)).toBe(false);
      expect(isFHSAExpired(data, 2038)).toBe(true);
    });

    it('should expire at age 71', () => {
      const data = createTestData({
        profile: { birthYear: 1960, fhsaOpenedDate: '2023-04-01' },
      });
      // Born 1960, turns 71 in 2031
      expect(isFHSAExpired(data, 2031)).toBe(false);
      expect(isFHSAExpired(data, 2032)).toBe(true);
    });

    it('should use earlier of 15 years or age 71', () => {
      // Someone who opens at age 60
      const data = createTestData({
        profile: { birthYear: 1963, fhsaOpenedDate: '2023-04-01' },
      });
      // Born 1963, turns 71 in 2034
      // 15 years from 2023 = 2037
      // Should expire in 2034 (age 71 comes first)
      expect(getFHSAExpiryYear(data)).toBe(2034);
    });
  });

  describe('getFHSAExpiryYear', () => {
    it('should return null if not opened', () => {
      const data = createTestData();
      expect(getFHSAExpiryYear(data)).toBeNull();
    });

    it('should return expiry based on 15-year rule', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-04-01' },
      });
      // Opened 2023, 15 years = expires 2037
      expect(getFHSAExpiryYear(data)).toBe(2037);
    });
  });
});

describe('FHSA Contributions', () => {
  describe('calculateTotalFHSAContributions', () => {
    it('should return 0 for empty contributions', () => {
      expect(calculateTotalFHSAContributions([])).toBe(0);
    });

    it('should sum all contributions', () => {
      const contributions = [
        { id: '1', date: '2023-06-01', amount: 5000 },
        { id: '2', date: '2024-01-15', amount: 8000 },
      ];
      expect(calculateTotalFHSAContributions(contributions)).toBe(13000);
    });
  });

  describe('calculateFHSAContributionsInYear', () => {
    it('should return contributions for specific year', () => {
      const contributions = [
        { id: '1', date: '2023-06-01', amount: 5000 },
        { id: '2', date: '2023-12-01', amount: 3000 },
        { id: '3', date: '2024-01-15', amount: 8000 },
      ];
      expect(calculateFHSAContributionsInYear(contributions, 2023)).toBe(8000);
      expect(calculateFHSAContributionsInYear(contributions, 2024)).toBe(8000);
    });
  });
});

describe('FHSA Room Calculations', () => {
  describe('calculateFHSARoomDetailed', () => {
    it('should return 0 room if not opened', () => {
      const data = createTestData();
      const result = calculateFHSARoomDetailed(data);
      
      expect(result.currentRoom).toBe(0);
      expect(result.totalContributed).toBe(0);
      expect(result.lifetimeRemaining).toBe(FHSA_LIFETIME_LIMIT);
    });

    it('should have 8000 room in first year with no contributions', () => {
      // Use current year to ensure we're testing first year scenario
      const currentYear = new Date().getFullYear();
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: `${currentYear}-01-01` },
      });
      const result = calculateFHSARoomDetailed(data);
      
      // First year: 8000 room
      expect(result.currentRoom).toBe(FHSA_ANNUAL_LIMIT);
    });

    it('should calculate room with contributions', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-01-01' },
        fhsa: {
          contributions: [
            { id: '1', date: '2023-06-01', amount: 5000 },
          ],
        },
      });
      
      // Year 1 (2023): 8000 - 5000 = 3000 remaining
      // Year 2 (2024): 3000 carry-forward + 8000 = 11000
      // Year 3 (2025): If no contributions in 2024, max carry-forward 8000 + 8000 = 16000
      // But we need to check what year we're in for the test
      const result = calculateFHSARoomDetailed(data);
      
      expect(result.totalContributed).toBe(5000);
      expect(result.lifetimeRemaining).toBe(35000);
    });

    it('should respect carry-forward cap of 8000', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-01-01' },
        fhsa: {
          contributions: [], // No contributions - max unused room
        },
      });
      
      const result = calculateFHSARoomDetailed(data);
      
      // Even with years of no contributions, max room is limited by:
      // Year 1: 8000
      // Year 2: 8000 (carry-forward, capped) + 8000 = 16000
      // Year 3: 8000 (carry-forward, capped) + 8000 = 16000
      // Room never exceeds 16000 per year, and lifetime is 40000
      expect(result.currentRoom).toBeLessThanOrEqual(16000);
    });

    it('should not exceed lifetime limit', () => {
      const data = createTestData({
        profile: { birthYear: 1990, fhsaOpenedDate: '2023-01-01' },
        fhsa: {
          contributions: [
            { id: '1', date: '2023-06-01', amount: 40000 },
          ],
        },
      });
      
      const result = calculateFHSARoomDetailed(data);
      
      expect(result.currentRoom).toBe(0);
      expect(result.lifetimeRemaining).toBe(0);
    });
  });
});

describe('FHSA Constants', () => {
  it('should have correct annual limit', () => {
    expect(FHSA_ANNUAL_LIMIT).toBe(8000);
  });

  it('should have correct lifetime limit', () => {
    expect(FHSA_LIFETIME_LIMIT).toBe(40000);
  });

  it('should have correct carry-forward cap', () => {
    expect(FHSA_MAX_CARRY_FORWARD).toBe(8000);
  });

  it('should have correct duration limit', () => {
    expect(FHSA_MAX_DURATION_YEARS).toBe(15);
  });
});
