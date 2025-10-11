# Stera Icons Showcase

Showcase all icons from the [stera-icons](https://www.npmjs.com/package/stera-icons) package. Built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: stera-icons
- **Package Manager**: pnpm
- **Deployment**: Vercel, GitHub Pages

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── FilterTabs.tsx     # Category and tag filters
│   ├── IconCard.tsx       # Individual icon card
│   ├── IconDetailModal.tsx # Icon detail modal
│   ├── IconGrid.tsx       # Grid of icons
│   └── SearchBar.tsx      # Search input
├── types/                 # TypeScript types
│   └── icon.ts           # Icon-related types
└── utils/                 # Utility functions
    └── iconData.ts       # Icon data generation and filtering
```

## Package Version

Currently using **stera-icons v5.0.2** (updated October 2025)

### What's New in v5.0.2

- **Enhanced Metadata**: All icon variants now include comprehensive metadata (tags, version info, timestamps)
- **Icon Suffix**: All icons have an `Icon` suffix (e.g., `SearchIcon`, `HeartIcon`)
- **Variant Prop**: Use `variant="regular" | "bold" | "filled"` prop instead of separate components
- **1665+ Icons**: Comprehensive icon library with Regular, Bold, and Filled variants
- **Better Search**: Rich tags enable more accurate icon discovery
- **Tree-shakeable**: Import only the icons you need
- **TypeScript Support**: Full type safety and IntelliSense

### Usage Example

```tsx
import { SearchIcon, HeartIcon } from 'stera-icons';

// Regular variant (default)
<SearchIcon size={24} />

// Bold variant
<SearchIcon variant="bold" size={24} />

// Filled variant
<HeartIcon variant="filled" size={24} color="red" />
```

## Updating Icons

When the stera-icons package is updated:

1. Update the package:
```bash
pnpm update stera-icons --latest
```

2. Regenerate icon data:
```bash
pnpm run generate-icons
```

3. The website will automatically reflect the new icons since it dynamically loads all icons from the package.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Icons from [stera-icons](https://www.npmjs.com/package/stera-icons) by [Chaz Giese](https://github.com/chazgiese)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
