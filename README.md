# Gallery Master

A modern Chrome extension that extracts and displays all images from any webpage in a clean, gallery-style modal overlay.

## Features

- 🖼️ Extract all images from anchor links and img tags on any webpage
- 🔍 Smart filtering: Only shows images larger than 100x100px (GIFs of any size allowed)
- 🎨 Clean, responsive gallery grid layout
- 🛡️ Shadow DOM isolation to prevent CSS conflicts with host pages
- ⚡ Built with modern technologies: React 18, TypeScript, Vite, Tailwind CSS

## Development

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server with hot-reload:

```bash
pnpm dev
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

The extension will automatically rebuild when you make changes to the source code.

## Building for Production

Create a production-optimized build:

```bash
pnpm build
```

This runs TypeScript type checking and creates an optimized build in the `dist` folder.

## Packaging for Distribution

Create a zip file ready for Chrome Web Store submission:

```bash
pnpm package
```

This will create a `gallery-master.zip` file in the project root.

## Project Structure

```
gallery-master/
├── src/
│   ├── background.ts       # Background service worker
│   ├── content.tsx         # Content script with Shadow DOM
│   ├── GalleryOverlay.tsx  # Main gallery UI component
│   └── styles.css          # Tailwind CSS styles
├── assets/
│   └── icon512.png         # Extension icon
├── manifest.json           # Chrome extension manifest (MV3)
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 6** - Fast build tool
- **Tailwind CSS 3** - Utility-first CSS
- **@crxjs/vite-plugin** - Chrome extension support for Vite
- **Shadow DOM** - Style isolation to prevent conflicts

## How It Works

1. Click the extension icon in your browser toolbar
2. The content script scans the current page for:
   - All `<img>` tags
   - All `<a>` tags linking to image files (jpg, jpeg, png, gif, webp)
3. Images are filtered by size (>100x100px, all GIFs allowed)
4. A modal overlay displays all found images in a responsive grid
5. Press ESC or click the close button to dismiss

## License

MIT

## Author

saisandeepvaddi
