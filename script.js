document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

 // Dark mode toggle
    const toggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Load saved theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
