# Icon Management System

This document explains how the icon management system works and how to prevent issues when updating the stera-icons package.

## Overview

The application uses a single icon data file:
- `src/data/icons.json` - Source of truth for icon data

## Scripts

### `npm run generate-icons`
Regenerates the icon data from the stera-icons package. This script:
- ✅ Validates that all generated icons actually exist in stera-icons
- ✅ Writes icon data to `src/data/icons.json`
- ✅ Provides detailed logging and error reporting

### `npm run postinstall`
Automatically runs `generate-icons` after package installation, ensuring data is always up-to-date.

## Preventing Future Issues

### 1. Automatic Validation
The improved generation script now:
- Validates that every icon actually exists in the stera-icons package
- Skips invalid icons and reports them

### 2. Package Updates
When updating stera-icons:
1. Update the package: `pnpm update stera-icons`
2. Regenerate icons: `npm run generate-icons`
3. Test the application to ensure icons load correctly

### 3. Development Workflow
- Always use `npm run generate-icons` instead of manually editing icon data
- Check for console warnings about invalid icons

## Troubleshooting

### Icons Not Loading
1. Check if the icon exists in stera-icons: `npm run generate-icons`
2. Clear browser cache and restart dev server

### Invalid Icons Warning
If you see warnings about invalid icons:
1. Check the stera-icons package version
2. Verify the icon name is correct
3. Update stera-icons if needed
4. Regenerate icon data

## File Structure
```
scripts/
└── generate-icons.js    # Main generation script with validation

src/data/
└── icons.json          # Source of truth for icon data
```

## Best Practices

1. **Always regenerate after package updates**: `npm run generate-icons`
2. **Don't manually edit icon data files**: Use the generation script
3. **Check for warnings**: Pay attention to console output during generation
4. **Test after changes**: Verify icons load correctly in the application
5. **Use version control**: Commit the icon data file when regenerating
