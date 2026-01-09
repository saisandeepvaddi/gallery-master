# Migration Guide - Plasmo to Vite

This document outlines the major changes made during the modernization of Gallery Master from Plasmo to a vanilla Chrome extension with Vite.

## What Changed

### 1. Build System
- **Before**: Plasmo framework (v0.45.2 from 2022)
- **After**: Vite 6 with @crxjs/vite-plugin
- **Why**: Plasmo was overkill for this small extension. Vite provides faster builds, better dev experience, and full control over the build process.

### 2. Dependencies Upgraded
All dependencies were upgraded to their latest versions:

| Package | Old Version | New Version |
|---------|-------------|-------------|
| React | 18.2.0 | 18.3.1 |
| TypeScript | 4.7.4 | 5.9.3 |
| Tailwind CSS | 3.1.4 | 3.4.19 |
| @types/chrome | 0.0.191 | 0.0.280 |

### 3. Removed Dependencies
- `@radix-ui/react-dialog` - Replaced with custom modal
- `@radix-ui/react-icons` - Replaced with inline SVG
- `@stitches/react` - Replaced with Tailwind CSS
- `plasmo` - Removed framework entirely
- `@trivago/prettier-plugin-sort-imports` - Removed

### 4. File Structure Changes

**Before**:
```
gallery-master/
├── background.ts           (root)
├── messenger.ts            (root)
├── contents/overlay.tsx
└── style.css              (root)
```

**After**:
```
gallery-master/
├── src/
│   ├── background.ts
│   ├── content.tsx
│   ├── GalleryOverlay.tsx
│   └── styles.css
└── manifest.json
```

### 5. Shadow DOM Implementation

**Critical Fix**: The styling issues you experienced were caused by CSS conflicts between the host page and the extension's React components.

**Solution**: Implemented Shadow DOM encapsulation in [content.tsx](src/content.tsx):
- The React app now renders inside a Shadow DOM
- All extension styles are isolated from the host page
- Host page styles cannot affect the gallery overlay
- This prevents button styling issues and other conflicts

### 6. Component Changes

#### Background Script ([background.ts](src/background.ts))
- Removed Plasmo-specific imports and types
- Simplified message sending (no need for `messenger.ts` helper)
- Cleaner, more straightforward code

#### Content Script ([content.tsx](src/content.tsx))
- **New file** that replaces `contents/overlay.tsx`
- Creates Shadow DOM for style isolation
- Manages React root lifecycle
- Handles message passing from background script

#### Gallery Component ([GalleryOverlay.tsx](src/GalleryOverlay.tsx))
- Removed Radix UI dependencies
- Removed Stitches CSS-in-JS
- Now uses Tailwind CSS classes directly
- Custom modal implementation (no external lib needed)
- Added loading state
- Added empty state
- Improved TypeScript typing
- Better keyboard support (ESC to close)
- Click outside to close

### 7. Manifest Changes
- Now manually maintained in project root
- Chrome Manifest V3 compliant
- Removed unused permissions (downloads, storage, webRequest)
- Only keeps essential permissions: activeTab, tabs

### 8. Build Scripts

**New package.json scripts**:
```json
{
  "dev": "vite build --watch --mode development",
  "build": "tsc --noEmit && vite build",
  "preview": "vite build --mode development",
  "package": "pnpm build && cd dist && zip -r ../gallery-master.zip .",
  "type-check": "tsc --noEmit"
}
```

### 9. Configuration Files

All config files were modernized:

- **tsconfig.json**: Updated to ES2020, modern module resolution
- **tailwind.config.js**: Simplified, ES modules
- **postcss.config.js**: Added autoprefixer
- **vite.config.ts**: New build configuration

## Breaking Changes

### For Users
- None! The extension works exactly the same from a user perspective
- **Actually better**: No more styling conflicts thanks to Shadow DOM

### For Developers
- Different build process (Vite instead of Plasmo)
- Different file structure (src/ directory)
- No Plasmo-specific APIs or types
- Manual manifest.json management

## Benefits

1. **Faster builds**: Vite is significantly faster than Plasmo
2. **Better dev experience**: Hot reload, better error messages
3. **Style isolation**: Shadow DOM prevents CSS conflicts
4. **Simpler code**: No framework abstractions
5. **Modern dependencies**: All packages up to date
6. **Full control**: No hidden build magic
7. **Smaller bundle**: Removed unnecessary dependencies
8. **Better TypeScript**: Stricter typing, modern features

## Testing Checklist

After migration, verify:

- [ ] Extension loads without errors
- [ ] Icon click opens the gallery modal
- [ ] Images are extracted from the page
- [ ] Images are filtered by size correctly
- [ ] GIFs of any size are included
- [ ] Modal styling looks correct (no conflicts)
- [ ] Buttons are properly styled
- [ ] Close button works
- [ ] ESC key closes the modal
- [ ] Click outside closes the modal
- [ ] Loading state displays
- [ ] Empty state displays when no images found
- [ ] Grid layout is responsive
- [ ] Hover effects work on images

## Rollback Plan

If you need to rollback:

```bash
git checkout main
pnpm install
pnpm dev
```

The old Plasmo-based version is preserved in the `main` branch.

## Next Steps

Consider these enhancements now that the foundation is modernized:

1. Add image download functionality
2. Add image preview/lightbox
3. Add filtering options (by size, format)
4. Add sorting options
5. Add search/filter UI
6. Store user preferences
7. Add keyboard navigation
8. Support for more image formats
9. Performance optimizations for pages with many images
10. Chrome Web Store publication

## Questions?

If you encounter any issues with the migration, check:

1. `pnpm install` completed successfully
2. `pnpm build` produces no errors
3. The `dist/` folder is loaded in Chrome (not the project root)
4. Developer mode is enabled in Chrome extensions page
