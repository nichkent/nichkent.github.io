// === Smooth scrolling ===
document.addEventListener('DOMContentLoaded', () => {
  // === Smooth scroll for anchor links ===
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
const container = document.querySelector('.spotlight-container');

if (spotlightItems.length && slider && container) {
  let current = 0;
  let autoRotateTimer = null;

  // Wait until images are loaded so widths are correct
  function imagesReady() {
    const imgs = slider.querySelectorAll('img');
    const pending = [];
    imgs.forEach(img => {
      if (!img.complete) {
        pending.push(new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
        }));
      }
    });
    return Promise.all(pending);
  }

  function getGap() {
    const cs = window.getComputedStyle(slider);
    // columnGap and gap both work; fallback to 0 if not set
    return parseFloat(cs.columnGap || cs.gap || '0') || 0;
  }

  function centerActive(index) {
    // Clamp with wraparound
    current = (index + spotlightItems.length) % spotlightItems.length;

    // Assign classes
    spotlightItems.forEach((item, i) => {
      item.classList.remove('active', 'prev', 'next');
      if (i === current) item.classList.add('active');
      else if (i === (current - 1 + spotlightItems.length) % spotlightItems.length) item.classList.add('prev');
      else if (i === (current + 1) % spotlightItems.length) item.classList.add('next');
    });

    // Robust centering: sum widths of slides before current + gaps
    const gap = getGap();
    let prefixWidth = 0;
    for (let i = 0; i < current; i++) {
      prefixWidth += spotlightItems[i].offsetWidth;
    }
    const active = spotlightItems[current];
    const activeWidth = active.offsetWidth;

    // Total distance from slider's very left edge to the center of the active slide
    const activeCenterFromLeft = prefixWidth + gap * current + (activeWidth / 2);

    // Center of the visible container
    const containerCenter = container.clientWidth / 2;

    // Desired translate so that activeCenter aligns with containerCenter
    const desired = activeCenterFromLeft - containerCenter;

    slider.style.transform = `translateX(-${desired}px)`;
  }

  function nextSpotlight() {
    centerActive(current + 1);
    resetAutoRotate();
  }

  function prevSpotlight() {
    centerActive(current - 1);
    resetAutoRotate();
  }

  function resetAutoRotate() {
    if (autoRotateTimer) clearInterval(autoRotateTimer);
    autoRotateTimer = setInterval(() => centerActive(current + 1), 5000);
  }

  // Init after images are ready (so widths are stable)
  imagesReady().then(() => {
    // Double RAF ensures layout is fully settled before measuring
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerActive(0);
        resetAutoRotate();
      });
    });
  });

  // Buttons
  nextBtn?.addEventListener('click', nextSpotlight);
  prevBtn?.addEventListener('click', prevSpotlight);

  // Click slide -> go to project
  spotlightItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page) window.location.href = `projects.html#${page}`;
    });
  });

  // Keep centered on resize
  window.addEventListener('resize', () => centerActive(current));

  // Pause auto-rotate on hover (optional, if you had this before)
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










  
  // === Dynamic content loading for projects page ===
  const projectArea = document.querySelector('#projects-loader') || document.querySelector('.projects-content');
  const projectLinks = document.querySelectorAll('[data-page]');















  
  // === Auto-load project if page opened with a hash ===
  const hash = window.location.hash.replace('#', '');
  if (hash && projectArea) {
    fetch(`projects/${hash}.html`)
      .then(response => {
        if (!response.ok) throw new Error(`Could not load ${hash}`);
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
















  
  // === Handle hash change dynamically ===
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '');
    if (newHash && projectArea) {
      fetch(`projects/${newHash}.html`)
        .then(res => res.ok ? res.text() : Promise.reject(`404: ${newHash}`))
        .then(html => {
          projectArea.innerHTML = html;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          initTimelineScroll();
        })
        .catch(() => {
          projectArea.innerHTML = `<p style="color:red;">Project "${newHash}" not found.</p>`;
        });
    }
  });













  
  // === Attach link listeners for dynamic project loading ===
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
          initTimelineScroll();
        })
        .catch(err => {
          projectArea.innerHTML = `<p style="color:red;">Error loading ${page}: ${err.message}</p>`;
        });
    });
  });

  // Initialize timeline logic on first load 
  initTimelineScroll();
});














// === Scroll-linked timeline highlighting & focus ===
function initTimelineScroll() {
  const projects = document.querySelectorAll('.project');
  const timelineItems = document.querySelectorAll('.timeline li');
  if (!projects.length || !timelineItems.length) return;

  function updateActiveProject() {
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
  }

  // Run on scroll
  window.addEventListener('scroll', updateActiveProject);
  // Run immediately on load
  updateActiveProject();

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
