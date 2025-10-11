# Changelog

All notable changes to this project will be documented in this file.

## [v5.0.2] - 2025-10-11

### Updated

- **stera-icons**: Updated from v5.0.1 to v5.0.2
  - **Metadata Improvements**: All icon variants now have comprehensive metadata
  - Fixed metadata loading in `generate-icons.js` to properly map variant-specific metadata
  - All 1,665 icons now include proper tags, version information, and timestamps

### Fixed

- `generate-icons.js`: Fixed metadata mapping to use component name + variant key
  - Previously, only the last variant's metadata was retained for each icon
  - Now correctly loads metadata for regular, bold, and filled variants separately
- `IconDetailModal.tsx`: Updated to display correct component names and variant information
  - Shows proper import code (e.g., `import { AiIcon } from 'stera-icons'`)
  - Shows usage with variant prop (e.g., `<AiIcon variant="bold" />`)
  - Displays component name with variant badge in modal header

### Metadata Enhancements

The v5.0.2 package includes rich metadata for all icon variants:
- Full descriptive tags for searchability
- Version tracking (`versionAdded`, `dateAdded`, `lastModified`)
- SVG hash for change detection
- Variant information ("regular", "bold", "filled")

**Example metadata:**
```json
{
  "name": "ai",
  "variant": "bold",
  "tags": ["ai", "artificial intelligence", "automation", "bot", "machine learning"],
  "componentName": "AiIcon",
  "versionAdded": "5.0.2",
  "dateAdded": "2025-10-11T11:08:15.485Z"
}
```

## [v5.0.1] - 2025-10-11

### Updated

- **stera-icons**: Updated from v3.2.0 to v5.0.1
  - This is a major update with breaking changes to icon naming conventions
  - All icons now include an "Icon" suffix (e.g., `Ai` → `AiIcon`, `Search` → `SearchIcon`)
  - Variant naming pattern changed to `{Name}IconBold` and `{Name}IconFilled`

### Changed

- Updated all component imports to use new icon naming convention:
  - `page.tsx`: `AstriskAlt` → `AstriskAltIcon`
  - `IconDetailModal.tsx`: `XBold` → `XIconBold`, `CopyBold` → `CopyIconBold`, etc.
  - `SearchBar.tsx`: `Search` → `SearchIcon`, `XBold` → `XIconBold`
  - `FilterDropdown.tsx`: `ChevronDown` → `ChevronDownIcon`
  - `IconGrid.tsx`: `SquareDashedBold` → `SquareDashedIconBold`

- Updated `generate-icons.js` script:
  - Added helper functions to handle new icon naming convention
  - Skip `IconRegular` variants to avoid duplicates (555 icons)
  - Store both display name and component name in icon data

- Updated `iconRegistry.tsx`:
  - Added `getComponentName()` function to convert display names to component names
  - Maintains backward compatibility with existing display names

- Updated TypeScript types:
  - Added optional `componentName` field to `IconData` interface

### Added

- CHANGELOG.md to track version updates and changes
- Version badge in header updated to v5.0.1

### Stats

- Total icons: 1,665 (down from 2,220 after removing duplicate IconRegular variants)
- New icons in v5.0.1: 1,665 tagged as "*new*"
- Deprecated icons excluded: 3 (Checkmark variants)

## Migration Guide

If you're using this codebase as a reference, here's what changed:

### Before (v3.2.0)
```tsx
import { Search, XBold, CopyBold } from 'stera-icons';

<Search size={24} />
<XBold size={20} />
```

### After (v5.0.1)
```tsx
import { SearchIcon, XIcon, CopyIcon } from 'stera-icons';

<SearchIcon size={24} />
<SearchIcon variant="bold" size={24} />
<XIcon variant="bold" size={20} />
<CopyIcon variant="filled" size={20} />
```

### Icon Naming Pattern

- **Component Names**: All icons have `Icon` suffix (e.g., `SearchIcon`, `HeartIcon`, `XIcon`)
- **Variants**: Use the `variant` prop to specify the style:
  - `variant="regular"` (default)
  - `variant="bold"`
  - `variant="filled"`

### Alternative Import Approach

You can also import specific variants directly (though using the variant prop is recommended):
```tsx
import { SearchIconBold, SearchIconFilled } from 'stera-icons';

<SearchIconBold size={24} />
<SearchIconFilled size={24} />
```

