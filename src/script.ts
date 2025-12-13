import overviewHtml from './pages/overview.html?raw';
import { isDev } from './js/utils.ts';
import type { Tool } from './js/types';
import { siteConfig } from './config';
import { renderLayout, renderTool } from './js/render.ts';

// apply config values
document.title = siteConfig.title;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.setAttribute('content', siteConfig.description || '');

// Load all tools dynamically
const descModules = import.meta.glob('./tools/*/description.json', { eager: true });
const htmlModules = import.meta.glob('./tools/*/template.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const scriptModules = import.meta.glob('./tools/*/index.ts', { eager: true });

const tools: Tool[] = [];

for (const path in descModules) {
  const desc = (descModules[path] as any).default as {
    name?: string;
    description?: string;
    draft?: boolean;
  };

  const folder = path.match(/\.\/tools\/([^/]+)\//)![1];

  if (desc.draft && !isDev) continue;
  const html =
    (htmlModules[`./tools/${folder}/template.html`] as string) ||
    '<p>No content found, provide a template.html file for your tool</p>';
  const initScript = (scriptModules[`./tools/${folder}/index.ts`] as any)?.default as
    | (() => void)
    | undefined;

  tools.push({
    name: desc.name || folder,
    description: desc.description || 'No description',
    path: folder,
    html,
    script: initScript,
    draft: !!desc.draft,
  });
}

function renderOverview() {
  renderLayout(overviewHtml);

  const grid = document.getElementById('tools-grid')!;
  const searchInput = document.getElementById('search') as HTMLInputElement;

  function filterAndRender() {
    const term = searchInput.value.toLowerCase();
    const filtered = tools.filter(
      (t) => t.name.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)
    );

    grid.innerHTML = filtered
      .map(
        (tool) => `
    <a href="#${tool.path}" class="block p-6 bg-card rounded-xl shadow hover:shadow-xl transition-all border-l-4 ${
      tool.draft ? 'border-l-draft' : 'border-l-primary'
    } border-t border-r border-b border-card">
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-card-title">${tool.name}</h3>
          <p class="text-card-desc mt-2 text-sm">${tool.description}</p>
        </div>
        ${
          tool.draft
            ? '<span class="text-xs bg-draft text-draft px-3 py-1 rounded-full font-medium whitespace-nowrap">DRAFT</span>'
            : ''
        }
      </div>
    </a>
  `
      )
      .join('');
  }

  searchInput?.addEventListener('input', filterAndRender);
  filterAndRender();
}

// === Routing with hash ===
function router() {
  const hash = location.hash.slice(1); // without #
  if (hash) {
    const tool = tools.find((t) => t.path === hash);
    renderTool(tool);
  } else {
    renderOverview();
  }
}

// Start + hash changes
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
router(); // immediately on load
