import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Create a map of component names + weight/duotone to their metadata
// Key format: "ComponentName:weight:duotone" (e.g., "Ai:bold:false")
const metadataMap = new Map();
metadata.forEach(icon => {
  const key = `${icon.componentName}:${icon.weight}:${icon.duotone}`;
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
  } catch {
    // Fallback to package.json dependency version
  }
  // Fallback: read from package.json dependencies
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = packageJson.dependencies['stera-icons'] || packageJson.devDependencies['stera-icons'];
  // Remove version range prefixes like ^, ~, >=
  return version ? version.replace(/^[\^~>=<]/, '') : 'unknown';
}

// Compare version strings, ignoring patch version (e.g., 5.6.0 === 5.6.1)
function isVersionEqual(version1, version2) {
  if (!version1 || !version2) return false;

  const [major1, minor1] = version1.split('.');
  const [major2, minor2] = version2.split('.');

  if (major1 == null || minor1 == null || major2 == null || minor2 == null) {
    return false;
  }

  return major1 === major2 && minor1 === minor2;
}

// List of backward-compatibility icons that should be excluded
// Note: In v7.0.0+, component names no longer have the 'Icon' suffix
const DEPRECATED_ICONS = new Set([
  'Checkmark', // Deprecated in favor of Check
  'CheckmarkBold', // Deprecated in favor of CheckBold
  'CheckmarkFilled', // Deprecated in favor of CheckFilled
  // Add other deprecated icons here as needed
]);

// Helper function to get clean icon name
// In v7.0.0+, component names no longer have the 'Icon' suffix
function getCleanIconName(componentName) {
  return componentName;
}

// Generate all icon data
async function generateIconData() {
  const Icons = await import('stera-icons');
  const availableIcons = new Set(Object.keys(Icons));
  const currentVersion = getCurrentVersion();
  
  console.log(`📦 Found ${availableIcons.size} icons in stera-icons package`);
  console.log(`🔖 Current stera-icons version: ${currentVersion}`);
  
  const result = [];
  const invalidIcons = [];
  const deprecatedIcons = [];
  let newIconsCount = 0;
  let updatedIconsCount = 0;
  
  // Group icons by component name to collect all weight/duotone combinations
  const iconGroups = new Map();
  
  // Process metadata directly to get all weight/duotone combinations
  metadata.forEach(iconMeta => {
    const componentName = iconMeta.componentName;
    const weight = iconMeta.weight || 'regular';
    const duotone = iconMeta.duotone || false;
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
    const cleanName = getCleanIconName(componentName);
    
    // Group by clean name
    if (!iconGroups.has(cleanName)) {
      iconGroups.set(cleanName, {
        name: cleanName,
        kebabName: iconMeta.name, // Extract kebab-case name from metadata
        tags: new Set(),
        weights: new Set(),
        supportsDuotone: false,
        variantVersionAdded: {},
        earliestVersion: versionAdded,
        latestVersionUpdated: versionLastModified
      });
    }
    
    const iconGroup = iconGroups.get(cleanName);
    
    // Track available weights
    iconGroup.weights.add(weight);
    
    // Track duotone support
    if (duotone) {
      iconGroup.supportsDuotone = true;
    }
    
    // Create a variant key for tracking version info and component names
    const variantKey = duotone ? `${weight}-duotone` : weight;
    if (!iconGroup.variantVersionAdded[variantKey]) {
      iconGroup.variantVersionAdded[variantKey] = {
        version: versionAdded,
        componentName: iconMeta.variantComponentName,
        fileName: iconMeta.fileName?.replace('.tsx', '')
      };
    }
    
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
    const hasNewVariant = Object.values(iconGroup.variantVersionAdded).some(variantInfo => 
      variantInfo.version !== 'unknown' && isVersionEqual(variantInfo.version, currentVersion)
    );
    if (hasNewVariant) {
      iconGroup.tags.add('*new*');
    }
    
    // Add "*updated*" tag if icon was updated in current version but not new
    const wasUpdatedInCurrentVersion = iconGroup.latestVersionUpdated !== 'unknown' && 
      isVersionEqual(iconGroup.latestVersionUpdated, currentVersion);
    if (wasUpdatedInCurrentVersion && !hasNewVariant) {
      iconGroup.tags.add('*updated*');
      updatedIconsCount++;
    }
    
    const iconData = {
      name: cleanName,
      kebabName: iconGroup.kebabName,
      componentName: cleanName,
      tags: Array.from(iconGroup.tags),
      versionAdded: iconGroup.earliestVersion,
      weights: Array.from(iconGroup.weights).sort(),
      supportsDuotone: iconGroup.supportsDuotone,
      variants: iconGroup.variantVersionAdded
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
  console.log(`🔄 Tagged ${updatedIconsCount} icons as "*updated*" for version ${currentVersion}`);
  console.log(`✅ Generated data for ${result.length} valid icons`);
  return result;
}

// Generate the icons data
const icons = await generateIconData();

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
  
  // Generate icon components map for DynamicIcon
  generateIconComponentsMap(icons, srcDataDir);
  
} catch (error) {
  console.error(`❌ Error writing icon data:`, error.message);
  process.exit(1);
}

// Generate the icon components map file for pre-built icon lookups
function generateIconComponentsMap(icons, outputDir) {
  // Build the mapping entries
  const mappingEntries = icons.map(icon => {
    const kebabName = icon.kebabName;
    const componentName = icon.componentName || icon.name;
    return `  '${kebabName}': Icons.${componentName}`;
  });

  // Generate the TypeScript file content
  const fileContent = `// Auto-generated by generate-icons.mjs - DO NOT EDIT
import * as Icons from 'stera-icons/dynamic-variants';
import type { ComponentType } from 'react';
import type { IconProps } from 'stera-icons';

export type DynamicVariantProps = IconProps & {
  weight?: 'regular' | 'bold' | 'fill';
  duotone?: boolean;
};

export const iconMap: Record<string, ComponentType<DynamicVariantProps>> = {
${mappingEntries.join(',\n')}
};
`;

  const outputPath = path.join(outputDir, 'iconComponents.tsx');
  fs.writeFileSync(outputPath, fileContent);
  console.log(`✅ Generated icon components map with ${icons.length} icons to ${outputPath}`);
}
