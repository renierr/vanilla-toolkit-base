# Vanilla Toolkit

Minimalistic, lightning-fast tool collection  
Vite + TypeScript + Tailwind – **no React, no framework**

## Features
- Add new tools via folder → appear automatically
- Search function with live filter
- Unified design with header & footer
- 100% offline-capable

## Dark/Light Mode

All tools automatically support light and dark mode via **Tailwind CSS class strategy**.

The theme is controlled by the `dark` class on `<html>`:
- **Light mode**: `<html>` (no class)
- **Dark mode**: `<html class="dark">`

Users can toggle via the theme button in the header. The preference is saved in localStorage.

### Configure Dark Mode in Your Tool Templates

Use Tailwind's `dark:` prefix for dark mode styles:

```html
<!-- Light: white bg, Dark: slate-800 bg -->
<div class="bg-white dark:bg-slate-800">
  <!-- Light: gray-900 text, Dark: white text -->
  <p class="text-gray-900 dark:text-white">Content</p>
</div>
```

**Common Color Pairs:**
| Light | Dark | Use Case |
|-------|------|----------|
| `bg-white` | `dark:bg-slate-800` | Cards, panels |
| `bg-gray-50` | `dark:bg-slate-900` | Backgrounds |
| `text-gray-900` | `dark:text-white` | Headings, main text |
| `text-gray-600` | `dark:text-slate-300` | Secondary text |
| `border-gray-200` | `dark:border-slate-700` | Borders |
| `bg-blue-600` | `dark:bg-blue-500` | Buttons, accents |

**Focus & Hover States:**
```html
<input class="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
<button class="hover:bg-blue-700 dark:hover:bg-blue-600">Click</button>
```

## Create a new tool (30 seconds)
```bash
src/tools/my-tool/
├── description.json     # Name + description
├── template.html        # Your layout
└── index.ts             # Your logic (optional)
