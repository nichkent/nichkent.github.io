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






  

  // ================= Sidebar only on projects page =======================
 if (bodyClass.contains('projects-page')) {
  const sidebar  = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const backdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('collapsed');
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('collapsed');
    document.body.classList.remove('sidebar-open');
  }

  // Sidebar button (hamburger) toggle
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.contains('collapsed');
      if (isCollapsed) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });
  }

  // Clicking backdrop closes sidebar
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // Dropdown slide open / close
  document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.dropdown');
      parent.classList.toggle('open');
    });
  });
}



  








  
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

if (spotlightItems.length) {
  let current = 0;
  let isTransitioning = false;

  function updateSpotlight(index, direction = 1) {
    if (isTransitioning) return;
    isTransitioning = true;

    const newIndex = (index + spotlightItems.length) % spotlightItems.length;
    const outgoing = spotlightItems[current];
    const incoming = spotlightItems[newIndex];

    // Reset all classes and z-index before transition
    spotlightItems.forEach(item => {
      item.classList.remove('active', 'prev', 'next', 'under');
      item.style.zIndex = '1';
    });

    // Assign new structural classes
    spotlightItems.forEach((item, i) => {
      if (i === newIndex) item.classList.add('active');
      else if (i === (newIndex - 1 + spotlightItems.length) % spotlightItems.length)
        item.classList.add('prev');
      else if (i === (newIndex + 1) % spotlightItems.length)
        item.classList.add('next');
    });

   spotlightItems.forEach(item => item.classList.remove('incoming', 'under', 'transitioning'));


    // --- Visual transition classes ---
    outgoing.classList.add('under');
    incoming.classList.add('incoming');

    // Update current after animation completes
    setTimeout(() => {
      outgoing.classList.remove('under', 'incoming');
      incoming.classList.remove('incoming'); // ✅ make sure incoming resets too
      current = newIndex;
      isTransitioning = false;
    }, 700);
  }

  // Button listeners
  prevBtn?.addEventListener('click', () => updateSpotlight(current - 1, -1));
  nextBtn?.addEventListener('click', () => updateSpotlight(current + 1, 1));

  // ✅ Make spotlight items clickable — route to project page
  spotlightItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page) window.location.href = `projects.html#${page}`;
    });
  });

  // ✅ Initialize on page load
  window.addEventListener('load', () => updateSpotlight(0));
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
        initExpandToggles();
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
          initExpandToggles();
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
          initExpandToggles();
        })
        .catch(err => {
          projectArea.innerHTML = `<p style="color:red;">Error loading ${page}: ${err.message}</p>`;
        });
    });
  });

  // Initialize timeline logic on first load 
  initTimelineScroll();
  initExpandToggles();
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








// === Expandable project sections ===
function initExpandToggles() {
  document.querySelectorAll('.expand-toggle').forEach(button => {
    // Prevent duplicate listeners
    button.removeEventListener('click', handleExpand);
    button.addEventListener('click', handleExpand);
  });
}

function handleExpand(event) {
  const button = event.currentTarget;
  const extraContent = button.nextElementSibling;
  const isOpen = button.classList.toggle('open');
  extraContent.classList.toggle('show', isOpen);
}
