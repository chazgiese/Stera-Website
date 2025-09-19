#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Sync script to ensure public/data/icons.json matches src/data/icons.json
 * This prevents the issue where frontend loads outdated icon data
 */

const srcPath = path.join(__dirname, '..', 'src', 'data', 'icons.json');
const publicPath = path.join(__dirname, '..', 'public', 'data', 'icons.json');

function syncIconData() {
  try {
    // Check if src data exists
    if (!fs.existsSync(srcPath)) {
      console.error('❌ Source icons data not found. Run "npm run generate-icons" first.');
      process.exit(1);
    }

    // Read src data
    const srcData = fs.readFileSync(srcPath, 'utf8');
    
    // Ensure public directory exists
    const publicDir = path.dirname(publicPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write to public directory
    fs.writeFileSync(publicPath, srcData);
    
    // Verify sync
    const publicData = fs.readFileSync(publicPath, 'utf8');
    
    if (srcData === publicData) {
      console.log('✅ Successfully synced icon data to public directory');
      console.log(`   Source: ${srcPath}`);
      console.log(`   Public: ${publicPath}`);
    } else {
      console.error('❌ Sync verification failed - files are not identical');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error syncing icon data:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncIconData();
}

module.exports = { syncIconData };
