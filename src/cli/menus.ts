/**
 * Interactive menu system using Inquirer.js
 */

import inquirer from 'inquirer';
import type { MainMenuChoice, MenuAction, UserData } from '../types/index.js';
import { 
  loadUserData, 
  saveUserData, 
  isProfileSetUp, 
  updateProfile,
  addTFSAContribution,
  addTFSAWithdrawal,
  addFHSAContribution,
  removeLastTFSAContribution,
  removeLastTFSAWithdrawal,
  removeLastFHSAContribution,
  resetTFSAData,
  resetFHSAData,
  getAllTFSATransactionsSorted,
  getAllFHSATransactionsSorted,
} from '../storage/storage.js';
import { calculateTFSARoom, projectTFSARoom } from '../services/tfsa.js';
import { calculateFHSARoomDetailed, projectFHSARoom, isFHSAOpened } from '../services/fhsa.js';
import { exportTFSAToCSV, exportFHSAToCSV } from '../services/export.js';
import {
  displayWelcome,
  displayTFSARoom,
  displayFHSARoom,
  displayProjections,
  displayTransactionHistory,
  displaySuccess,
  displayError,
  displayWarning,
  displayInfo,
} from './display.js';
import {
  promptBirthYear,
  promptFHSASetup,
  promptContribution,
  promptWithdrawal,
  promptExportPath,
  promptConfirm,
  promptUndoSelection,
  pressEnterToContinue,
} from './prompts.js';

/**
 * Run the first-time setup wizard
 */
export async function runSetupWizard(): Promise<UserData> {
  console.log('');
  console.log('Welcome! Let\'s set up your profile.');
  console.log('');
  
  const birthYear = await promptBirthYear();
  const fhsaOpenedDate = await promptFHSASetup(birthYear);
  
  let data = loadUserData();
  data = updateProfile(data, birthYear, fhsaOpenedDate);
  saveUserData(data);
  
  displaySuccess('Profile setup complete!');
  
  return data;
}

/**
 * Main menu prompt
 */
export async function showMainMenu(): Promise<MainMenuChoice> {
  const { choice } = await inquirer.prompt([
    {
      type: 'select',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        { name: '📊 TFSA - Tax-Free Savings Account', value: 'tfsa' },
        { name: '🏠 FHSA - First Home Savings Account', value: 'fhsa' },
        { name: '⚙️  Settings', value: 'settings' },
        { name: '👋 Exit', value: 'exit' },
      ],
    },
  ]);
  
  return choice;
}

/**
 * TFSA submenu prompt
 */
export async function showTFSAMenu(): Promise<MenuAction> {
  const { action } = await inquirer.prompt([
    {
      type: 'select',
      name: 'action',
      message: 'TFSA Options:',
      choices: [
        { name: '📈 View contribution room', value: 'view_room' },
        { name: '➕ Add contribution', value: 'add_contribution' },
        { name: '➖ Record withdrawal', value: 'add_withdrawal' },
        { name: '📋 View history', value: 'view_history' },
        { name: '🔮 Project future room (5 years)', value: 'project_future' },
        { name: '💾 Export to CSV', value: 'export_csv' },
        { name: '↩️  Undo last transaction', value: 'undo_last' },
        { name: '🗑️  Reset TFSA data', value: 'reset_data' },
        { name: '⬅️  Back to main menu', value: 'back' },
      ],
    },
  ]);
  
  return action;
}

/**
 * FHSA submenu prompt
 */
export async function showFHSAMenu(): Promise<MenuAction> {
  const { action } = await inquirer.prompt([
    {
      type: 'select',
      name: 'action',
      message: 'FHSA Options:',
      choices: [
        { name: '📈 View contribution room', value: 'view_room' },
        { name: '➕ Add contribution', value: 'add_contribution' },
        { name: '📋 View history', value: 'view_history' },
        { name: '🔮 Project future room (5 years)', value: 'project_future' },
        { name: '💾 Export to CSV', value: 'export_csv' },
        { name: '↩️  Undo last contribution', value: 'undo_last' },
        { name: '🗑️  Reset FHSA data', value: 'reset_data' },
        { name: '⬅️  Back to main menu', value: 'back' },
      ],
    },
  ]);
  
  return action;
}

/**
 * Settings menu
 */
export async function showSettingsMenu(): Promise<'update_profile' | 'view_profile' | 'back'> {
  const { action } = await inquirer.prompt([
    {
      type: 'select',
      name: 'action',
      message: 'Settings:',
      choices: [
        { name: '👤 View profile', value: 'view_profile' },
        { name: '✏️  Update profile', value: 'update_profile' },
        { name: '⬅️  Back to main menu', value: 'back' },
      ],
    },
  ]);
  
  return action;
}

/**
 * Handle TFSA menu actions
 */
export async function handleTFSAAction(action: MenuAction, data: UserData): Promise<UserData> {
  switch (action) {
    case 'view_room': {
      const room = calculateTFSARoom(data);
      displayTFSARoom(room, data.profile.birthYear);
      await pressEnterToContinue();
      break;
    }
    
    case 'add_contribution': {
      const transaction = await promptContribution('TFSA', data);
      if (transaction) {
        data = addTFSAContribution(data, transaction);
        saveUserData(data);
        displaySuccess(`Contribution of $${transaction.amount.toLocaleString()} recorded!`);
      }
      break;
    }
    
    case 'add_withdrawal': {
      const transaction = await promptWithdrawal(data);
      if (transaction) {
        data = addTFSAWithdrawal(data, transaction);
        saveUserData(data);
        displaySuccess(`Withdrawal of $${transaction.amount.toLocaleString()} recorded!`);
        displayInfo('This amount will be added back to your contribution room on January 1st of next year.');
      }
      break;
    }
    
    case 'view_history': {
      const transactions = getAllTFSATransactionsSorted(data);
      displayTransactionHistory(transactions, 'TFSA');
      await pressEnterToContinue();
      break;
    }
    
    case 'project_future': {
      const projections = projectTFSARoom(data, 5);
      displayProjections(projections, 'TFSA');
      await pressEnterToContinue();
      break;
    }
    
    case 'export_csv': {
      const filePath = await promptExportPath('tfsa-transactions.csv');
      if (filePath) {
        try {
          exportTFSAToCSV(data, filePath);
          displaySuccess(`Exported to ${filePath}`);
        } catch (error) {
          displayError(`Failed to export: ${error}`);
        }
      }
      break;
    }
    
    case 'undo_last': {
      const hasContributions = data.tfsa.contributions.length > 0;
      const hasWithdrawals = data.tfsa.withdrawals.length > 0;
      
      const selection = await promptUndoSelection('TFSA', hasContributions, hasWithdrawals);
      
      if (selection === 'contribution') {
        const { data: newData, removed } = removeLastTFSAContribution(data);
        if (removed) {
          data = newData;
          saveUserData(data);
          displaySuccess(`Removed contribution of $${removed.amount.toLocaleString()} from ${removed.date}`);
        }
      } else if (selection === 'withdrawal') {
        const { data: newData, removed } = removeLastTFSAWithdrawal(data);
        if (removed) {
          data = newData;
          saveUserData(data);
          displaySuccess(`Removed withdrawal of $${removed.amount.toLocaleString()} from ${removed.date}`);
        }
      }
      break;
    }
    
    case 'reset_data': {
      const confirmed = await promptConfirm('Are you sure you want to reset all TFSA data? This cannot be undone.', false);
      if (confirmed) {
        data = resetTFSAData(data);
        saveUserData(data);
        displaySuccess('TFSA data has been reset.');
      }
      break;
    }
  }
  
  return data;
}

/**
 * Handle FHSA menu actions
 */
export async function handleFHSAAction(action: MenuAction, data: UserData): Promise<UserData> {
  // Check if FHSA is opened
  if (!isFHSAOpened(data) && action !== 'view_room' && action !== 'back') {
    displayWarning('You have not opened an FHSA yet.');
    const openNow = await promptConfirm('Would you like to set up your FHSA now?', true);
    if (openNow) {
      const openedDate = await promptFHSASetup(data.profile.birthYear);
      if (openedDate) {
        data = updateProfile(data, data.profile.birthYear, openedDate);
        saveUserData(data);
        displaySuccess('FHSA setup complete!');
      }
    }
    if (!isFHSAOpened(data)) {
      return data;
    }
  }
  
  switch (action) {
    case 'view_room': {
      if (!isFHSAOpened(data)) {
        displayInfo('You have not opened an FHSA. Go to Settings to set one up.');
        await pressEnterToContinue();
        break;
      }
      const room = calculateFHSARoomDetailed(data);
      displayFHSARoom(room);
      await pressEnterToContinue();
      break;
    }
    
    case 'add_contribution': {
      const transaction = await promptContribution('FHSA', data);
      if (transaction) {
        data = addFHSAContribution(data, transaction);
        saveUserData(data);
        displaySuccess(`Contribution of $${transaction.amount.toLocaleString()} recorded!`);
      }
      break;
    }
    
    case 'view_history': {
      const transactions = getAllFHSATransactionsSorted(data);
      displayTransactionHistory(transactions, 'FHSA');
      await pressEnterToContinue();
      break;
    }
    
    case 'project_future': {
      const projections = projectFHSARoom(data, 5);
      displayProjections(projections, 'FHSA');
      await pressEnterToContinue();
      break;
    }
    
    case 'export_csv': {
      const filePath = await promptExportPath('fhsa-transactions.csv');
      if (filePath) {
        try {
          exportFHSAToCSV(data, filePath);
          displaySuccess(`Exported to ${filePath}`);
        } catch (error) {
          displayError(`Failed to export: ${error}`);
        }
      }
      break;
    }
    
    case 'undo_last': {
      const hasContributions = data.fhsa.contributions.length > 0;
      
      if (!hasContributions) {
        displayWarning('No contributions to undo.');
        break;
      }
      
      const confirmed = await promptConfirm('Undo the last FHSA contribution?', false);
      if (confirmed) {
        const { data: newData, removed } = removeLastFHSAContribution(data);
        if (removed) {
          data = newData;
          saveUserData(data);
          displaySuccess(`Removed contribution of $${removed.amount.toLocaleString()} from ${removed.date}`);
        }
      }
      break;
    }
    
    case 'reset_data': {
      const confirmed = await promptConfirm('Are you sure you want to reset all FHSA data? This cannot be undone.', false);
      if (confirmed) {
        data = resetFHSAData(data);
        saveUserData(data);
        displaySuccess('FHSA data has been reset.');
      }
      break;
    }
  }
  
  return data;
}

/**
 * Handle settings actions
 */
export async function handleSettingsAction(
  action: 'update_profile' | 'view_profile' | 'back',
  data: UserData
): Promise<UserData> {
  switch (action) {
    case 'view_profile': {
      console.log('');
      console.log('📋 Your Profile');
      console.log('───────────────────────────────────');
      console.log(`  Birth Year: ${data.profile.birthYear}`);
      console.log(`  FHSA Opened: ${data.profile.fhsaOpenedDate ?? 'Not opened'}`);
      console.log('───────────────────────────────────');
      console.log('');
      await pressEnterToContinue();
      break;
    }
    
    case 'update_profile': {
      const birthYear = await promptBirthYear();
      const fhsaOpenedDate = await promptFHSASetup(birthYear);
      data = updateProfile(data, birthYear, fhsaOpenedDate);
      saveUserData(data);
      displaySuccess('Profile updated!');
      break;
    }
  }
  
  return data;
}

/**
 * Main application loop
 */
export async function runMainLoop(): Promise<void> {
  displayWelcome();
  
  let data = loadUserData();
  
  // Check if first-time setup is needed
  if (!isProfileSetUp(data)) {
    data = await runSetupWizard();
  }
  
  let running = true;
  
  while (running) {
    const mainChoice = await showMainMenu();
    
    switch (mainChoice) {
      case 'tfsa': {
        let inTFSAMenu = true;
        while (inTFSAMenu) {
          const action = await showTFSAMenu();
          if (action === 'back') {
            inTFSAMenu = false;
          } else {
            data = await handleTFSAAction(action, data);
          }
        }
        break;
      }
      
      case 'fhsa': {
        let inFHSAMenu = true;
        while (inFHSAMenu) {
          const action = await showFHSAMenu();
          if (action === 'back') {
            inFHSAMenu = false;
          } else {
            data = await handleFHSAAction(action, data);
          }
        }
        break;
      }
      
      case 'settings': {
        let inSettings = true;
        while (inSettings) {
          const action = await showSettingsMenu();
          if (action === 'back') {
            inSettings = false;
          } else {
            data = await handleSettingsAction(action, data);
          }
        }
        break;
      }
      
      case 'exit': {
        running = false;
        console.log('');
        console.log('Goodbye! 👋');
        console.log('');
        break;
      }
    }
  }
}
