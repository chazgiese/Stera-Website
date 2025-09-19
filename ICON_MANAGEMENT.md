# Icon Management System

This document explains how the icon management system works and how to prevent issues when updating the stera-icons package.

## Overview

The application uses a two-tier icon data system:
- `src/data/icons.json` - Source of truth for icon data
- `public/data/icons.json` - Copy used by the frontend

## Scripts

### `npm run generate-icons`
Regenerates the icon data from the stera-icons package. This script:
- ✅ Validates that all generated icons actually exist in stera-icons
- ✅ Automatically syncs data to both src and public directories
- ✅ Verifies data consistency between directories
- ✅ Provides detailed logging and error reporting

### `npm run sync-icons`
Syncs the public icon data with the source data. Use this when:
- You've manually updated src/data/icons.json
- You want to ensure frontend has the latest data
- You're troubleshooting icon loading issues

### `npm run postinstall`
Automatically runs `generate-icons` after package installation, ensuring data is always up-to-date.

## Preventing Future Issues

### 1. Automatic Validation
The improved generation script now:
- Validates that every icon actually exists in the stera-icons package
- Skips invalid icons and reports them
- Ensures data consistency between src and public directories

### 2. Pre-commit Checks
Run `node scripts/pre-commit-check.js` before committing to ensure:
- Both src and public icon data files exist
- Both files contain identical data
- No data inconsistency issues

### 3. Package Updates
When updating stera-icons:
1. Update the package: `pnpm update stera-icons`
2. Regenerate icons: `npm run generate-icons`
3. Test the application to ensure icons load correctly

### 4. Development Workflow
- Always use `npm run generate-icons` instead of manually editing icon data
- If you manually edit src/data/icons.json, run `npm run sync-icons`
- Check for console warnings about invalid icons

## Troubleshooting

### Icons Not Loading
1. Check if the icon exists in stera-icons: `npm run generate-icons`
2. Verify data consistency: `node scripts/pre-commit-check.js`
3. Sync data if needed: `npm run sync-icons`
4. Clear browser cache and restart dev server

### Invalid Icons Warning
If you see warnings about invalid icons:
1. Check the stera-icons package version
2. Verify the icon name is correct
3. Update stera-icons if needed
4. Regenerate icon data

### Data Inconsistency
If src and public data don't match:
1. Run `npm run sync-icons` to fix
2. Check for file permission issues
3. Verify both directories exist

## File Structure
```
scripts/
├── generate-icons.js    # Main generation script with validation
├── sync-icons.js        # Sync script for data consistency
└── pre-commit-check.js  # Pre-commit validation script

src/data/
└── icons.json          # Source of truth for icon data

public/data/
└── icons.json          # Frontend-accessible icon data
```

## Best Practices

1. **Always regenerate after package updates**: `npm run generate-icons`
2. **Don't manually edit icon data files**: Use the generation script
3. **Check for warnings**: Pay attention to console output during generation
4. **Test after changes**: Verify icons load correctly in the application
5. **Use version control**: Commit both src and public data files together
