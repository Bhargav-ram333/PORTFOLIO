/**
 * Main Application Controller
 * Chiravuri Satya Siva Bhargav - Modern AI Portfolio
 */

// Project Detailed Data Store for Interactive Modals
const PROJECTS_DATA = {
  inscript: {
    title: "InScript AI — Intelligent Handwriting Generation Platform",
    subtitle: "Canvas API Rendering, Ruled-Paper Physics & Vector Export",
    badge: "AI / Canvas / Web",
    image: "assets/inscript_ai.jpg",
    github: "https://github.com/Bhargav-ram333/InScript-AI",
    metrics: [
      { label: "Rendering Tech", val: "HTML5 Canvas API" },
      { label: "Export Format", val: "Vector jsPDF" },
      { label: "Optimization", val: "60 FPS Smooth Render" }
    ],
    overview: "InScript AI is an intelligent handwriting synthesis web application built to convert digital text into realistic, authentic-looking handwritten documents with full customizable pen strokes, ink bleeding simulations, ruled-paper generators, and high-fidelity PDF export.",
    keyFeatures: [
      "Real-time dynamic handwriting preview powered by custom HTML5 Canvas rendering engine.",
      "Realistic ruled and lined notebook paper generation with customizable margins and paper textures.",
      "Multi-page jsPDF document generation supporting instant download of handwritten assignments.",
      "Extensive customization controls: stroke pressure, font slant, letter spacing, word spacing, ink colors, and line height.",
      "Zero-latency UI optimized for instant feedback with responsive mobile-friendly controls."
    ],
    techStack: ["JavaScript (ES6+)", "HTML5 Canvas API", "jsPDF", "CSS3 Custom Properties", "Web Performance API"]
  },
  sales: {
    title: "Business Sales Performance Analytics Dashboard",
    subtitle: "Interactive Commercial Intelligence & Executive KPI Monitoring",
    badge: "Data Science / Analytics",
    image: "assets/sales_dashboard.jpg",
    github: "https://github.com/Bhargav-ram333/Buiseness_analysis",
    metrics: [
      { label: "Data Pipeline", val: "Pandas & NumPy" },
      { label: "Dashboard Engine", val: "Streamlit" },
      { label: "Visualizations", val: "Matplotlib & Seaborn" }
    ],
    overview: "An enterprise-grade commercial analytics application built with Streamlit to enable business leadership to monitor real-time sales revenue, profit margin variations, regional market penetration, customer cohort performance, and seasonal sales cycles.",
    keyFeatures: [
      "Multi-dimensional exploratory data analysis uncovering actionable sales velocity trends and regional margin differences.",
      "Dynamic filtering by fiscal quarter, product category, geographical territory, and order fulfillment status.",
      "Comprehensive KPI cards tracking Total Revenue, Average Order Value (AOV), Profit Margins, and Customer Acquisition Cost.",
      "Interactive data tables and exportable visual summaries to streamline stakeholder decision-making."
    ],
    techStack: ["Python", "Streamlit", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Statistical Modeling"]
  },
  customer: {
    title: "Marketing Funnel Analysis & Customer Segmentation",
    subtitle: "K-Means Machine Learning Clustering & Funnel Conversion Analytics",
    badge: "Machine Learning / Analytics",
    image: "assets/customer_segmentation.jpg",
    github: "https://github.com/Bhargav-ram333/customer_segmentation-analysis",
    metrics: [
      { label: "ML Algorithm", val: "K-Means & PCA" },
      { label: "Dataset", val: "UCI Bank Marketing" },
      { label: "Visualizer", val: "Plotly Interactive" }
    ],
    overview: "An end-to-end customer intelligence system combining machine learning segmentation with funnel drop-off analytics. Leverages the UCI Bank Marketing dataset to cluster customers based on financial profiles and campaign responsiveness, enabling high-precision targeting.",
    keyFeatures: [
      "Applied Principal Component Analysis (PCA) for dimensionality reduction and K-Means clustering to discover 3 distinct customer personas.",
      "Marketing funnel Sankey visualization detailing conversion drop-offs across awareness, consideration, conversion, and retention stages.",
      "Interactive Plotly 3D scatter plots allowing live rotation and centroid inspection across multi-feature spaces.",
      "Data preprocessing pipeline incorporating categorical encoding, outlier handling, and feature standard scaling."
    ],
    techStack: ["Python", "Scikit-learn", "Plotly", "Streamlit", "Pandas", "K-Means", "PCA"]
  },
  churn: {
    title: "Telco Customer Churn Prediction Engine",
    subtitle: "High-Accuracy Classification Pipeline & SHAP Feature Attribution",
    badge: "Deep Learning & ML",
    image: "assets/churn_ml.jpg",
    github: "https://github.com/Bhargav-ram333/Telco_Customer_Churn_Analysis",
    metrics: [
      { label: "Model AUC", val: "0.941" },
      { label: "Accuracy", val: "93.4%" },
      { label: "Imbalance", val: "SMOTE Oversampling" }
    ],
    overview: "A predictive machine learning pipeline engineered to detect at-risk telecommunications subscribers before they churn. Incorporates class-imbalance remedies, cross-validation hyperparameter optimization, and explainable AI feature attribution via SHAP values.",
    keyFeatures: [
      "Achieved high diagnostic performance (0.941 ROC-AUC) using an optimized XGBoost and Random Forest ensemble.",
      "Synthesized minority churn class records using SMOTE to eliminate class bias and minimize costly false negatives.",
      "Extracted key churn indicators: contract tenure, month-to-month billing preference, and customer service call frequency.",
      "Confusion matrix and ROC-AUC curve visual telemetry for model diagnostics and validation."
    ],
    techStack: ["Python", "XGBoost", "Scikit-learn", "Pandas", "Seaborn", "SMOTE", "ROC-AUC"]
  }
};

class PortfolioApp {
  constructor() {
    this.initNavbar();
    this.initTypingEffect();
    this.init3DTilt();
    this.initProjectFilters();
    this.initProjectModals();
    this.initResumeModal();
    this.initSkillObserver();
    this.initTimelineTabs();
    this.initClipboard();
    this.initContactForm();
    this.initDeepLinkParams();
    this.initCinematicTimecode();
  }

  // 24.00 FPS Live Cinematic Post-Production Timecode Ticker
  initCinematicTimecode() {
    const tcEl = document.getElementById('live-timecode');
    if (!tcEl) return;

    let frames = 4;
    let seconds = 18;
    let minutes = 24;
    let hours = 0;

    setInterval(() => {
      frames++;
      if (frames >= 24) {
        frames = 0;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
      }
      const pad = (n) => String(n).padStart(2, '0');
      tcEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    }, 1000 / 24); // Exact 24 FPS Cadence
  }

  // Deep Link Query Params (e.g. ?section=projects or ?project=inscript or ?resume=1)
  initDeepLinkParams() {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const project = params.get('project');
    const resume = params.get('resume');

    if (section) {
      const el = document.getElementById(section);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'instant', block: 'start' }), 50);
      }
    }

    if (project && PROJECTS_DATA[project]) {
      setTimeout(() => {
        const modalBtn = document.querySelector(`[data-project-trigger="${project}"]`);
        if (modalBtn) modalBtn.click();
      }, 150);
    }

    if (resume === '1') {
      setTimeout(() => {
        const resumeBtn = document.querySelector('.btn-view-resume');
        if (resumeBtn) resumeBtn.click();
      }, 150);
    }
  }

  // 1. Navbar Scrolled State & Mobile Menu
  initNavbar() {
    const header = document.querySelector('.site-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Active section highlight
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('svg');
        if (icon) {
          icon.style.transform = navMenu.classList.contains('open') ? 'rotate(90deg)' : 'none';
        }
      });

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
        });
      });
    }
  }

  // 2. Typing Effect for Hero
  initTypingEffect() {
    const textElem = document.getElementById('typing-text');
    if (!textElem) return;

    const phrases = [
      "Machine Learning Engineer",
      "Predictive Modeling Specialist",
      "Data Science & Analytics Intern",
      "Deep Learning Enthusiast"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 100;

    const typeLoop = () => {
      const current = phrases[phraseIdx];

      if (isDeleting) {
        textElem.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        delay = 45;
      } else {
        textElem.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        delay = 100;
      }

      if (!isDeleting && charIdx === current.length) {
        delay = 2000; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 450;
      }

      setTimeout(typeLoop, delay);
    };

    setTimeout(typeLoop, 600);
  }

  // 3. 3D Card Tilt Engine with Glare
  init3DTilt() {
    const tiltCards = document.querySelectorAll('.tilt-card, .project-card-tilt, .profile-card-3d');

    tiltCards.forEach(card => {
      let bounds;

      const mouseMoveHandler = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;

        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2
        };

        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        // Calculate 3D rotation angles
        const maxAngle = 10;
        const rotateX = -(center.y / (bounds.height / 2)) * maxAngle;
        const rotateY = (center.x / (bounds.width / 2)) * maxAngle;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update glare position
        const glareX = (leftX / bounds.width) * 100;
        const glareY = (topY / bounds.height) * 100;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
        card.style.setProperty('--mouse-x', `${glareX}%`);
        card.style.setProperty('--mouse-y', `${glareY}%`);
      };

      const mouseEnterHandler = () => {
        bounds = card.getBoundingClientRect();
      };

      const mouseLeaveHandler = () => {
        bounds = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      };

      card.addEventListener('mouseenter', mouseEnterHandler);
      card.addEventListener('mousemove', mouseMoveHandler);
      card.addEventListener('mouseleave', mouseLeaveHandler);
    });
  }

  // 4. Project Filters
  initProjectFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card-tilt');

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter || (filter === 'ml' && (category === 'ml' || category === 'dl'))) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 5. Interactive Project Details Modal
  initProjectModals() {
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    const modalBody = document.getElementById('project-modal-content');
    const closeBtn = document.getElementById('project-modal-close');
    const triggerButtons = document.querySelectorAll('[data-project-trigger]');

    if (!modalBackdrop || !modalBody) return;

    const openModal = (projectKey) => {
      const p = PROJECTS_DATA[projectKey];
      if (!p) return;

      modalBody.innerHTML = `
        <div style="position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; border-radius:14px; margin-bottom:24px; border:1px solid rgba(0,242,254,0.3); box-shadow:0 15px 35px rgba(0,0,0,0.6);">
          <img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; top:16px; left:16px; background:rgba(6,8,13,0.85); backdrop-filter:blur(8px); padding:4px 12px; border-radius:99px; border:1px solid #00f2fe; color:#00f2fe; font-family:var(--font-mono); font-size:0.75rem;">
            ${p.badge}
          </div>
        </div>

        <h2 style="font-size:1.8rem; font-weight:800; color:#fff; margin-bottom:8px;">${p.title}</h2>
        <p style="font-family:var(--font-mono); font-size:0.9rem; color:var(--accent-cyan); margin-bottom:20px;">${p.subtitle}</p>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; margin-bottom:24px;">
          ${p.metrics.map(m => `
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:12px; border-radius:10px;">
              <span style="font-size:0.75rem; color:var(--text-dim); display:block; font-family:var(--font-mono);">${m.label}</span>
              <span style="font-size:1.1rem; font-weight:700; color:#00f2fe; font-family:var(--font-heading);">${m.val}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="font-size:1.05rem; margin-bottom:10px; color:#fff;">System Overview</h4>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.7;">${p.overview}</p>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="font-size:1.05rem; margin-bottom:10px; color:#fff;">Key Engineering Highlights</h4>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
            ${p.keyFeatures.map(f => `
              <li style="position:relative; padding-left:20px; font-size:0.92rem; color:var(--text-muted);">
                <span style="position:absolute; left:0; top:0; color:#00f2fe;">▹</span> ${f}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-bottom:28px;">
          <h4 style="font-size:1.05rem; margin-bottom:10px; color:#fff;">Technologies & Libraries</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${p.techStack.map(t => `<span class="badge-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div style="display:flex; gap:14px; align-items:center;">
          <a href="${p.github}" target="_blank" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            Explore GitHub Repository
          </a>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    triggerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectKey = btn.getAttribute('data-project-trigger');
        openModal(projectKey);
      });
    });

    const closeModal = () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 6. Resume Modal & Viewer
  initResumeModal() {
    const resumeBackdrop = document.getElementById('resume-modal-backdrop');
    const resumeClose = document.getElementById('resume-modal-close');
    const viewResumeBtns = document.querySelectorAll('.btn-view-resume');

    if (!resumeBackdrop) return;

    viewResumeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeResume = () => {
      resumeBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (resumeClose) resumeClose.addEventListener('click', closeResume);
    resumeBackdrop.addEventListener('click', (e) => {
      if (e.target === resumeBackdrop) closeResume();
    });
  }

  // 7. Skill Meters Intersection Observer Animation
  initSkillObserver() {
    const skillFills = document.querySelectorAll('.skill-fill');
    if (!skillFills.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-progress') || '85%';
          fill.style.width = targetWidth;
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.25 });

    skillFills.forEach(fill => observer.observe(fill));
  }

  // 8. Timeline Tab Switcher
  initTimelineTabs() {
    const tabs = document.querySelectorAll('.tab-btn[data-timeline]');
    const eduTimeline = document.getElementById('timeline-education');
    const expTimeline = document.getElementById('timeline-experience');

    if (!tabs.length || !eduTimeline || !expTimeline) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const mode = tab.getAttribute('data-timeline');
        if (mode === 'experience') {
          expTimeline.style.display = 'block';
          eduTimeline.style.display = 'none';
        } else {
          eduTimeline.style.display = 'block';
          expTimeline.style.display = 'none';
        }
      });
    });
  }

  // 9. One-Click Copy to Clipboard & Toast
  initClipboard() {
    const copyTriggers = document.querySelectorAll('[data-copy]');

    copyTriggers.forEach(elem => {
      elem.addEventListener('click', () => {
        const text = elem.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
          this.showToast(`Copied to clipboard: "${text}"`);
          if (window.AudioSynth && window.AudioSynth.playSuccessTone) {
            window.AudioSynth.playSuccessTone();
          }
        }).catch(() => {
          this.showToast(`Copied: ${text}`);
        });
      });
    });
  }

  // 10. Contact Form with Interactive Feedback
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        this.showToast('Please fill in all fields before transmitting.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg class="spin-anim" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
        Transmitting Signal...
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        this.showToast(`Signal Received! Thank you ${name}, Bhargav will respond shortly.`);

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
        if (window.AudioSynth && window.AudioSynth.playSuccessTone) {
          window.AudioSynth.playSuccessTone();
        }
      }, 1200);
    });
  }

  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.PortfolioAppInstance = new PortfolioApp();
});
