import { hideProgress, showMessage, showProgress } from '../../js/utils.ts';

export default function init() {
  const btnProgress = document.getElementById('demo-progress') as HTMLButtonElement | null;
  const btnInfo = document.getElementById('demo-info') as HTMLButtonElement | null;
  const btnWarning = document.getElementById('demo-warning') as HTMLButtonElement | null;
  const btnAlert = document.getElementById('demo-alert') as HTMLButtonElement | null;

  btnProgress?.addEventListener('click', () => {
    showProgress('Simulate work… please wait.');

    window.setTimeout(() => {
      hideProgress();
    }, 2000);
  });

  btnInfo?.addEventListener('click', () => showMessage('This is a tool Info-Message.', 'info'));
  btnWarning?.addEventListener('click', () =>
    showMessage('This is a warning – please check.', 'warning')
  );
  btnAlert?.addEventListener('click', () =>
    showMessage('This is an alert – something went wrong.', 'alert')
  );
}
