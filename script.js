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
      item.classList.remove('active', 'prev', 'next');
      if (i === index) item.classList.add('active');
      else if (i === (index - 1 + spotlightItems.length) % spotlightItems.length)
        item.classList.add('prev');
      else if (i === (index + 1) % spotlightItems.length)
        item.classList.add('next');
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

  function resetAutoRotate() {
    if (autoRotateTimer) clearInterval(autoRotateTimer);
    autoRotateTimer = setInterval(nextSpotlight, 5000);
  }

  nextBtn?.addEventListener('click', nextSpotlight);
  prevBtn?.addEventListener('click', prevSpotlight);

  spotlightItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page) window.location.href = `projects.html#${page}`;
    });
  });

  updateSpotlight(current);
  resetAutoRotate();
  slider.addEventListener('mouseenter', () => clearInterval(autoRotateTimer));
  slider.addEventListener('mouseleave', resetAutoRotate);
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

  // === Route map for project folder structure ===
  const projectRoutes = {
    // Cybersecurity
    cryptography: 'cybersecurity/cryptography',
    pentesting: 'cybersecurity/pentesting',
    networking: 'cybersecurity/networking',
    reverse_engineering: 'cybersecurity/reverse_engineering',

    // Creative
    music: 'creative/music',
    writing: 'creative/writing',
    drawing: 'creative/drawing',
    '3d_modeling': 'creative/3d_modeling',

    // Other
    software: 'software',
    robots_misc: 'robots_misc',
  };

  // === Dynamic content loading for projects page ===
  const projectArea = document.querySelector('#projects-loader') || document.querySelector('.projects-content');
  const projectLinks = document.querySelectorAll('[data-page]');

  // === Auto-load project if page is opened with a hash ===
  function loadProjectFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && projectArea) {
      const route = projectRoutes[hash] || hash; // Map short hash → full path
      fetch(`projects/${route}.html`)
        .then(response => {
          if (!response.ok) throw new Error(`Could not load ${route}`);
          return response.text();
        })
        .then(html => {
          projectArea.innerHTML = html;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          initTimelineScroll();
        })
        .catch(err => {
          console.error(`Error loading project from hash: ${err}`);
          projectArea.innerHTML = `<p style="color:red;">Project "${hash}" not found.</p>`;
        });
    }
  }

  // Run once on page load
  loadProjectFromHash();

  // Re-run when hash changes (supports both short and nested hashes)
  window.addEventListener('hashchange', loadProjectFromHash);

  // === Click-to-load for internal links (on-page nav) ===
  projectLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      const route = projectRoutes[page] || page;

      fetch(`projects/${route}.html`)
        .then(response => {
          if (!response.ok) throw new Error(`Could not load ${route}`);
          return response.text();
        })
        .then(html => {
          projectArea.innerHTML = html;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          initTimelineScroll();
          history.pushState(null, '', `#${page}`); // update URL
        })
        .catch(err => {
          projectArea.innerHTML = `<p style="color:red;">Error loading ${route}: ${err.message}</p>`;
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
