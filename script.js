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

// === Dynamic content loading for projects page ===
const projectArea = document.querySelector('.projects-content');
const projectLinks = document.querySelectorAll('[data-page]');

projectLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');

    fetch(`projects/${page}.html`)
      .then(response => {
        if (!response.ok) throw new Error(`Could not load ${page}`);
        return response.text();
      })
      .then(html => {
        projectArea.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        projectArea.innerHTML = `<p style="color:red;">Error loading ${page}: ${err.message}</p>`;
      });
  });
});


// === Scroll-linked timeline highlighting ===
const projects = document.querySelectorAll('.project');
const timelineItems = document.querySelectorAll('.timeline li');

window.addEventListener('scroll', () => {
  let currentYear = '';

  projects.forEach(project => {
    const rect = project.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
      currentYear = project.getAttribute('data-year');
    }
  });

  // Highlight timeline
  timelineItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-year') === currentYear);
  });

  // Focus project in view
  projects.forEach(project => {
    const inView = project.getAttribute('data-year') === currentYear;
    project.classList.toggle('active', inView);
  });


  timelineItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-year') === currentYear);
  });
});


timelineItems.forEach(item => {
  item.addEventListener('click', () => {
    const year = item.getAttribute('data-year');
    const target = document.querySelector(`.project[data-year="${year}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});


