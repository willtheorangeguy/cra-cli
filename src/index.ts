#!/usr/bin/env node
/**
 * CRA CLI - TFSA & FHSA Contribution Tracker
 * Track your Canadian tax-advantaged account contributions and calculate room.
 */

import { runMainLoop } from './cli/menus.js';

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nGoodbye! 👋\n');
  process.exit(0);
});

// Run the application
runMainLoop().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
