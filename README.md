# Stera Icons Showcase

A modern, responsive website to showcase all icons from the [stera-icons](https://www.npmjs.com/package/stera-icons) package. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **728+ Icons**: Browse all available icons from the stera-icons package
- 🔍 **Smart Search**: Search icons by name or tags
- 🏷️ **Category Filtering**: Filter icons by categories like Navigation, User, Settings, etc.
- 🏷️ **Tag Filtering**: Filter by specific tags like 'filled', 'outline', 'arrow', etc.
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark Mode**: Automatic dark mode support
- 📋 **Copy Code**: Copy import statements and usage examples
- 📥 **Download SVG**: Download individual icons as SVG files
- ⚡ **Fast Loading**: Optimized for performance with tree-shaking
- 🔄 **Auto-Update**: Easy to update when the stera-icons package is updated

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: stera-icons, lucide-react
- **Package Manager**: pnpm
- **Deployment**: Vercel, GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Stera-Site.git
cd Stera-Site
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Updating Icons

When the stera-icons package is updated:

1. Update the package:
```bash
pnpm update stera-icons
```

2. The website will automatically reflect the new icons since it dynamically loads all icons from the package.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push to main branch

The `vercel.json` file is already configured for optimal deployment.

### GitHub Pages

1. Enable GitHub Pages in your repository settings
2. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on every push to main branch

### Manual Deployment

1. Build the project:
```bash
pnpm build
```

2. The static files will be in the `out/` directory
3. Deploy the `out/` directory to any static hosting service

## Configuration

### For GitHub Pages

The project is configured to work with GitHub Pages out of the box. The `next.config.ts` file includes:

- Static export configuration
- Base path for GitHub Pages
- Asset prefix for proper resource loading

### For Custom Domain

If deploying to a custom domain, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for custom domain
};
```

## Customization

### Adding New Categories

Edit `src/utils/iconData.ts` and update the `getCategory` function to add new category logic.

### Modifying Tags

Update the `generateTags` function in `src/utils/iconData.ts` to modify how tags are generated for icons.

### Styling

The project uses Tailwind CSS. Modify `src/app/globals.css` for global styles or update component classes for specific styling.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Icons from [stera-icons](https://www.npmjs.com/package/stera-icons) by [Chaz Giese](https://github.com/chazgiese)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
