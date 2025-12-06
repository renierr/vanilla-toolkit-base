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
      <a href="#${tool.path}" class="block p-6 bg-white rounded-xl shadow hover:shadow-2xl transition-all border-2 ${
                    tool.draft ? 'border-yellow-400' : 'border-gray-200'
                }">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold text-gray-800">${tool.name}</h3>
            <p class="text-gray-600 mt-1">${tool.description}</p>
          </div>
          ${tool.draft ? '<span class="text-xs bg-yellow-400 text-black px-3 py-1 rounded-full font-medium">DRAFT</span>' : ''}
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
        renderLayout('<div class="container mx-auto px-4 py-16 text-center"><h2 class="text-2xl">Tool not found</h2></div>')
        return
    }

    renderLayout(toolPageHtml)

    const contentDiv = document.getElementById('tool-content')!
    contentDiv.innerHTML = tool.html

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

// Start + hash changes
window.addEventListener('hashchange', router)
window.addEventListener('load', router)
router() // immediately on load
