import headerHtml from './components/header.html?raw'
import footerHtml from './components/footer.html?raw'
import overviewHtml from './pages/overview.html?raw'
import toolPageHtml from './pages/tool.html?raw'

interface Tool {
    name: string
    description: string
    path: string
    html: string
    script?: () => void
    draft: boolean
}

const app = document.getElementById('app')!
const isDev = import.meta.env.DEV

// Load all tools dynamically
const descModules = import.meta.glob('./tools/*/description.json', { eager: true })
const htmlModules = import.meta.glob('./tools/*/template.html', { query: '?raw', import: 'default', eager: true })
const scriptModules = import.meta.glob('./tools/*/index.ts', { eager: true })

const tools: Tool[] = []

for (const path in descModules) {
    const desc = (descModules[path] as any).default as {
        name?: string
        description?: string
        draft?: boolean
    }

    const folder = path.match(/\.\/tools\/([^/]+)\//)![1]

    // Draft-Tools im Production ausblenden
    if (desc.draft && !isDev) continue

    const html = (htmlModules[`./tools/${folder}/template.html`] as string) || '<p>No content found</p>'
    const initScript = (scriptModules[`./tools/${folder}/index.ts`] as any)?.default as (() => void) | undefined

    tools.push({
        name: desc.name || folder,
        description: desc.description || 'No description',
        path: folder,
        html,
        script: initScript,
        draft: !!desc.draft
    })
}

// === Rendering functions ===
function renderLayout(content: string) {
    app.innerHTML = headerHtml + content + footerHtml

    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const mode = saved || getSystemTheme()
    setTheme(mode)

    const btn = document.getElementById('theme-toggle')
    if (btn) {
        btn.addEventListener('click', () => {
            const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            setTheme(current === 'dark' ? 'light' : 'dark')
        })
    }
}

function renderOverview() {
    renderLayout(overviewHtml)

    const grid = document.getElementById('tools-grid')!
    const searchInput = document.getElementById('search') as HTMLInputElement

    function filterAndRender() {
        const term = searchInput.value.toLowerCase()
        const filtered = tools.filter(t =>
            t.name.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term)
        )

        grid.innerHTML = filtered
            .map(
                tool => `
  <a href="#${tool.path}" class="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl transition-all border-l-4 ${
                tool.draft ? 'border-l-yellow-400 dark:border-l-yellow-500' : 'border-l-blue-500 dark:border-l-blue-400'
            } border-t border-r border-b border-gray-100 dark:border-slate-700">
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">${tool.name}</h3>
        <p class="text-gray-600 dark:text-slate-300 mt-2 text-sm">${tool.description}</p>
      </div>
      ${tool.draft ? '<span class="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full font-medium whitespace-nowrap">DRAFT</span>' : ''}
    </div>
  </a>
`
            )
            .join('')
    }

    searchInput?.addEventListener('input', filterAndRender)
    filterAndRender()
}

function renderTool(toolPath: string) {
    const tool = tools.find(t => t.path === toolPath)

    if (!tool) {
        renderLayout('<div class="container mx-auto px-4 py-16 text-center"><h2 class="text-2xl text-gray-900 dark:text-white">Tool not found</h2></div>')
        return
    }

    renderLayout(toolPageHtml)

    const contentDiv = document.getElementById('tool-content')!
    contentDiv.innerHTML = tool.html

    // Back button
    const backBtn = document.getElementById('back-btn')
    if (backBtn) {
        backBtn.addEventListener('click', () => history.back())
    }

    // call Tool-specific script (if exist)
    tool.script?.()
}

// === Routing with hash ===
function router() {
    const hash = location.hash.slice(1) // without #
    if (hash) {
        renderTool(hash)
    } else {
        renderOverview()
    }
}

// === Theme Switch ===
function setTheme(mode: 'dark' | 'light') {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem('theme', mode)
    const icon = document.getElementById('theme-toggle-icon')
    if (icon) icon.textContent = mode === 'dark' ? '🌙' : '☀️'
}

function getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Start + hash changes
window.addEventListener('hashchange', router)
window.addEventListener('load', router)
router() // immediately on load
