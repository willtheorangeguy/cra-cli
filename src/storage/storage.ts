/**
 * JSON file storage for user data
 */

import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { DATA_DIR_NAME, DATA_FILE_NAME } from '../utils/constants.js';
import type { UserData, Transaction } from '../types/index.js';

/**
 * Get the path to the data directory
 */
export function getDataDir(): string {
  return join(homedir(), DATA_DIR_NAME);
}

/**
 * Get the path to the data file
 */
export function getDataFilePath(): string {
  return join(getDataDir(), DATA_FILE_NAME);
}

/**
 * Ensure the data directory exists
 */
export function ensureDataDir(): void {
  const dataDir = getDataDir();
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Get default empty user data structure
 */
export function getDefaultUserData(): UserData {
  return {
    profile: {
      birthYear: 0,
      fhsaOpenedDate: null,
    },
    tfsa: {
      contributions: [],
      withdrawals: [],
    },
    fhsa: {
      contributions: [],
    },
  };
}

/**
 * Check if user data file exists
 */
export function dataFileExists(): boolean {
  return existsSync(getDataFilePath());
}

/**
 * Load user data from file
 */
export function loadUserData(): UserData {
  const filePath = getDataFilePath();
  
  if (!existsSync(filePath)) {
    return getDefaultUserData();
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as UserData;
    
    // Validate basic structure and provide defaults for missing fields
    return {
      profile: {
        birthYear: data.profile?.birthYear ?? 0,
        fhsaOpenedDate: data.profile?.fhsaOpenedDate ?? null,
      },
      tfsa: {
        contributions: data.tfsa?.contributions ?? [],
        withdrawals: data.tfsa?.withdrawals ?? [],
      },
      fhsa: {
        contributions: data.fhsa?.contributions ?? [],
      },
    };
  } catch (error) {
    console.error('Error reading data file, starting with empty data:', error);
    return getDefaultUserData();
  }
}

/**
 * Save user data to file
 */
export function saveUserData(data: UserData): void {
  ensureDataDir();
  const filePath = getDataFilePath();
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Check if profile is set up (birth year is configured)
 */
export function isProfileSetUp(data: UserData): boolean {
  return data.profile.birthYear > 0;
}

/**
 * Update user profile
 */
export function updateProfile(
  data: UserData,
  birthYear: number,
  fhsaOpenedDate: string | null
): UserData {
  return {
    ...data,
    profile: {
      birthYear,
      fhsaOpenedDate,
    },
  };
}

/**
 * Add a TFSA contribution
 */
export function addTFSAContribution(data: UserData, transaction: Transaction): UserData {
  return {
    ...data,
    tfsa: {
      ...data.tfsa,
      contributions: [...data.tfsa.contributions, transaction],
    },
  };
}

/**
 * Add a TFSA withdrawal
 */
export function addTFSAWithdrawal(data: UserData, transaction: Transaction): UserData {
  return {
    ...data,
    tfsa: {
      ...data.tfsa,
      withdrawals: [...data.tfsa.withdrawals, transaction],
    },
  };
}

/**
 * Add an FHSA contribution
 */
export function addFHSAContribution(data: UserData, transaction: Transaction): UserData {
  return {
    ...data,
    fhsa: {
      contributions: [...data.fhsa.contributions, transaction],
    },
  };
}

/**
 * Remove the last TFSA contribution
 */
export function removeLastTFSAContribution(data: UserData): { data: UserData; removed: Transaction | null } {
  if (data.tfsa.contributions.length === 0) {
    return { data, removed: null };
  }
  
  const contributions = [...data.tfsa.contributions];
  const removed = contributions.pop()!;
  
  return {
    data: {
      ...data,
      tfsa: {
        ...data.tfsa,
        contributions,
      },
    },
    removed,
  };
}

/**
 * Remove the last TFSA withdrawal
 */
export function removeLastTFSAWithdrawal(data: UserData): { data: UserData; removed: Transaction | null } {
  if (data.tfsa.withdrawals.length === 0) {
    return { data, removed: null };
  }
  
  const withdrawals = [...data.tfsa.withdrawals];
  const removed = withdrawals.pop()!;
  
  return {
    data: {
      ...data,
      tfsa: {
        ...data.tfsa,
        withdrawals,
      },
    },
    removed,
  };
}

/**
 * Remove the last FHSA contribution
 */
export function removeLastFHSAContribution(data: UserData): { data: UserData; removed: Transaction | null } {
  if (data.fhsa.contributions.length === 0) {
    return { data, removed: null };
  }
  
  const contributions = [...data.fhsa.contributions];
  const removed = contributions.pop()!;
  
  return {
    data: {
      ...data,
      fhsa: {
        contributions,
      },
    },
    removed,
  };
}

/**
 * Reset TFSA data
 */
export function resetTFSAData(data: UserData): UserData {
  return {
    ...data,
    tfsa: {
      contributions: [],
      withdrawals: [],
    },
  };
}

/**
 * Reset FHSA data
 */
export function resetFHSAData(data: UserData): UserData {
  return {
    ...data,
    fhsa: {
      contributions: [],
    },
  };
}

/**
 * Reset all user data
 */
export function resetAllData(): UserData {
  return getDefaultUserData();
}

/**
 * Get all transactions sorted by date (newest first)
 */
export function getAllTFSATransactionsSorted(data: UserData): Array<Transaction & { type: 'contribution' | 'withdrawal' }> {
  const contributions = data.tfsa.contributions.map(t => ({ ...t, type: 'contribution' as const }));
  const withdrawals = data.tfsa.withdrawals.map(t => ({ ...t, type: 'withdrawal' as const }));
  
  return [...contributions, ...withdrawals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get all FHSA transactions sorted by date (newest first)
 */
export function getAllFHSATransactionsSorted(data: UserData): Transaction[] {
  return [...data.fhsa.contributions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
