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

const DEFAULT_ICON = 'wrench';

const ICONS = {
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
} as const;

export type ToolIconId = keyof typeof ICONS;

function normalizeIconId(id: string): string {
  return id.trim().toLowerCase();
}

export function renderToolIconSvg(iconId?: string, className = 'w-6 h-6'): string {
  const normalized = iconId ? normalizeIconId(iconId) : '';
  const picked = (normalized in ICONS ? (normalized as ToolIconId) : DEFAULT_ICON) as ToolIconId;

  const svgEl = createElement(ICONS[picked], {
    class: className,
    'aria-hidden': 'true',
    focusable: 'false',
  });

  return new XMLSerializer().serializeToString(svgEl);
}
