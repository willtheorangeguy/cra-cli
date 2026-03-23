/**
 * TypeScript interfaces for the CRA CLI application
 */

/** A single financial transaction (contribution or withdrawal) */
export interface Transaction {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  amount: number; // In dollars (positive value)
  note?: string;
}

/** User profile information */
export interface UserProfile {
  birthYear: number;
  fhsaOpenedDate: string | null; // ISO date string or null if not opened
}

/** TFSA account data */
export interface TFSAData {
  contributions: Transaction[];
  withdrawals: Transaction[];
}

/** FHSA account data */
export interface FHSAData {
  contributions: Transaction[];
}

/** Complete user data structure stored in JSON file */
export interface UserData {
  profile: UserProfile;
  tfsa: TFSAData;
  fhsa: FHSAData;
}

/** Room calculation result */
export interface RoomCalculation {
  currentRoom: number;
  totalContributed: number;
  totalWithdrawn?: number; // Only for TFSA
  accumulatedRoom: number;
  withdrawalRoomAdded?: number; // Only for TFSA - room from previous year withdrawals
  lifetimeLimit?: number; // Only for FHSA
  yearlyBreakdown?: YearlyRoom[];
}

/** Yearly room breakdown for projections */
export interface YearlyRoom {
  year: number;
  annualLimit: number;
  contributions: number;
  withdrawals?: number;
  roomAtYearEnd: number;
}

/** Future projection result */
export interface FutureProjection {
  year: number;
  projectedRoom: number;
  annualLimit: number;
  cumulativeLimit: number;
  notes?: string;
}

/** Account type enum */
export type AccountType = 'tfsa' | 'fhsa';

/** Menu action types */
export type MenuAction =
  | 'view_room'
  | 'add_contribution'
  | 'add_withdrawal'
  | 'view_history'
  | 'project_future'
  | 'export_csv'
  | 'undo_last'
  | 'reset_data'
  | 'back'
  | 'exit';

/** Main menu choices */
export type MainMenuChoice = 'tfsa' | 'fhsa' | 'settings' | 'exit';
