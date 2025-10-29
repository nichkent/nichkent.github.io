document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Dark mode toggle
    const toggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Default: dark mode ON unless localStorage says "light"
    if (localStorage.getItem('theme') !== 'light') {
        body.classList.add('dark-mode');
    }

    // Update button symbol based on current mode
    toggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';

    toggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            toggle.textContent = '🌙';
        }
    });
});
