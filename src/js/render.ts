import headerHtml from '../components/header.html?raw';
import footerHtml from '../components/footer.html?raw';
import toolPageHtml from '../pages/tool.html?raw';
import { setupThemeToggle } from './theme.ts';
import { siteContext } from '../config';
import type { Tool } from './types.ts';
import { replacePlaceholders } from './utils.ts';

const headerFinal = replacePlaceholders(headerHtml, siteContext);
const footerFinal = replacePlaceholders(footerHtml, siteContext);

export function renderLayout(content: string) {
  const app = document.getElementById('app')!;
  app.innerHTML = headerFinal + replacePlaceholders(content, siteContext) + footerFinal;
  setupThemeToggle();
}

export function renderTool(tool: Tool | undefined) {
  renderLayout(toolPageHtml);

  const noToolHtml = `
    <h2 class="text-2xl text-heading">Tool not found</h2>
    `;
  const contentDiv = document.getElementById('tool-content')!;
  contentDiv.innerHTML = tool ? replacePlaceholders(tool.html, siteContext) : noToolHtml;

  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '';
    });
  }

  // call Tool-specific script (if exist)
  tool?.script?.();
}
