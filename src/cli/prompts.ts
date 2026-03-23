/**
 * User input prompts using Inquirer.js
 */

import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, UserData } from '../types/index.js';
import { validateAmount, validateTransactionDate, validateBirthYear, validateFHSAOpeningDate, parseCurrencyInput } from '../utils/validation.js';
import { getTodayISO, getCurrentYear } from '../utils/dates.js';
import { displayWarning, displayOverContributionWarning } from './display.js';
import { checkTFSAContributionRoom } from '../services/tfsa.js';
import { checkFHSAContributionRoom } from '../services/fhsa.js';

/**
 * Prompt for birth year during setup
 */
export async function promptBirthYear(): Promise<number> {
  const { birthYear } = await inquirer.prompt([
    {
      type: 'input',
      name: 'birthYear',
      message: 'What year were you born?',
      validate: (input: string) => {
        const year = parseInt(input, 10);
        const result = validateBirthYear(year);
        return result.valid ? true : result.error!;
      },
      filter: (input: string) => parseInt(input, 10),
    },
  ]);
  
  return birthYear;
}

/**
 * Prompt for FHSA opening date during setup
 */
export async function promptFHSASetup(birthYear: number): Promise<string | null> {
  const { hasOpened } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasOpened',
      message: 'Have you opened an FHSA (First Home Savings Account)?',
      default: false,
    },
  ]);
  
  if (!hasOpened) {
    return null;
  }
  
  const { openedDate } = await inquirer.prompt([
    {
      type: 'input',
      name: 'openedDate',
      message: 'When did you open your FHSA? (YYYY-MM-DD)',
      default: getTodayISO(),
      validate: (input: string) => {
        const result = validateFHSAOpeningDate(input, birthYear);
        return result.valid ? true : result.error!;
      },
    },
  ]);
  
  return openedDate;
}

/**
 * Prompt for contribution details
 */
export async function promptContribution(
  accountType: 'TFSA' | 'FHSA',
  data: UserData
): Promise<Transaction | null> {
  const { amount } = await inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: `Enter contribution amount (or 'cancel' to go back):`,
      validate: (input: string) => {
        if (input.toLowerCase() === 'cancel') return true;
        const parsed = parseCurrencyInput(input);
        if (parsed === null) return 'Please enter a valid amount';
        const result = validateAmount(parsed);
        return result.valid ? true : result.error!;
      },
    },
  ]);
  
  if (amount.toLowerCase() === 'cancel') {
    return null;
  }
  
  const parsedAmount = parseCurrencyInput(amount)!;
  
  // Check for over-contribution
  if (accountType === 'TFSA') {
    const check = checkTFSAContributionRoom(data, parsedAmount);
    if (!check.hasRoom) {
      displayOverContributionWarning(check.overContribution, 'TFSA');
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you still want to record this contribution?',
          default: false,
        },
      ]);
      if (!proceed) return null;
    }
  } else {
    const check = checkFHSAContributionRoom(data, parsedAmount);
    if (!check.hasRoom) {
      displayOverContributionWarning(check.overContribution, 'FHSA');
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you still want to record this contribution?',
          default: false,
        },
      ]);
      if (!proceed) return null;
    }
  }
  
  const { date } = await inquirer.prompt([
    {
      type: 'input',
      name: 'date',
      message: 'Contribution date (YYYY-MM-DD):',
      default: getTodayISO(),
      validate: (input: string) => {
        const result = validateTransactionDate(input);
        return result.valid ? true : result.error!;
      },
    },
  ]);
  
  const { note } = await inquirer.prompt([
    {
      type: 'input',
      name: 'note',
      message: 'Add a note (optional):',
    },
  ]);
  
  return {
    id: uuidv4(),
    date,
    amount: parsedAmount,
    note: note || undefined,
  };
}

/**
 * Prompt for withdrawal details (TFSA only)
 */
export async function promptWithdrawal(data: UserData): Promise<Transaction | null> {
  const { amount } = await inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: `Enter withdrawal amount (or 'cancel' to go back):`,
      validate: (input: string) => {
        if (input.toLowerCase() === 'cancel') return true;
        const parsed = parseCurrencyInput(input);
        if (parsed === null) return 'Please enter a valid amount';
        const result = validateAmount(parsed);
        return result.valid ? true : result.error!;
      },
    },
  ]);
  
  if (amount.toLowerCase() === 'cancel') {
    return null;
  }
  
  const parsedAmount = parseCurrencyInput(amount)!;
  
  const { date } = await inquirer.prompt([
    {
      type: 'input',
      name: 'date',
      message: 'Withdrawal date (YYYY-MM-DD):',
      default: getTodayISO(),
      validate: (input: string) => {
        const result = validateTransactionDate(input);
        return result.valid ? true : result.error!;
      },
    },
  ]);
  
  const { note } = await inquirer.prompt([
    {
      type: 'input',
      name: 'note',
      message: 'Add a note (optional):',
    },
  ]);
  
  return {
    id: uuidv4(),
    date,
    amount: parsedAmount,
    note: note || undefined,
  };
}

/**
 * Prompt for CSV export path
 */
export async function promptExportPath(defaultName: string): Promise<string | null> {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter file path for export (or "cancel"):',
      default: `./${defaultName}`,
      validate: (input: string) => {
        if (input.toLowerCase() === 'cancel') return true;
        if (!input.endsWith('.csv')) return 'File must have .csv extension';
        return true;
      },
    },
  ]);
  
  if (filePath.toLowerCase() === 'cancel') {
    return null;
  }
  
  return filePath;
}

/**
 * Prompt for confirmation
 */
export async function promptConfirm(message: string, defaultValue: boolean = false): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: defaultValue,
    },
  ]);
  
  return confirmed;
}

/**
 * Prompt to select which transaction to undo
 */
export async function promptUndoSelection(
  accountType: 'TFSA' | 'FHSA',
  hasContributions: boolean,
  hasWithdrawals: boolean
): Promise<'contribution' | 'withdrawal' | 'cancel'> {
  const choices: Array<{ name: string; value: string }> = [];
  
  if (hasContributions) {
    choices.push({ name: 'Undo last contribution', value: 'contribution' });
  }
  
  if (accountType === 'TFSA' && hasWithdrawals) {
    choices.push({ name: 'Undo last withdrawal', value: 'withdrawal' });
  }
  
  choices.push({ name: 'Cancel', value: 'cancel' });
  
  if (choices.length === 1) {
    displayWarning('No transactions to undo.');
    return 'cancel';
  }
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to undo?',
      choices,
    },
  ]);
  
  return action;
}

/**
 * Press enter to continue
 */
export async function pressEnterToContinue(): Promise<void> {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press Enter to continue...',
    },
  ]);
}
