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
const bodyClass = document.body.classList; 
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


    // === Intro handling (only visible on initial projects.html) ===
  function hideProjectsIntro() {
    const intro = document.getElementById('projects-intro');
    if (intro) {
      intro.style.display = 'none';
    }
  }














  
  // === Project search index ===
  // Each entry maps a search title to the page file under /projects/
  const PROJECT_INDEX = [
    // ---- Software page projects (software.html) ----
    { title: 'Secure Website', page: 'software' },
    { title: 'Graphing Binary Trees', page: 'software' },
    { title: 'Connect 4', page: 'software' },
    { title: 'Differentially Private Machine Learning Model', page: 'software' },
    { title: 'BCI Final (BCIs)', page: 'software' },
    { title: 'Remote Control', page: 'software' },
    { title: 'Stack Overflow Sentiment Analysis', page: 'software' },
    { title: 'Phishing Detection AI', page: 'software' },
    { title: 'Portfolio Website', page: 'software' },

    // ---- Cybersecurity pages (add more fine-grained projects later if you like) ----
    { title: 'Pentesting', page: 'cybersecurity/pentesting' },
    { title: 'Reverse Engineering', page: 'cybersecurity/reverse_engineering' },
    { title: 'Network Traffic Analysis', page: 'cybersecurity/networking' },
    { title: 'Cryptography', page: 'cybersecurity/cryptography' },

    // ---- Creative pursuits ----
    { title: 'Music', page: 'creative/music' },
    { title: 'Writing', page: 'creative/writing' },
    { title: 'Drawing', page: 'creative/drawing' },
    { title: '3D Modeling', page: 'creative/3d_modeling' },

    // ---- Robots & misc ----
    { title: 'Robots and Stuff', page: 'robots_misc' }
  ];

  const searchInput = document.getElementById('project-search-input');
  const suggestionList = document.getElementById('project-search-suggestions');
  const searchWrapper = document.getElementById('project-search-wrapper');

  if (searchInput && suggestionList && projectArea) {
    let filteredResults = [];
    let activeIndex = -1;

    function clearSuggestions() {
      suggestionList.innerHTML = '';
      suggestionList.style.display = 'none';
      filteredResults = [];
      activeIndex = -1;
    }

    function renderSuggestions(results) {
      suggestionList.innerHTML = '';
      if (!results.length) {
        clearSuggestions();
        return;
      }

      results.forEach((item, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.innerHTML = `
          <span class="title">${item.title}</span>
          <span class="page">${item.page}</span>
        `;
        li.addEventListener('click', () => {
          handleSelection(index);
        });
        suggestionList.appendChild(li);
      });

      suggestionList.style.display = 'block';
    }

    function highlightActive() {
      const items = suggestionList.querySelectorAll('li');
      items.forEach((li, idx) => {
        li.classList.toggle('active', idx === activeIndex);
      });
    }

    function handleSelection(index) {
      const item = filteredResults[index];
      if (!item) return;
      const { title, page } = item;

      clearSuggestions();
      searchInput.blur();

      // Core behavior: load that project page, then scroll to the matching project (if found)
      loadProjectPageAndScroll(page, title);
    }

    function loadProjectPageAndScroll(page, projectTitle) {
      if (!page) return;

      hideProjectsIntro();   // 👈 hide intro on first search-based load

      fetch(`projects/${page}.html`)
        .then(response => {
          if (!response.ok) throw new Error(`Could not load ${page}`);
          return response.text();
        })
        .then(html => {
          projectArea.innerHTML = html;
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Re-init behaviors on newly injected content
          initTimelineScroll();
          initExpandToggles();

          // Small timeout so DOM has laid out, then scroll to the specific project section
          setTimeout(() => {
            if (!projectTitle) return;

            const projects = document.querySelectorAll('.project');
            let targetSection = null;

            projects.forEach(section => {
              const h2 = section.querySelector('h2');
              if (h2 && h2.textContent.trim().toLowerCase() === projectTitle.toLowerCase()) {
                targetSection = section;
              }
            });

            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Briefly highlight the section
              targetSection.classList.add('active');
              setTimeout(() => targetSection.classList.remove('active'), 1500);
            }
          }, 100);
        })
        .catch(err => {
          projectArea.innerHTML = `<p style="color:red;">Error loading ${page}: ${err.message}</p>`;
        });
    }

    // --- Input handler: filter suggestions as user types ---
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        clearSuggestions();
        return;
      }

      filteredResults = PROJECT_INDEX.filter(item =>
        item.title.toLowerCase().includes(query)
      );

      renderSuggestions(filteredResults);
    });

    // --- Keyboard navigation: arrows + enter/esc ---
    searchInput.addEventListener('keydown', (e) => {
      const items = suggestionList.querySelectorAll('li');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        highlightActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        highlightActive();
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < filteredResults.length) {
          e.preventDefault();
          handleSelection(activeIndex);
        } else if (filteredResults.length === 1) {
          e.preventDefault();
          handleSelection(0);
        }
      } else if (e.key === 'Escape') {
        clearSuggestions();
      }
    });

    // Clicking outside the search closes suggestions
    document.addEventListener('click', (e) => {
      if (!searchWrapper.contains(e.target)) {
        clearSuggestions();
      }
    });
  }














  
  // === Auto-load project if page opened with a hash ===
  const hash = window.location.hash.replace('#', '');
  if (hash && projectArea) {
    hideProjectsIntro();  // 👈 hide intro as soon as we know we're loading a project
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
      hideProjectsIntro();  // 👈 hide intro when switching via hash
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
      hideProjectsIntro();   // 👈 hide intro once user picks a section
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
