/**
 * Formatted display output using cli-table3
 */

import Table from 'cli-table3';
import chalk from 'chalk';
import type { FutureProjection, Transaction } from '../types/index.js';
import { formatDateForDisplay } from '../utils/dates.js';

/**
 * Format a number as currency string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Display TFSA room summary
 */
export function displayTFSARoom(room: {
  currentRoom: number;
  totalContributed: number;
  totalWithdrawn?: number;
  accumulatedRoom: number;
  withdrawalRoomAdded?: number;
}, birthYear: number): void {
  console.log('');
  console.log(chalk.bold.cyan('══════════════════════════════════════════════'));
  console.log(chalk.bold.cyan('           TFSA CONTRIBUTION ROOM             '));
  console.log(chalk.bold.cyan('══════════════════════════════════════════════'));
  console.log('');
  
  const table = new Table({
    style: { head: [], border: [] },
    colWidths: [40, 15],
  });
  
  table.push(
    [chalk.white('Accumulated Room (annual limits)'), chalk.green(formatCurrency(room.accumulatedRoom))],
    [chalk.white('Total Contributed'), chalk.red(`-${formatCurrency(room.totalContributed)}`)],
  );
  
  if (room.withdrawalRoomAdded && room.withdrawalRoomAdded > 0) {
    table.push([chalk.white('Withdrawal Room Added (prev years)'), chalk.green(`+${formatCurrency(room.withdrawalRoomAdded)}`)]);
  }
  
  console.log(table.toString());
  console.log('');
  console.log(chalk.bold.white(`  CURRENT AVAILABLE ROOM: `) + chalk.bold.green(formatCurrency(room.currentRoom)));
  console.log('');
  
  if (room.totalWithdrawn && room.totalWithdrawn > 0) {
    console.log(chalk.dim(`  Total withdrawn (all time): ${formatCurrency(room.totalWithdrawn)}`));
  }
  
  console.log(chalk.cyan('══════════════════════════════════════════════'));
  console.log('');
}

/**
 * Display FHSA room summary
 */
export function displayFHSARoom(room: {
  currentRoom: number;
  totalContributed: number;
  lifetimeRemaining: number;
}): void {
  console.log('');
  console.log(chalk.bold.magenta('══════════════════════════════════════════════'));
  console.log(chalk.bold.magenta('           FHSA CONTRIBUTION ROOM             '));
  console.log(chalk.bold.magenta('══════════════════════════════════════════════'));
  console.log('');
  
  const table = new Table({
    style: { head: [], border: [] },
    colWidths: [40, 15],
  });
  
  table.push(
    [chalk.white('Lifetime Limit'), chalk.white(formatCurrency(40000))],
    [chalk.white('Total Contributed'), chalk.red(`-${formatCurrency(room.totalContributed)}`)],
    [chalk.white('Lifetime Remaining'), chalk.green(formatCurrency(room.lifetimeRemaining))],
  );
  
  console.log(table.toString());
  console.log('');
  console.log(chalk.bold.white(`  CURRENT AVAILABLE ROOM: `) + chalk.bold.green(formatCurrency(room.currentRoom)));
  console.log('');
  console.log(chalk.magenta('══════════════════════════════════════════════'));
  console.log('');
}

/**
 * Display future projections table
 */
export function displayProjections(projections: FutureProjection[], accountType: 'TFSA' | 'FHSA'): void {
  const color = accountType === 'TFSA' ? chalk.cyan : chalk.magenta;
  
  console.log('');
  console.log(color.bold(`═══ ${accountType} 5-Year Room Projection ═══`));
  console.log('');
  
  const table = new Table({
    head: [
      chalk.bold('Year'),
      chalk.bold('Annual Limit'),
      chalk.bold('Projected Room'),
      chalk.bold('Notes'),
    ],
    colWidths: [8, 15, 18, 30],
    style: { head: [] },
  });
  
  for (const p of projections) {
    table.push([
      p.notes === 'Current' ? chalk.bold.yellow(p.year.toString()) : p.year.toString(),
      formatCurrency(p.annualLimit),
      chalk.green(formatCurrency(p.projectedRoom)),
      chalk.dim(p.notes ?? ''),
    ]);
  }
  
  console.log(table.toString());
  console.log('');
  console.log(chalk.dim('  * Projection assumes no additional contributions'));
  console.log('');
}

/**
 * Display transaction history
 */
export function displayTransactionHistory(
  transactions: Array<Transaction & { type?: 'contribution' | 'withdrawal' }>,
  accountType: 'TFSA' | 'FHSA'
): void {
  const color = accountType === 'TFSA' ? chalk.cyan : chalk.magenta;
  
  console.log('');
  console.log(color.bold(`═══ ${accountType} Transaction History ═══`));
  console.log('');
  
  if (transactions.length === 0) {
    console.log(chalk.dim('  No transactions recorded yet.'));
    console.log('');
    return;
  }
  
  const table = new Table({
    head: [
      chalk.bold('Date'),
      chalk.bold('Type'),
      chalk.bold('Amount'),
      chalk.bold('Note'),
    ],
    colWidths: [15, 14, 15, 30],
    style: { head: [] },
  });
  
  for (const t of transactions) {
    const type = t.type ?? 'contribution';
    const typeDisplay = type === 'contribution' 
      ? chalk.green('Contribution') 
      : chalk.red('Withdrawal');
    const amountDisplay = type === 'contribution'
      ? chalk.green(formatCurrency(t.amount))
      : chalk.red(formatCurrency(t.amount));
    
    table.push([
      formatDateForDisplay(t.date),
      typeDisplay,
      amountDisplay,
      chalk.dim(t.note ?? ''),
    ]);
  }
  
  console.log(table.toString());
  console.log('');
  
  // Summary
  const totalContributions = transactions
    .filter(t => (t.type ?? 'contribution') === 'contribution')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);
  
  console.log(chalk.white(`  Total Contributions: ${chalk.green(formatCurrency(totalContributions))}`));
  if (totalWithdrawals > 0) {
    console.log(chalk.white(`  Total Withdrawals: ${chalk.red(formatCurrency(totalWithdrawals))}`));
  }
  console.log('');
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log('');
  console.log(chalk.green('✓ ') + message);
  console.log('');
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.log('');
  console.log(chalk.red('✗ ') + message);
  console.log('');
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
  console.log('');
  console.log(chalk.yellow('⚠ ') + message);
  console.log('');
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
  console.log('');
  console.log(chalk.blue('ℹ ') + message);
  console.log('');
}

/**
 * Display welcome banner
 */
export function displayWelcome(): void {
  console.log('');
  console.log(chalk.bold.white('╔═══════════════════════════════════════════════╗'));
  console.log(chalk.bold.white('║') + chalk.bold.red('          CRA CLI - Contribution Tracker       ') + chalk.bold.white('║'));
  console.log(chalk.bold.white('║') + chalk.dim('     Track your TFSA and FHSA contributions    ') + chalk.bold.white('║'));
  console.log(chalk.bold.white('╚═══════════════════════════════════════════════╝'));
  console.log('');
}

/**
 * Display over-contribution warning
 */
export function displayOverContributionWarning(overAmount: number, accountType: 'TFSA' | 'FHSA'): void {
  console.log('');
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow.bold('  ⚠ OVER-CONTRIBUTION WARNING'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
  console.log(chalk.white(`  This contribution exceeds your available room by ${chalk.red(formatCurrency(overAmount))}`));
  console.log('');
  if (accountType === 'TFSA') {
    console.log(chalk.dim('  CRA charges a 1% monthly penalty on over-contributions.'));
    console.log(chalk.dim('  Consider reducing your contribution or withdrawing excess.'));
  } else {
    console.log(chalk.dim('  FHSA over-contributions are not allowed.'));
    console.log(chalk.dim('  The contribution will be recorded but may result in penalties.'));
  }
  console.log('');
}
