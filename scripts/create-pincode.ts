#!/usr/bin/env tsx
/**
 * Create Pincode Script
 * Allows developers to create/reset the pincode for local development
 *
 * Usage:
 *   npm run create-pincode
 *   npm run create-pincode 1234
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as readline from 'readline';

const CONFIG_DIR = path.join(os.homedir(), '.config', 'pi-touch-calendar');
const CREDENTIALS_FILE = path.join(CONFIG_DIR, 'credentials.json');

/**
 * Hash a pincode using SHA-256
 */
function hashPincode(pincode: string): string {
  return crypto.createHash('sha256').update(pincode).digest('hex');
}

/**
 * Validate pincode format (4-8 digits)
 */
function validatePincode(pincode: string): { valid: boolean; error?: string } {
  if (!pincode || typeof pincode !== 'string') {
    return { valid: false, error: 'Pincode is required' };
  }

  if (!/^\d+$/.test(pincode)) {
    return { valid: false, error: 'Pincode must contain only digits' };
  }

  if (pincode.length < 4) {
    return { valid: false, error: 'Pincode must be at least 4 digits' };
  }

  if (pincode.length > 8) {
    return { valid: false, error: 'Pincode must be at most 8 digits' };
  }

  return { valid: true };
}

/**
 * Create config directory if it doesn't exist
 */
function ensureConfigDirectory(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    console.log(`✅ Created config directory: ${CONFIG_DIR}`);
  }
}

/**
 * Save credentials to file
 */
function saveCredentials(pincode: string): void {
  const hashedPincode = hashPincode(pincode);
  const credentials = {
    pincode: hashedPincode,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    CREDENTIALS_FILE,
    JSON.stringify(credentials, null, 2),
    { mode: 0o600 }
  );

  console.log(`✅ Pincode saved to: ${CREDENTIALS_FILE}`);
  console.log(`🔒 Your pincode is: ${pincode}`);
  console.log(`📅 Created at: ${credentials.createdAt}`);
}

/**
 * Prompt user for pincode
 */
async function promptForPincode(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter new pincode (4-8 digits): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🔐 Pi Touch Calendar - Create Pincode\n');

  // Check if pincode was provided as argument
  let pincode = process.argv[2];

  // If not provided, prompt for it
  if (!pincode) {
    pincode = await promptForPincode();
  }

  // Validate pincode
  const validation = validatePincode(pincode);
  if (!validation.valid) {
    console.error(`❌ Error: ${validation.error}`);
    process.exit(1);
  }

  // Check if credentials already exist
  if (fs.existsSync(CREDENTIALS_FILE)) {
    console.log('⚠️  Warning: Existing pincode will be overwritten');

    // Read existing credentials
    try {
      const existing = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
      console.log(`   Previous pincode created at: ${existing.createdAt}`);
    } catch (error) {
      // Ignore error if file is corrupted
    }
    console.log('');
  }

  // Create config directory
  ensureConfigDirectory();

  // Save credentials
  saveCredentials(pincode);

  console.log('\n✨ Done! You can now login with your pincode.');
}

// Run the script
main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
