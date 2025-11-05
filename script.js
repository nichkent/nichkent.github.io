 // === Smooth scrolling ===
document.addEventListener('DOMContentLoaded', () => {
 
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Button for going to project warehouse from home page =========
   document.getElementById("GoToProjectWarehouse").onclick = function() {
      window.location.href = "https://nichkent.github.io/projects.html";
   };
    

  // === Dark mode toggle ===
  const toggle = document.getElementById('dark-mode-toggle');
  const body = document.body;

  if (localStorage.getItem('theme') !== 'light') {
    body.classList.add('dark-mode');
  }

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

  // === Dynamic content loading for projects page ===
  const projectArea = document.querySelector('#projects-loader, .projects-content');
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
          initTimelineScroll(); // reinit timeline + focus after load
        })
        .catch(err => {
          projectArea.innerHTML = `<p style="color:red;">Error loading ${page}: ${err.message}</p>`;
        });
    });
  });

  // === Initialize timeline logic on first load ===
  initTimelineScroll();
});


// === Scroll-linked timeline highlighting & focus ===
function initTimelineScroll() {
  const projects = document.querySelectorAll('.project');
  const timelineItems = document.querySelectorAll('.timeline li');
  if (!projects.length || !timelineItems.length) return; // nothing to do

  // Highlight and focus as you scroll
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

    projects.forEach(project => {
      const inView = project.getAttribute('data-year') === currentYear;
      project.classList.toggle('active', inView);
    });
  });

  // Scroll to project when clicking a timeline year
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      const year = item.getAttribute('data-year');
      const target = document.querySelector(`.project[data-year="${year}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}
