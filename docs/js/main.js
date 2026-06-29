document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Dark is the default theme. Light theme is opt-in via `light` class.
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light');
  } else if (!savedTheme) {
    localStorage.setItem('theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const willBeLight = !body.classList.contains('light');
      body.classList.toggle('light', willBeLight);
      localStorage.setItem('theme', willBeLight ? 'light' : 'dark');
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const revealElements = document.querySelectorAll('.fade-in, .reveal-up, .reveal-left, .reveal-right');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger based on element order within its sibling group
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.max(0, index) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  const skillCircles = document.querySelectorAll('.skill-circle');
  if (skillCircles.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percent = entry.target.dataset.percent;
          const circleFill = entry.target.querySelector('.circle-fill');
          if (circleFill) {
            circleFill.style.strokeDasharray = `${percent}, 100`;
            circleFill.classList.add('animated');
          }
          entry.target.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillCircles.forEach(el => skillObserver.observe(el));
  }

  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length > 0) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = width + '%';
          entry.target.classList.add('animated');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(el => barObserver.observe(el));
  }

  const githubChartBars = document.querySelectorAll('.github-chart-bar');
  if (githubChartBars.length > 0) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            const height = entry.target.dataset.height;
            entry.target.style.height = height + 'px';
            entry.target.classList.add('animated');
          }, index * 50);
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    githubChartBars.forEach(el => chartObserver.observe(el));
  }

  loadGitHubChart();
});

async function loadGitHubChart() {
  const container = document.getElementById('github-chart');
  if (!container) return;

  try {
    const res = await fetch('https://api.github.com/users/14lucas-mendes/events');
    const events = await res.json();
    
    if (!Array.isArray(events)) {
      renderMockChart(container);
      return;
    }

    const pushEvents = events.filter(e => e.type === 'PushEvent');
    
    if (pushEvents.length === 0) {
      renderMockChart(container);
      return;
    }

    const weekMap = {};
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    pushEvents.forEach(event => {
      const eventDate = new Date(event.created_at);
      if (eventDate >= threeMonthsAgo) {
        const weekKey = getWeekKey(eventDate);
        weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;
      }
    });

    const weeks = Object.keys(weekMap).sort();
    const maxCommits = Math.max(...Object.values(weekMap), 1);

    container.innerHTML = '';
    
    weeks.forEach(weekKey => {
      const commits = weekMap[weekKey];
      const height = Math.max(8, (commits / maxCommits) * 100);
      
      const bar = document.createElement('div');
      bar.className = 'github-chart-bar';
      bar.dataset.height = height;
      bar.title = `${commits} commits`;
      container.appendChild(bar);
    });

    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            const height = entry.target.dataset.height;
            entry.target.style.height = height + 'px';
            entry.target.classList.add('animated');
          }, index * 50);
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    container.querySelectorAll('.github-chart-bar').forEach(el => {
      chartObserver.observe(el);
    });

  } catch (error) {
    renderMockChart(container);
  }
}

function renderMockChart(container) {
  const mockData = [12, 8, 15, 6, 18, 10, 14, 9, 16, 7, 13, 11];
  const maxCommits = Math.max(...mockData);
  
  container.innerHTML = '';
  
  mockData.forEach((commits, index) => {
    const height = Math.max(8, (commits / maxCommits) * 100);
    
    const bar = document.createElement('div');
    bar.className = 'github-chart-bar';
    bar.dataset.height = height;
    bar.title = `${commits} commits`;
    container.appendChild(bar);
  });

  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const height = entry.target.dataset.height;
          entry.target.style.height = height + 'px';
          entry.target.classList.add('animated');
        }, index * 50);
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  container.querySelectorAll('.github-chart-bar').forEach(el => {
    chartObserver.observe(el);
  });
}

function getWeekKey(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${week}`;
}
