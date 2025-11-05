// === Smooth scrolling ===
document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll for anchor links
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
  const goToButton = document.getElementById("GoToProjectWarehouse");
  if (goToButton) {
    goToButton.onclick = function() {
      window.location.href = "https://nichkent.github.io/projects.html";
    };
  }

  // === Spotlight Carousel ===
const spotlightItems = document.querySelectorAll('.spotlight-item');
const prevBtn = document.querySelector('.spotlight-nav.prev');
const nextBtn = document.querySelector('.spotlight-nav.next');
const slider = document.querySelector('.spotlight-slider');

if (spotlightItems.length) {
  let current = 0;
  let autoRotateTimer = null;

  function updateSpotlight(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
    spotlightItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  function nextSpotlight() {
    current = (current + 1) % spotlightItems.length;
    updateSpotlight(current);
    resetAutoRotate();
  }

  function prevSpotlight() {
    current = (current - 1 + spotlightItems.length) % spotlightItems.length;
    updateSpotlight(current);
    resetAutoRotate();
  }

  // Reset timer so manual actions restart the 5s countdown
  function resetAutoRotate() {
    if (autoRotateTimer) clearInterval(autoRotateTimer);
    autoRotateTimer = setInterval(() => {
      current = (current + 1) % spotlightItems.length;
      updateSpotlight(current);
    }, 5000);
  }

  // Button click events
  nextBtn?.addEventListener('click', nextSpotlight);
  prevBtn?.addEventListener('click', prevSpotlight);

  // Make spotlight clickable to load project page
  spotlightItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page) {
        // Try to dynamically load via your project loader if available
        const projectArea = document.querySelector('#projects-loader') || document.querySelector('.projects-content');
        if (projectArea) {
          fetch(`projects/${page}.html`)
            .then(response => {
              if (!response.ok) throw new Error(`Could not load ${page}`);
              return response.text();
            })
            .then(html => {
              projectArea.innerHTML = html;
              window.scrollTo({ top: 0, behavior: 'smooth' });
              initTimelineScroll();
            })
            .catch(err => {
              console.error(err);
              // If loader not found (e.g. homepage), just redirect
              window.location.href = `projects.html#${page}`;
            });
        } else {
          // If no loader exists (like on homepage), redirect to projects page
          window.location.href = `projects.html#${page}`;
        }
      }
    });
  });

  // Start auto rotation
  resetAutoRotate();
}


  // === Dark mode toggle ===
  const toggle = document.getElementById('dark-mode-toggle');
  const body = document.body;

  if (localStorage.getItem('theme') !== 'light') {
    body.classList.add('dark-mode');
  }

  if (toggle) {
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
  }

  // === Dynamic content loading for projects page ===
  const projectArea = document.querySelector('#projects-loader') || document.querySelector('.projects-content');
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
  if (!projects.length || !timelineItems.length) return;

  window.addEventListener('scroll', () => {
    let currentYear = '';

    projects.forEach(project => {
      const rect = project.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
        currentYear = project.getAttribute('data-year');
      }
    });

    timelineItems.forEach(item => {
      const isActive = item.getAttribute('data-year') === currentYear;
      item.classList.toggle('active', isActive);
    });

    projects.forEach(project => {
      const inView = project.getAttribute('data-year') === currentYear;
      project.classList.toggle('active', inView);
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
}
