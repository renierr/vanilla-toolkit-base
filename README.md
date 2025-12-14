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
├── config.json     # Name + description + configuration
├── template.html   # Your layout
└── index.ts        # Your logic (optional)
```

## Ordering & Section grouping (Overview page)

Tools can be **sorted** and **grouped into sections** on the overview page by adding two optional fields to a tool’s `config.json`:

- `order` *(number)*: controls the position within a section (ascending)
- `sectionId` *(string)*: groups tools into a named section

### Example `config.json`

```json
{ "name": "My Tool", "description": "Does something useful", "draft": false, "example": false, "sectionId": "examples", "order": 1 }
```

### How sorting works

- Tools are sorted by:
    1. `order` (ascending)
    2. `name` (A → Z) as a tie-breaker

This means you can keep the list stable and intentional, even when multiple tools share the same `order`.

### How sections work

- Tools with the same `sectionId` are rendered under the same section header.
- Section header text (title + optional description) is configured in the site config (see below).
- If a tool has a `sectionId` that is **not configured**, the UI falls back to showing the raw `sectionId` as the section title.
- If a tool has **no** `sectionId`, it is grouped into a default “other” section.

### Configure section titles via `SiteConfig`

Section titles and descriptions live in the site configuration.

1. Copy the template config:
    - `src/config/site.config.template.ts` → `src/config/site.config.ts`
2. Define your sections (keys are the `sectionId`s):

```ts
export const siteConfig = { 
  // ... 
  toolSections: { 
      examples: { title: 'Examples', description: 'Demo tools that show how the template works.', }, 
      general: { title: 'General', description: 'Everyday helpers and utilities.', }, 
  }, 
};
```
**Section order:**  
Sections are rendered in the insertion order of `toolSections` first, followed by any additional sections discovered at runtime.




## Tool Icons (Lucide)

Each tool can optionally define an icon in its `config.json`.
Only a set of predefined icons is supported.

If `icon` is missing or unknown, a default icon is used.

### Available icon ids

Use one of the following (case-insensitive):

- `wrench`
- `settings`
- `sliders`
- `hammer`
- `ruler`
- `calculator`
- `clipboard`
- `copy`
- `scantext`
- `filetext`
- `filejson`
- `filecode`
- `folder`
- `search`
- `filter`
- `list`
- `grid`
- `download`
- `upload`
- `share`
- `link`
- `shield`
- `lock`
- `key`
- `info`
- `help`
- `warning`
- `success`
- `error`
- `sparkles`

### Register custom icons (derived projects)

This template exposes an icon registry so derived projects can add (or override) icon IDs without editing `src/js/tool-icons.ts`.

1) Import `registerToolIcons` in your entry file (e.g. `src/script.ts`).

2) Import any additional icons you want from `lucide`.

3) Register them at once during startup.

```ts
import { registerToolIcons } from 
        './src/js/tool-icons';
import { ArrowLeft } from '@lucide/icons';
    
registerToolIcons({
    arrowleft: ArrowLeft,
    // add more icons here
});
```

Now you can reference your new icon IDs from any tool `config.json`:

```json
{ "name": "My Tool", "description": "Does something useful", "icon": "brain" }
```

Notes:
- IDs are normalized (trimmed + lowercased), so `Brain`, `brain`, and `  BRAIN  ` all match.
- If an ID is unknown, the renderer falls back to a default icon.
- If you register an existing ID, it will override the built-in icon for that ID.


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

