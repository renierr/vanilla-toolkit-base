export default function init() {
  const result = document.getElementById('result')!;
  const buttons = document.querySelectorAll('[data-op]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const a = parseFloat((document.getElementById('a') as HTMLInputElement).value || '0');
      const b = parseFloat((document.getElementById('b') as HTMLInputElement).value || '0');
      const op = btn.getAttribute('data-op')!;

      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '*') res = a * b;
      else if (op === '/') res = b !== 0 ? a / b : 0;

      result.textContent = res.toString();
    });
  });
}
