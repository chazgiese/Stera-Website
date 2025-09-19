#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Pre-commit hook to ensure icon data consistency
 * This prevents committing with mismatched src and public icon data
 */

const srcPath = path.join(__dirname, '..', 'src', 'data', 'icons.json');
const publicPath = path.join(__dirname, '..', 'public', 'data', 'icons.json');

function checkIconDataConsistency() {
  try {
    // Check if both files exist
    if (!fs.existsSync(srcPath)) {
      console.error('❌ src/data/icons.json not found');
      return false;
    }
    
    if (!fs.existsSync(publicPath)) {
      console.error('❌ public/data/icons.json not found');
      return false;
    }

    // Read both files
    const srcData = fs.readFileSync(srcPath, 'utf8');
    const publicData = fs.readFileSync(publicPath, 'utf8');

    // Compare content
    if (srcData !== publicData) {
      console.error('❌ Icon data inconsistency detected!');
      console.error('   src/data/icons.json and public/data/icons.json are different');
      console.error('   Run "npm run sync-icons" to fix this issue');
      return false;
    }

    console.log('✅ Icon data consistency check passed');
    return true;

  } catch (error) {
    console.error('❌ Error checking icon data consistency:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const success = checkIconDataConsistency();
  process.exit(success ? 0 : 1);
}

module.exports = { checkIconDataConsistency };
