function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateIcon(savedTheme);
}

function updateIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

initTheme();
