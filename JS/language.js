const LANG_DEFAULT = 'en-US';

// Capture script directory at parse time so the JSON path is always correct,
// regardless of which page (root vs subpage) loads this file.
const _scriptDir = (() => {
  const src = document.currentScript?.src ?? '';
  return src.substring(0, src.lastIndexOf('/') + 1);
})();

// Load synchronously so t() works immediately for all scripts that follow.
let CONTENT = {};
const _xhr = new XMLHttpRequest();
_xhr.open('GET', _scriptDir + 'content.json', false);
_xhr.send();
CONTENT = JSON.parse(_xhr.responseText);

function t(section, key) {
  const lang = getLanguage();
  return CONTENT[lang]?.[section]?.[key] ?? CONTENT[LANG_DEFAULT][section][key];
}

function getLanguage() {
  return localStorage.getItem('language') || LANG_DEFAULT;
}

function setLanguage(code) {
  if (code === LANG_DEFAULT) {
    localStorage.removeItem('language');
  } else {
    localStorage.setItem('language', code);
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const [section, key] = el.dataset.i18n.split('.');
    el.textContent = t(section, key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const [section, key] = el.dataset.i18nPlaceholder.split('.');
    el.placeholder = t(section, key);
  });
}

function updateLanguageUI(code) {
  const btn = document.querySelector('[aria-label="Select language"]');
  if (btn) {
    btn.innerHTML = `<i class="bi bi-globe" aria-hidden="true"></i> ${code.slice(0, 2).toUpperCase()}`;
  }
  document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
    item.classList.toggle('active', item.dataset.lang === code);
  });
}

function initLanguage() {
  const current = getLanguage();
  updateLanguageUI(current);
  applyTranslations();

  document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const code = item.dataset.lang;
      setLanguage(code);
      location.reload();
    });
  });
}

initLanguage();
