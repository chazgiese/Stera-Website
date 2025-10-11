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

// Create a map of component names + variants to their metadata
// Key format: "ComponentName:variant" (e.g., "AiIcon:bold")
const metadataMap = new Map();
metadata.forEach(icon => {
  const key = `${icon.componentName}:${icon.variant}`;
  metadataMap.set(key, icon);
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
  'CheckmarkIcon', // Deprecated in favor of CheckIcon
  'CheckmarkIconBold', // Deprecated in favor of CheckIconBold
  'CheckmarkIconFilled', // Deprecated in favor of CheckIconFilled
  // Add other deprecated icons here as needed
]);

// Helper function to remove Icon suffix and variant suffixes
function getCleanIconName(componentName) {
  // Remove Icon suffix and variant suffixes
  let name = componentName;
  
  // Remove variant suffixes first
  if (name.endsWith('IconBold')) {
    return name.replace(/IconBold$/, '');
  } else if (name.endsWith('IconFilled')) {
    return name.replace(/IconFilled$/, '');
  } else if (name.endsWith('IconRegular')) {
    return name.replace(/IconRegular$/, '');
  } else if (name.endsWith('Icon')) {
    return name.replace(/Icon$/, '');
  }
  
  return name;
}

// Helper function to determine variant from component name
function getIconVariant(componentName) {
  if (componentName.endsWith('IconBold')) return 'Bold';
  if (componentName.endsWith('IconFilled')) return 'Filled';
  if (componentName.endsWith('IconRegular')) return 'Regular';
  return 'Regular'; // Default to Regular for base Icon suffix
}

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
  
  Object.entries(Icons).forEach(([componentName]) => {
    // Skip deprecated/backward-compatibility icons
    if (DEPRECATED_ICONS.has(componentName)) {
      deprecatedIcons.push(componentName);
      return;
    }
    
    // Skip IconRegular variants to avoid duplicates (IconRegular is same as base Icon)
    if (componentName.endsWith('IconRegular')) {
      return;
    }
    
    // Validate that the icon actually exists
    if (!validateIconExists(componentName, availableIcons)) {
      invalidIcons.push(componentName);
      return; // Skip invalid icons
    }
    
    // Determine variant and get corresponding metadata
    let variantKey = 'regular'; // default
    if (componentName.endsWith('IconBold')) {
      variantKey = 'bold';
    } else if (componentName.endsWith('IconFilled')) {
      variantKey = 'filled';
    }
    
    // Get clean component name (remove variant suffix)
    let baseComponentName = componentName;
    if (componentName.endsWith('IconBold') || componentName.endsWith('IconFilled')) {
      baseComponentName = baseComponentName.replace(/Bold$|Filled$/, '');
    }
    
    const metadataKey = `${baseComponentName}:${variantKey}`;
    const metadata = metadataMap.get(metadataKey);
    const versionAdded = metadata?.versionAdded || 'unknown';
    
    // Check if this is a new icon
    if (versionAdded !== 'unknown' && isVersionEqual(versionAdded, currentVersion)) {
      newIconsCount++;
    }
    
    // Get clean name without Icon suffix and variant
    const cleanName = getCleanIconName(componentName);
    const variant = getIconVariant(componentName);
    
    // Create a display name that includes the variant
    let displayName = cleanName;
    if (variant === 'Bold') {
      displayName = `${cleanName}Bold`;
    } else if (variant === 'Filled') {
      displayName = `${cleanName}Filled`;
    }
    // For Regular variant, keep the clean name as is
    
    result.push({
      name: displayName,
      tags: generateTags(displayName, metadata, currentVersion),
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
