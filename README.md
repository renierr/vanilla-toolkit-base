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
```

### Site configuration override

The default configuration lives in `src/config/site.config.template.ts`.     
To customize the configuration for your project, copy the file to the Name `site.config.ts` and change any configuration values.
See types in `src/config/site.config.ts` for possible values.

---

## Template Placeholders

Brief and practical:

- Syntax: Use `{{ key.path }}` inside your HTML templates, e.g. `{{ config.title }}`.
- When they are replaced: Placeholders are replaced by the central function `replacePlaceholders()` (see `src/js/utils.ts`). In this codebase the header and footer templates are processed before being inserted into the DOM (`src/js/render.ts`).
- Where the values come from: Values are read from the exported `siteContext` in `src/config/index.ts`. `siteContext` merges the defaults from `site.config.template.ts` with an optional `src/config/site.config.ts` file.
- How it works: `replacePlaceholders()` uses the regex `/\{\{(.+?)\}\}/g`, trims the path and resolves the value using dot-notation with `getValueByDotNotation()`.
- Missing values: If a placeholder cannot be resolved, a console warning is emitted and the placeholder is replaced with a visible marker such as `[{{...} NOT FOUND]` to make the issue obvious.
- Note about tool templates: Tool-specific templates (`src/tools/*/template.html`) are loaded in `src/script.ts` and are currently not automatically processed with `replacePlaceholders()` before insertion. If you want placeholders in tool templates, call `replacePlaceholders(toolHtml, siteContext)` before inserting the HTML.

Example (Template → Result):

```html
<!-- Template -->
<h1>{{ config.title }}</h1>

<!-- After replacement -->
<h1>Vanilla Toolkit</h1>
```

