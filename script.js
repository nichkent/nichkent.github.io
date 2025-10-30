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

// === Project page content swapping ===
const contentArea = document.getElementById("projects-content");

document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = e.target.getAttribute('data-section');

    let html = '';
    switch (section) {
      case 'phishing':
        html = `
          <h2>Phishing URL Detection AI</h2>
          <p>This project uses machine learning to detect phishing URLs with 95% accuracy using natural language features and redirect code analysis.</p>
        `;
        break;

      case 'pentesting':
        html = `
          <h2>Penetration Testing Projects</h2>
          <p>A showcase of my red team simulations, network vulnerability assessments, and exploitation reports.</p>
        `;
        break;

      case 'software':
        html = `
          <h2>Cool Software I've Made</h2>
          <p>Small utilities and creative tools built in Python, FastAPI, and JavaScript.</p>
        `;
        break;

      case '3d':
        html = `
          <h2>3D Game Engine</h2>
          <p>A Vulkan-based 3D engine built in C++ with a custom math library and physics integration.</p>
        `;
        break;

      case 'art':
        html = `
          <h2>Digital Art & Design</h2>
          <p>Interactive media projects, Unreal Engine experiments, and digital visualizations.</p>
        `;
        break;

      case 'robots':
        html = `
          <h2>Robots and Stuff</h2>
          <p>Mechanical builds, drone experiments, and Raspberry Pi robotics projects.</p>
        `;
        break;

      default:
        html = `
          <h1>Welcome to My Projects</h1>
          <p>Select a category above to explore my work.</p>
        `;
    }

    contentArea.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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


