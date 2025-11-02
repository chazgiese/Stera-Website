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


// Get current version from stera-icons package
function getCurrentVersion() {
  try {
    // First, try to read the actual installed version from node_modules
    const steraIconsPackagePath = path.join(__dirname, '..', 'node_modules', 'stera-icons', 'package.json');
    if (fs.existsSync(steraIconsPackagePath)) {
      const steraIconsPackageJson = JSON.parse(fs.readFileSync(steraIconsPackagePath, 'utf8'));
      return steraIconsPackageJson.version;
    }
  } catch (error) {
    // Fallback to package.json dependency version
  }
  // Fallback: read from package.json dependencies
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = packageJson.dependencies['stera-icons'] || packageJson.devDependencies['stera-icons'];
  // Remove version range prefixes like ^, ~, >=
  return version ? version.replace(/^[\^~>=<]/, '') : 'unknown';
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
  
  // Group icons by component name to collect all variants
  const iconGroups = new Map();
  
  // Process metadata directly to get all variants
  metadata.forEach(iconMeta => {
    const componentName = iconMeta.componentName;
    const variant = iconMeta.variant;
    const versionAdded = iconMeta.versionAdded || 'unknown';
    const versionLastModified = iconMeta.versionLastModified || 'unknown';
    
    // Skip deprecated/backward-compatibility icons
    if (DEPRECATED_ICONS.has(componentName)) {
      deprecatedIcons.push(componentName);
      return;
    }
    
    // Validate that the icon actually exists in the package
    if (!validateIconExists(componentName, availableIcons)) {
      invalidIcons.push(componentName);
      return; // Skip invalid icons
    }
    
    // Get clean name without Icon suffix
    const cleanName = componentName.replace(/Icon$/, '');
    
    // Group by clean name
    if (!iconGroups.has(cleanName)) {
      iconGroups.set(cleanName, {
        name: cleanName,
        tags: new Set(),
        variants: {},
        variantLastModified: {},
        earliestVersion: versionAdded,
        latestVersionUpdated: versionLastModified
      });
    }
    
    const iconGroup = iconGroups.get(cleanName);
    
    // Add variant version
    iconGroup.variants[variant] = versionAdded;
    iconGroup.variantLastModified[variant] = versionLastModified;
    
    // Update earliest version
    if (versionAdded !== 'unknown' && 
        (iconGroup.earliestVersion === 'unknown' || 
         versionAdded < iconGroup.earliestVersion)) {
      iconGroup.earliestVersion = versionAdded;
    }
    
    // Update latest version updated
    if (versionLastModified !== 'unknown') {
      if (iconGroup.latestVersionUpdated === 'unknown' || 
          versionLastModified > iconGroup.latestVersionUpdated) {
        iconGroup.latestVersionUpdated = versionLastModified;
      }
    }
    
    // Add tags from metadata
    if (iconMeta.tags && Array.isArray(iconMeta.tags)) {
      iconMeta.tags.forEach(tag => iconGroup.tags.add(tag));
    }
    
    // Check if this is a new icon
    if (versionAdded !== 'unknown' && isVersionEqual(versionAdded, currentVersion)) {
      newIconsCount++;
    }
  });
  
  // Convert groups to result array
  iconGroups.forEach((iconGroup, cleanName) => {
    // Add base name as tag
    iconGroup.tags.add(cleanName);
    
    // Add "*new*" tag if any variant was added in the current version
    const hasNewVariant = Object.values(iconGroup.variants).some(version => 
      version !== 'unknown' && isVersionEqual(version, currentVersion)
    );
    if (hasNewVariant) {
      iconGroup.tags.add('*new*');
    }
    
    const iconData = {
      name: cleanName,
      tags: Array.from(iconGroup.tags),
      versionAdded: iconGroup.earliestVersion,
      variants: iconGroup.variantLastModified
    };
    
    // Include versionLastModified if it's not 'unknown'
    if (iconGroup.latestVersionUpdated !== 'unknown') {
      iconData.versionLastModified = iconGroup.latestVersionUpdated;
    }
    
    result.push(iconData);
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

if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}

// Write the icons data
const srcOutputPath = path.join(srcDataDir, 'icons.json');

try {
  const iconsJson = JSON.stringify(icons, null, 2);
  
  // Write to src/data
  fs.writeFileSync(srcOutputPath, iconsJson);
  console.log(`✅ Generated ${icons.length} icons data to ${srcOutputPath}`);
  
  // Also write version file
  const currentVersion = getCurrentVersion();
  const versionJson = JSON.stringify({ version: currentVersion }, null, 2);
  const versionOutputPath = path.join(srcDataDir, 'version.json');
  fs.writeFileSync(versionOutputPath, versionJson);
  console.log(`✅ Generated version file: ${currentVersion}`);
  
} catch (error) {
  console.error(`❌ Error writing icon data:`, error.message);
  process.exit(1);
}
