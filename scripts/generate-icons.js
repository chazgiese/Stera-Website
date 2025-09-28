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

// Generate categories based on icon names
function getCategory(iconName) {
  const name = iconName.toLowerCase();
  
  if (name.includes('arrow') || name.includes('chevron')) return 'Navigation';
  if (name.includes('heart') || name.includes('star') || name.includes('like')) return 'Favorites';
  if (name.includes('user') || name.includes('person') || name.includes('profile')) return 'User';
  if (name.includes('home') || name.includes('house')) return 'Home';
  if (name.includes('search') || name.includes('magnify')) return 'Search';
  if (name.includes('cog') || name.includes('settings') || name.includes('gear')) return 'Settings';
  if (name.includes('mail') || name.includes('envelope') || name.includes('email')) return 'Communication';
  if (name.includes('phone') || name.includes('call')) return 'Communication';
  if (name.includes('calendar') || name.includes('date') || name.includes('time')) return 'Time';
  if (name.includes('download') || name.includes('upload') || name.includes('cloud')) return 'Files';
  if (name.includes('alert') || name.includes('warning') || name.includes('error')) return 'Alerts';
  if (name.includes('check') || name.includes('tick') || name.includes('success')) return 'Status';
  if (name.includes('eye') || name.includes('view') || name.includes('visibility')) return 'Visibility';
  if (name.includes('lock') || name.includes('unlock') || name.includes('security')) return 'Security';
  if (name.includes('edit') || name.includes('pencil') || name.includes('write')) return 'Edit';
  if (name.includes('delete') || name.includes('trash') || name.includes('remove')) return 'Actions';
  if (name.includes('add') || name.includes('plus') || name.includes('create')) return 'Actions';
  if (name.includes('play') || name.includes('pause') || name.includes('stop')) return 'Media';
  if (name.includes('music') || name.includes('sound') || name.includes('audio')) return 'Media';
  if (name.includes('image') || name.includes('photo') || name.includes('picture')) return 'Media';
  if (name.includes('shopping') || name.includes('cart') || name.includes('bag')) return 'Shopping';
  if (name.includes('money') || name.includes('dollar') || name.includes('payment')) return 'Finance';
  if (name.includes('location') || name.includes('map') || name.includes('pin')) return 'Location';
  if (name.includes('weather') || name.includes('sun') || name.includes('cloud')) return 'Weather';
  if (name.includes('game') || name.includes('controller') || name.includes('joystick')) return 'Gaming';
  if (name.includes('book') || name.includes('read') || name.includes('library')) return 'Education';
  if (name.includes('health') || name.includes('medical') || name.includes('heart')) return 'Health';
  if (name.includes('car') || name.includes('vehicle') || name.includes('transport')) return 'Transport';
  if (name.includes('food') || name.includes('restaurant') || name.includes('meal')) return 'Food';
  if (name.includes('building') || name.includes('office') || name.includes('work')) return 'Business';
  if (name.includes('tool') || name.includes('wrench') || name.includes('hammer')) return 'Tools';
  if (name.includes('science') || name.includes('lab') || name.includes('experiment')) return 'Science';
  if (name.includes('nature') || name.includes('tree') || name.includes('leaf')) return 'Nature';
  if (name.includes('space') || name.includes('alien') || name.includes('planet')) return 'Space';
  if (name.includes('sport') || name.includes('ball') || name.includes('fitness')) return 'Sports';
  if (name.includes('art') || name.includes('paint') || name.includes('design')) return 'Art';
  if (name.includes('tech') || name.includes('computer') || name.includes('code')) return 'Technology';
  
  return 'Other';
}

// Generate tags using actual metadata from stera-icons
function generateTags(iconName, metadata) {
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
  
  console.log(`📦 Found ${availableIcons.size} icons in stera-icons package`);
  
  const result = [];
  const invalidIcons = [];
  const deprecatedIcons = [];
  
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
    
    result.push({
      name,
      tags: generateTags(name, metadata),
      category: getCategory(name),
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
