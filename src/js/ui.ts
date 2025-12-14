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

type ShowProgressOptions = {
  /**
   * Initial visibility (optional). Default: true
   */
  visible?: boolean;
  /**
   * Auto-close after N ms (optional). Example: 5000
   */
  timeoutMs?: number;
  /**
   * Show a close button if progress is still visible after N ms (optional).
   * Example: 3000
   */
  tooLongMs?: number;
};

let progressAutoCloseTimer: number | null = null;
let progressTooLongTimer: number | null = null;
let progressCloseWired = false;

function clearProgressTimers() {
  if (progressAutoCloseTimer !== null) {
    window.clearTimeout(progressAutoCloseTimer);
    progressAutoCloseTimer = null;
  }
  if (progressTooLongTimer !== null) {
    window.clearTimeout(progressTooLongTimer);
    progressTooLongTimer = null;
  }
}

function hideProgressCloseButton(closeEl: HTMLButtonElement | null) {
  if (!closeEl) return;
  closeEl.classList.add('hidden');
  closeEl.classList.remove('inline-flex');
}

function showProgressCloseButton(closeEl: HTMLButtonElement | null) {
  if (!closeEl) return;
  closeEl.classList.remove('hidden');
  closeEl.classList.add('inline-flex');
}

export function showProgress(message: string, options: ShowProgressOptions = { visible: true }) {
  const el = document.getElementById('ui-progress');
  const textEl = document.getElementById('ui-progress-text');
  const closeEl = document.getElementById('ui-progress-close') as HTMLButtonElement | null;
  if (!el || !textEl) return;

  const visible = options?.visible ?? true;
  textEl.textContent = (message ?? 'Working…').toString();

  // Toggle visibility
  el.classList.toggle('hidden', !visible);
  el.setAttribute('aria-hidden', visible ? 'false' : 'true');

  // Wire close button once
  if (!progressCloseWired && closeEl) {
    progressCloseWired = true;
    closeEl.addEventListener('click', () => hideProgress());
  }

  // When hiding: clear timers + hide close icon
  if (!visible) {
    clearProgressTimers();
    hideProgressCloseButton(closeEl);
    return;
  }

  // When showing: reset timers + hide close icon initially
  clearProgressTimers();
  hideProgressCloseButton(closeEl);

  // Auto-close after timeoutMs
  if (
    typeof options.timeoutMs === 'number' &&
    Number.isFinite(options.timeoutMs) &&
    options.timeoutMs > 0
  ) {
    progressAutoCloseTimer = window.setTimeout(() => {
      hideProgress();
    }, options.timeoutMs);
  }

  // Show a close icon if it takes too long
  if (
    closeEl &&
    typeof options.tooLongMs === 'number' &&
    Number.isFinite(options.tooLongMs) &&
    options.tooLongMs > 0
  ) {
    progressTooLongTimer = window.setTimeout(() => {
      const isHidden = el.classList.contains('hidden') || el.getAttribute('aria-hidden') === 'true';
      if (!isHidden) showProgressCloseButton(closeEl);
    }, options.tooLongMs);
  }
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

  const close = () => {
    item.remove();
  };
  closeBtn.addEventListener('click', close);

  item.appendChild(badge);
  item.appendChild(text);
  item.appendChild(closeBtn);

  host.appendChild(item);

  return { close };
}
