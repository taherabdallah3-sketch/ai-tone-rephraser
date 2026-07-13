const textEl = document.getElementById('input-text');
const charCountEl = document.getElementById('char-count');
const toneEl = document.getElementById('tone-select');
const btnEl = document.getElementById('rephrase-btn');
const errorEl = document.getElementById('error');
const resultWrapEl = document.getElementById('result-wrap');
const resultTextEl = document.getElementById('result-text');
const copyBtnEl = document.getElementById('copy-btn');

textEl.addEventListener('input', () => {
  charCountEl.textContent = textEl.value.length;
});

btnEl.addEventListener('click', async () => {
  const text = textEl.value.trim();
  errorEl.classList.remove('show');

  if (!text) {
    errorEl.textContent = 'Please enter some text.';
    errorEl.classList.add('show');
    return;
  }

  btnEl.disabled = true;
  btnEl.textContent = 'Rephrasing...';
  resultWrapEl.style.display = 'none';

  try {
    const res = await fetch('/api/rephrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tone: toneEl.value })
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    resultTextEl.textContent = data.result;
    resultWrapEl.style.display = 'block';
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.add('show');
  } finally {
    btnEl.disabled = false;
    btnEl.textContent = 'Rephrase';
  }
});

copyBtnEl.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultTextEl.textContent);
  copyBtnEl.textContent = 'Copied!';
  setTimeout(() => (copyBtnEl.textContent = 'Copy'), 1500);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
