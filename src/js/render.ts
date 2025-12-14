import headerHtml from '../components/header.html?raw';
import footerHtml from '../components/footer.html?raw';
import toolPageHtml from '../pages/tool.html?raw';
import { setupThemeToggle } from './theme.ts';
import { siteConfig } from '../config';
import type { Tool } from './types.ts';

export function renderLayout(content: string) {
  const app = document.getElementById('app')!;
  app.innerHTML = headerHtml + content + footerHtml;
  setupThemeToggle();

  const footerText = document.getElementById('footer-text');
  if (footerText) footerText.innerHTML = siteConfig.footerText || '';
  const headerTitle = document.getElementById('header-title');
  if (headerTitle) headerTitle.innerHTML = siteConfig.title;
  const headerDescription = document.getElementById('header-description');
  if (headerDescription) headerDescription.innerHTML = siteConfig.description || '';
}

export function renderTool(tool: Tool | undefined) {
  renderLayout(toolPageHtml);

  const noToolHtml = `
    <div class="container mx-auto px-4 py-16 text-center">
      <h2 class="text-2xl text-heading">Tool not found</h2>
    </div>`;
  const contentDiv = document.getElementById('tool-content')!;
  contentDiv.innerHTML = tool ? tool.html : noToolHtml;

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
