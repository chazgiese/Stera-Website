const fs = require('fs');
const path = require('path');

// Validation function to check if icon exists in stera-icons
function validateIconExists(iconName, availableIcons) {
  if (!availableIcons.has(iconName)) {
    console.warn(`⚠️  Warning: Icon "${iconName}" not found in stera-icons package`);
    return false;
  }
  return true;
}

// Load the stera-icons metadata
const metadataPath = path.join(__dirname, '..', 'node_modules', 'stera-icons', 'dist', 'icons.meta.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Create a map of component names to their metadata
const metadataMap = new Map();
metadata.forEach(icon => {
  metadataMap.set(icon.componentName, icon);
});


// Get current version from package.json
function getCurrentVersion() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.dependencies['stera-icons'];
}

// Compare version strings (simple comparison for semantic versions)
function isVersionEqual(version1, version2) {
  return version1 === version2;
}

// Generate tags using actual metadata from stera-icons
function generateTags(iconName, metadata, currentVersion) {
  const tags = [];
  
  // Add base name as tag
  tags.push(iconName);
  
  // Add variant tags
  if (metadata && metadata.variant) {
    if (metadata.variant === 'filled') {
      tags.push('filled', 'solid');
    } else if (metadata.variant === 'outline') {
      tags.push('outline', 'line');
    }
  } else {
    // Fallback to name-based detection
    const name = iconName.toLowerCase();
    if (name.includes('filled')) {
      tags.push('filled', 'solid');
    } else {
      tags.push('outline', 'line');
    }
  }
  
  // Add actual tags from metadata
  if (metadata && metadata.tags && Array.isArray(metadata.tags)) {
    tags.push(...metadata.tags);
  }
  
  const finalTags = [...new Set(tags)]; // Remove duplicates
  
  // Add "*new*" tag if icon was added in the current version
  const versionAdded = metadata?.versionAdded || 'unknown';
  if (versionAdded !== 'unknown' && isVersionEqual(versionAdded, currentVersion)) {
    finalTags.push('*new*');
  }
  
  // Filter out conflicting variant tags
  if (metadata && metadata.variant === 'filled') {
    // Remove outline/line tags from filled icons
    return finalTags.filter(tag => !['outline', 'line'].includes(tag));
  } else if (metadata && metadata.variant === 'outline') {
    // Remove filled/solid tags from outline icons
    return finalTags.filter(tag => !['filled', 'solid'].includes(tag));
  }
  
  
  return finalTags;
}

// List of backward-compatibility icons that should be excluded
const DEPRECATED_ICONS = new Set([
  'Checkmark', // Deprecated in favor of Check
  'CheckmarkBold', // Deprecated in favor of CheckBold
  'CheckmarkFilled', // Deprecated in favor of CheckFilled
  // Add other deprecated icons here as needed
]);

// Generate all icon data
function generateIconData() {
  const Icons = require('stera-icons');
  const availableIcons = new Set(Object.keys(Icons));
  const currentVersion = getCurrentVersion();
  
  console.log(`📦 Found ${availableIcons.size} icons in stera-icons package`);
  console.log(`🔖 Current stera-icons version: ${currentVersion}`);
  
  const result = [];
  const invalidIcons = [];
  const deprecatedIcons = [];
  let newIconsCount = 0;
  
  Object.entries(Icons).forEach(([name]) => {
    // Skip deprecated/backward-compatibility icons
    if (DEPRECATED_ICONS.has(name)) {
      deprecatedIcons.push(name);
      return;
    }
    
    // Validate that the icon actually exists
    if (!validateIconExists(name, availableIcons)) {
      invalidIcons.push(name);
      return; // Skip invalid icons
    }
    
    const metadata = metadataMap.get(name);
    const versionAdded = metadata?.versionAdded || 'unknown';
    
    // Check if this is a new icon
    if (versionAdded !== 'unknown' && isVersionEqual(versionAdded, currentVersion)) {
      newIconsCount++;
    }
    
    result.push({
      name,
      tags: generateTags(name, metadata, currentVersion),
      versionAdded: versionAdded,
    });
  });
  
  if (deprecatedIcons.length > 0) {
    console.log(`🚫 Excluded ${deprecatedIcons.length} deprecated/backward-compatibility icons:`);
    deprecatedIcons.forEach(icon => console.log(`   - ${icon}`));
  }
  
  if (invalidIcons.length > 0) {
    console.error(`❌ Found ${invalidIcons.length} invalid icons that will be skipped:`);
    invalidIcons.forEach(icon => console.error(`   - ${icon}`));
  }
  
  console.log(`✨ Tagged ${newIconsCount} icons as "*new*" for version ${currentVersion}`);
  console.log(`✅ Generated data for ${result.length} valid icons`);
  return result;
}

// Generate the icons data
const icons = generateIconData();

// Create the data directory if it doesn't exist
const srcDataDir = path.join(__dirname, '..', 'src', 'data');
const publicDataDir = path.join(__dirname, '..', 'public', 'data');

[srcDataDir, publicDataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Write the icons data to both locations
const srcOutputPath = path.join(srcDataDir, 'icons.json');
const publicOutputPath = path.join(publicDataDir, 'icons.json');

try {
  const iconsJson = JSON.stringify(icons, null, 2);
  
  // Write to src/data
  fs.writeFileSync(srcOutputPath, iconsJson);
  console.log(`✅ Generated ${icons.length} icons data to ${srcOutputPath}`);
  
  // Write to public/data (for frontend access)
  fs.writeFileSync(publicOutputPath, iconsJson);
  console.log(`✅ Synced icons data to ${publicOutputPath}`);
  
  // Verify both files are identical
  const srcContent = fs.readFileSync(srcOutputPath, 'utf8');
  const publicContent = fs.readFileSync(publicOutputPath, 'utf8');
  
  if (srcContent === publicContent) {
    console.log(`✅ Verified data consistency between src and public directories`);
  } else {
    console.error(`❌ Data inconsistency detected between src and public directories`);
    process.exit(1);
  }
  
} catch (error) {
  console.error(`❌ Error writing icon data:`, error.message);
  process.exit(1);
}
