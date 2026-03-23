/**
 * CSV export functionality
 */

import { writeFileSync } from 'fs';
import type { UserData, Transaction } from '../types/index.js';
import { formatDateForDisplay } from '../utils/dates.js';
import { getAllTFSATransactionsSorted, getAllFHSATransactionsSorted } from '../storage/storage.js';

/**
 * Format a number as currency string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Export TFSA transactions to CSV
 */
export function exportTFSAToCSV(data: UserData, filePath: string): void {
  const transactions = getAllTFSATransactionsSorted(data);
  
  const headers = ['Date', 'Type', 'Amount', 'Note'];
  const rows = transactions.map(t => [
    t.date,
    t.type === 'contribution' ? 'Contribution' : 'Withdrawal',
    t.amount.toFixed(2),
    t.note ?? '',
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  writeFileSync(filePath, csv, 'utf-8');
}

/**
 * Export FHSA transactions to CSV
 */
export function exportFHSAToCSV(data: UserData, filePath: string): void {
  const transactions = getAllFHSATransactionsSorted(data);
  
  const headers = ['Date', 'Type', 'Amount', 'Note'];
  const rows = transactions.map(t => [
    t.date,
    'Contribution',
    t.amount.toFixed(2),
    t.note ?? '',
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  writeFileSync(filePath, csv, 'utf-8');
}

/**
 * Generate TFSA summary text
 */
export function generateTFSASummary(data: UserData, room: {
  currentRoom: number;
  totalContributed: number;
  totalWithdrawn?: number;
  accumulatedRoom: number;
  withdrawalRoomAdded?: number;
}): string {
  const lines = [
    '═══════════════════════════════════════════',
    '           TFSA CONTRIBUTION ROOM          ',
    '═══════════════════════════════════════════',
    '',
    `  Accumulated Room (since ${data.profile.birthYear + 18} or 2009):  ${formatCurrency(room.accumulatedRoom)}`,
    `  Total Contributed:                        -${formatCurrency(room.totalContributed)}`,
  ];
  
  if (room.withdrawalRoomAdded && room.withdrawalRoomAdded > 0) {
    lines.push(`  Withdrawal Room Added (prev years):       +${formatCurrency(room.withdrawalRoomAdded)}`);
  }
  
  lines.push(
    '                                           ───────────',
    `  CURRENT AVAILABLE ROOM:                   ${formatCurrency(room.currentRoom)}`,
    '',
    '═══════════════════════════════════════════',
  );
  
  if (room.totalWithdrawn && room.totalWithdrawn > 0) {
    lines.splice(-1, 0, `  Total Withdrawn (all time):               ${formatCurrency(room.totalWithdrawn)}`);
  }
  
  return lines.join('\n');
}

/**
 * Generate FHSA summary text
 */
export function generateFHSASummary(data: UserData, room: {
  currentRoom: number;
  totalContributed: number;
  lifetimeRemaining: number;
  yearlyBreakdown: Array<{
    year: number;
    closingRoom: number;
  }>;
}): string {
  const lines = [
    '═══════════════════════════════════════════',
    '           FHSA CONTRIBUTION ROOM          ',
    '═══════════════════════════════════════════',
    '',
    `  Lifetime Limit:                           ${formatCurrency(40000)}`,
    `  Total Contributed:                        -${formatCurrency(room.totalContributed)}`,
    '                                           ───────────',
    `  Lifetime Remaining:                       ${formatCurrency(room.lifetimeRemaining)}`,
    '',
    `  CURRENT AVAILABLE ROOM:                   ${formatCurrency(room.currentRoom)}`,
    '',
    '═══════════════════════════════════════════',
  ];
  
  return lines.join('\n');
}
