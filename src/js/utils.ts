export const isDev = Boolean(import.meta.env.DEV);

export const fuzzyScore = (text: string, term: string): number => {
  if (term === '') return 0;
  text = text.toLowerCase();
  term = term.toLowerCase();

  let score = 0;
  let termIndex = 0;

  for (const char of text) {
    if (char === term[termIndex]) {
      score += 1 - termIndex * 0.1;
      termIndex++;
      if (termIndex === term.length) return score;
    }
  }
  return termIndex === term.length ? score : -Infinity;
};

function getValueByDotNotation(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && current.hasOwnProperty(key)) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  if (current === undefined || current === null) {
    return undefined;
  }
  return String(current);
}

export const replacePlaceholders = (templateHtml: string, context: any): string => {
  const placeholderRegex = /\{\{(.+?)\}\}/g;

  let output = templateHtml;

  output = output.replace(placeholderRegex, (match, keyPath) => {
    const trimmedPath = keyPath.trim();
    const value = getValueByDotNotation(context, trimmedPath);

    if (value !== undefined) {
      return value;
    } else {
      console.warn(`Placeholder not found in context: ${match}`);
      return `[${match} NOT FOUND]`;
    }
  });
  return output;
};

export type MessageType = 'info' | 'warning' | 'alert';

function classesForType(type: MessageType) {
  switch (type) {
    case 'alert':
      return { wrap: 'msg-wrap-alert', badge: 'msg-badge-alert' };
    case 'warning':
      return { wrap: 'msg-wrap-warning', badge: 'msg-badge-warning' };
    case 'info':
    default:
      return { wrap: 'msg-wrap-info', badge: 'msg-badge-info' };
  }
}

export function showProgress(message: string, options = { visible: true }) {
  const el = document.getElementById('ui-progress');
  const textEl = document.getElementById('ui-progress-text');
  if (!el || !textEl) return;

  const visible = options && typeof options.visible === 'boolean' ? options.visible : true;
  textEl.textContent = (message ?? 'Working…').toString();

  el.classList.toggle('hidden', !visible);
  el.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

export function hideProgress() {
  showProgress('', { visible: false });
}

export function showMessage(message: string, type: MessageType) {
  const host = document.getElementById('ui-messages');
  if (!host) return;

  const msgType = type || 'info';
  const c = classesForType(msgType);

  const item = document.createElement('div');
  item.className =
    'pointer-events-auto w-full max-w-xl rounded-xl border shadow-lg backdrop-blur px-4 py-3 flex gap-3 items-start ' +
    c.wrap;

  item.setAttribute('role', msgType === 'info' ? 'status' : 'alert');

  const badge = document.createElement('span');
  badge.className =
    'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ' +
    c.badge;
  badge.textContent = msgType.toUpperCase();

  const text = document.createElement('div');
  text.className = 'flex-1 text-sm leading-relaxed';
  text.textContent = (message ?? '').toString();

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className =
    'ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition';
  closeBtn.setAttribute('aria-label', 'Close message');
  closeBtn.innerHTML = '&#10005;';

  function close() {
    item.remove();
  }
  closeBtn.addEventListener('click', close);

  item.appendChild(badge);
  item.appendChild(text);
  item.appendChild(closeBtn);

  host.appendChild(item);

  return { close };
}
