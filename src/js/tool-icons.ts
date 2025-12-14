import { createElement } from 'lucide';
import {
  Wrench,
  Settings,
  SlidersHorizontal,
  Hammer,
  Ruler,
  Calculator,
  Clipboard,
  Copy,
  ScanText,
  FileText,
  FileJson,
  FileCode2,
  Folder,
  Search,
  Filter,
  List,
  Grid3X3,
  Download,
  Upload,
  Share2,
  Link,
  Shield,
  Lock,
  KeyRound,
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide';

const DEFAULT_ICON_ID = 'wrench';

/**
 * Extensible icon registry:
 * - The template registers a default set of icons below (works out of the box).
 * - Derived projects can register additional icons via registerToolIcons(...)
 *   without forking this file.
 */
type LucideIcon = Parameters<typeof createElement>[0];
type IconRegistry = Record<string, LucideIcon>;
const ICONS: IconRegistry = Object.create(null);

function normalizeIconId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Register additional icons (or override existing IDs).
 *
 * Example (in a derived project entry file):
 *   import { registerToolIcons } from './js/tool-icons';
 *   import { AlarmClock } from 'lucide';
 *   registerToolIcons({ alarmclock: AlarmClock });
 */
export function registerToolIcons(extra: IconRegistry): void {
  for (const [id, icon] of Object.entries(extra)) {
    ICONS[normalizeIconId(id)] = icon;
  }
}
/**
 * Return all currently registered icon IDs (including derived-project registrations).
 * The list is sorted for stable display in demos and docs.
 */
export function getRegisteredToolIconIds(): string[] {
  return Object.keys(ICONS).sort((a, b) => a.localeCompare(b));
}

/**
 * Optional: template-side typing for known built-in icons.
 * Derived projects can still pass any string icon ID from config.
 */
export type ToolIconId =
  | 'wrench'
  | 'settings'
  | 'sliders'
  | 'hammer'
  | 'ruler'
  | 'calculator'
  | 'clipboard'
  | 'copy'
  | 'scantext'
  | 'filetext'
  | 'filejson'
  | 'filecode'
  | 'folder'
  | 'search'
  | 'filter'
  | 'list'
  | 'grid'
  | 'download'
  | 'upload'
  | 'share'
  | 'link'
  | 'shield'
  | 'lock'
  | 'key'
  | 'info'
  | 'help'
  | 'warning'
  | 'success'
  | 'error'
  | 'sparkles';

// Register built-in template icons
registerToolIcons({
  // General / tools
  wrench: Wrench,
  settings: Settings,
  sliders: SlidersHorizontal,
  hammer: Hammer,
  ruler: Ruler,

  // Data / text
  calculator: Calculator,
  clipboard: Clipboard,
  copy: Copy,
  scantext: ScanText,
  filetext: FileText,
  filejson: FileJson,
  filecode: FileCode2,
  folder: Folder,

  // UI / navigation
  search: Search,
  filter: Filter,
  list: List,
  grid: Grid3X3,

  // IO / sharing
  download: Download,
  upload: Upload,
  share: Share2,
  link: Link,

  // Security
  shield: Shield,
  lock: Lock,
  key: KeyRound,

  // Status / info
  info: Info,
  help: HelpCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,

  // Fun / highlight
  sparkles: Sparkles,
});

export function renderToolIconSvg(iconId?: string, className = 'w-6 h-6'): string {
  const normalized = iconId ? normalizeIconId(iconId) : '';
  const picked = ICONS[normalized] ?? ICONS[DEFAULT_ICON_ID];

  // If even the default icon is not registered, render nothing.
  if (!picked) return '';

  const svgEl = createElement(picked, {
    class: className,
    'aria-hidden': 'true',
    focusable: 'false',
  });

  return new XMLSerializer().serializeToString(svgEl);
}
