/**
 * Interactive Cyber AI CLI Terminal
 * Portfolio of Chiravuri Satya Siva Bhargav
 */

class InteractiveTerminal {
  constructor() {
    this.body = document.getElementById('terminal-body');
    this.input = document.getElementById('terminal-input');
    this.cmdButtons = document.querySelectorAll('.t-cmd-btn');
    if (!this.body || !this.input) return;

    this.history = [];
    this.historyIdx = -1;

    this.commands = {
      help: () => `
Available Commands:
  <span style="color:#ff2a42;">bio</span>         : Display summary & profile overview
  <span style="color:#ff2a42;">skills</span>      : List ML, Data Engineering & Web skills
  <span style="color:#ff2a42;">projects</span>    : View flagship projects & GitHub repositories
  <span style="color:#ff2a42;">education</span>   : View academic background & high scores
  <span style="color:#ff2a42;">experience</span>  : Show internships & industry experience
  <span style="color:#ff2a42;">achievements</span>: Certifications & hackathons
  <span style="color:#ff2a42;">optics</span>      : Visual framing, 35mm composition & depth-of-field
  <span style="color:#ff2a42;">timeline</span>    : NLE 24.00 FPS post-production timeline tracks
  <span style="color:#ff2a42;">score</span>       : Harmonic 432 Hz frequency scoring & soundscapes
  <span style="color:#ff2a42;">canvas</span>      : Raw charcoal & graphite raven art study
  <span style="color:#ff2a42;">cadence</span>     : Kinetic choreography & fluid motion physics
  <span style="color:#ff2a42;">contact</span>     : Contact details & direct social links
  <span style="color:#ff2a42;">resume</span>      : Open & download official resume PDF
  <span style="color:#ffa200;">sudo hire</span>   : [AUTHORIZED] Direct interview / role invitation
  <span style="color:#ff6b35;">clear</span>       : Clear terminal screen
`,
      bio: () => `
<strong style="color:#fff;">Chiravuri Satya Siva Bhargav</strong>
Role       : Aspiring Machine Learning Engineer & Data Scientist
Education  : B.Tech in AI & Data Science @ Amrita Vishwa Vidyapeetham (2024-2028)
Focus Area : End-to-end ML pipelines, deep learning, statistical modeling, predictive analytics
GitHub     : <a href="https://github.com/Bhargav-ram333" target="_blank" style="color:#00f2fe; text-decoration:underline;">github.com/Bhargav-ram333</a>
Email      : <a href="mailto:sivabhargav2006@gmail.com" style="color:#00f2fe;">sivabhargav2006@gmail.com</a>
Location   : Andhra Pradesh / India (Open to Remote & Global Roles)
`,
      skills: () => `
<span style="color:#00f5a0;">[Machine Learning & DL]</span> : Scikit-learn, PyTorch, TensorFlow, Keras, XGBoost, RLHF, LLMs
<span style="color:#00f2fe;">[Languages & Core]</span>      : Python, SQL, JavaScript, MATLAB
<span style="color:#9d4edd;">[Data & Analytics]</span>      : Pandas, NumPy, Matplotlib, Seaborn, Plotly, Streamlit
<span style="color:#ffb703;">[Data Engineering]</span>      : Apache Spark, PySpark, Kafka, Hadoop, PostgreSQL
<span style="color:#f72585;">[Web & Frameworks]</span>      : HTML5, CSS3, Flask, Django, REST APIs, Git, Canvas API
`,
      projects: () => `
<strong style="color:#00f2fe;">1. InScript AI — Intelligent Handwriting Generation Platform</strong>
   • Canvas API live preview, customizable pen strokes, ruled paper & jsPDF export
   • Repo: <a href="https://github.com/Bhargav-ram333/InScript-AI" target="_blank" style="color:#00f2fe;">github.com/Bhargav-ram333/InScript-AI</a>

<strong style="color:#00f2fe;">2. Business Sales Performance Analytics Dashboard</strong>
   • Streamlit interactive KPI dashboard, regional heatmaps, revenue trends
   • Repo: <a href="https://github.com/Bhargav-ram333/Buiseness_analysis" target="_blank" style="color:#00f2fe;">github.com/Bhargav-ram333/Buiseness_analysis</a>

<strong style="color:#00f2fe;">3. Marketing Funnel Analysis & Customer Segmentation</strong>
   • K-Means clustering, PCA, Plotly visualizer on UCI Bank Marketing dataset
   • Repo: <a href="https://github.com/Bhargav-ram333/customer_segmentation-analysis" target="_blank" style="color:#00f2fe;">github.com/Bhargav-ram333/customer_segmentation-analysis</a>

<strong style="color:#00f2fe;">4. Telco Customer Churn Prediction Engine</strong>
   • XGBoost classifier, SMOTE imbalance handling, ROC-AUC 0.941
   • Repo: <a href="https://github.com/Bhargav-ram333/Telco_Customer_Churn_Analysis" target="_blank" style="color:#00f2fe;">github.com/Bhargav-ram333/Telco_Customer_Churn_Analysis</a>
`,
      education: () => `
<span style="color:#00f2fe;">• Amrita Vishwa Vidyapeetham</span> (2024–2028)
  B.Tech in Artificial Intelligence and Data Science | CGPA: 7.0/10

<span style="color:#00f2fe;">• Tirumala Junior Kalasala</span> (2022–2024)
  APBIE (12th Board) — <strong style="color:#00f5a0;">95.5%</strong>

<span style="color:#00f2fe;">• Tirumala EM High School</span> (2021–2022)
  Board of Secondary Education — <strong style="color:#00f5a0;">94.6%</strong>
`,
      experience: () => `
<strong style="color:#00f2fe;">Data Science and Analytics Intern — Future Interns (2026)</strong>
• Data prep, exploratory analysis, statistical modeling, dashboard development
• Built end-to-end Python analytics workflows from collection to deployment
• <span style="color:#00f5a0;">Awarded Letter of Recommendation</span> for project delivery & technical excellence

<strong style="color:#00f2fe;">Data Science with Python Intern — SmartED Innovations (Jun 2026)</strong>
• Predictive modeling, algorithmic pipelines, data manipulation
`,
      achievements: () => `
• <span style="color:#00f2fe;">DataCamp</span>: Reinforcement Learning from Human Feedback (RLHF), LLMs in Python, Deep Learning with PyTorch
• <span style="color:#00f2fe;">MathWorks</span>: MATLAB Onramp & Introduction to Linear Algebra with MATLAB
• <span style="color:#00f2fe;">SmartED Innovations</span>: Data Science with Python Completion
• <span style="color:#00f2fe;">Nitro-Stack Hackathon</span>: Team Thunder Bolts (Jul 2026)
• <span style="color:#00f2fe;">Plan At B</span>: Premiere Pro Basic to Advanced (Dec 2025)
`,
      contact: () => `
Email    : <a href="mailto:sivabhargav2006@gmail.com" style="color:#00f2fe;">sivabhargav2006@gmail.com</a>
Phone    : <a href="tel:+919989712314" style="color:#00f2fe;">(+91) 9989712314</a>
GitHub   : <a href="https://github.com/Bhargav-ram333" target="_blank" style="color:#00f2fe;">github.com/Bhargav-ram333</a>
LinkedIn : <a href="https://linkedin.com/in/satya-siva-bhargav" target="_blank" style="color:#00f2fe;">linkedin.com/in/satya-siva-bhargav</a>
`,
      optics: () => `
<strong style="color:#ffa200;">[OPTICS & VISUAL FRAMING — 35mm PERSPECTIVE]</strong>
• <strong>Framing</strong>    : Golden Ratio, Rule of Thirds, and intentional Negative Space
• <strong>Aperture</strong>   : ƒ/1.4 shallow depth-of-field focusing user attention on primary data signals
• <strong>Exposure</strong>   : 1/250s shutter speed • ISO 200 • Full-frame dynamic range
• <strong>Philosophy</strong> : "A camera is an instrument that teaches people how to see without a camera."
  In software architecture, visual optics dictate how contrast and negative space naturally guide human perception through dense data environments.
`,
      timeline: () => `
<strong style="color:#ff2a42;">[NLE VIDEO POST-PRODUCTION TIMELINE — 24.00 FPS]</strong>
  TIME     : 00:24:18:14 | SEQUENCE: THE_PARADISE | CODEC: PRORES 4444 XQ
  [V1]     : <span style="color:#ff2a42;">■■■■■■■■■■■■■■■■■■■■■■■■■</span> [PRODUCTION REEL & ARCHITECTURE]
  [A1]     : <span style="color:#ff6b35;">░░░░░░░░░░░░░░░░░░░░░░░░░</span> [DIALOGUE & STATISTICAL PIPELINES]
  [A2]     : <span style="color:#ffa200;">▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒</span> [ORIGINAL SCORE & 432Hz HARMONICS]
  PLAYHEAD : ▼ TC 00:24:18:14 (Cadence cut to rhythm and dramatic narrative beats)
`,
      score: () => `
<strong style="color:#ff6b35;">[SONIC COMPOSITION & HARMONIC ARCHITECTURE]</strong>
• <strong>Master Tuning</strong> : 432 Hz Pythagorean Concert Pitch
• <strong>Harmonic Key</strong>  : D-Minor Pentatonic (D4 • F4 • G4 • A4 • C5 • D5)
• <strong>Soundscape</strong>    : Synthesized sub-bass drones, acoustic chime impulses, and atmospheric resonance
• <strong>Synesthesia</strong>   : Translating frequency modulation into responsive visual rhythms across user interactions.
`,
      canvas: () => `
<strong style="color:#ffd166;">[GRAPHITE & CHARCOAL CANVAS STUDY]</strong>
<span style="color:#ff2a42; font-family:monospace; line-height:1.2;">
           .---.
          /     \\       .-.
         | () () |     /   \\   [ SOARING RAVEN ]
          \\  ^  /     /     \\  Charcoal & Molten Ember Study
           |||||     /       \\ Medium: Raw Graphite on Obsidian
           |||||____/         \\
          /                     \\
         /                       \\
</span>
• <strong>Palette</strong> : #07080A [Charcoal] • #FF2A42 [Molten Crimson] • #FF6B35 [Ember] • #FFA200 [Ochre]
• <strong>Medium</strong>  : Expressive gestural strokes, raw graphite textures, and high-contrast tonal values.
`,
      cadence: () => `
<strong style="color:#ffa200;">[KINETIC CADENCE & CHOREOGRAPHY OF MOTION]</strong>
• <strong>Physics Engine</strong> : Bezier Cadence (0.16, 1, 0.3, 1) with fluid inertia
• <strong>Spatial Logic</strong>  : Balance, momentum, intentional tension, and graceful release
• <strong>Philosophy</strong>     : Coding and dance converge on kinetic rhythm. An interface should never feel static or abruptly mechanical; every transition moves with organic human cadence.
`,
      resume: () => {
        window.open('assets/resume.pdf', '_blank');
        return `Opening official resume PDF in a new tab... <a href="assets/resume.pdf" download="Bhargav_Resume.pdf" style="color:#00f2fe; text-decoration:underline;">Click here to download directly</a>.`;
      },
      'sudo hire': () => {
        this.triggerHireCelebration();
        return `
<div style="padding:12px; border:1px solid #00f5a0; border-radius:8px; background:rgba(0,245,160,0.1); margin:8px 0;">
  <span style="color:#00f5a0; font-weight:700; font-size:1.05rem;">🎉 ACCESS GRANTED: PRIORITY RECRUITING PIPELINE</span><br>
  Thank you for your interest! Bhargav is actively interviewing for Machine Learning Engineer & Data Science roles/internships.<br><br>
  <strong>Direct Contact:</strong> <a href="mailto:sivabhargav2006@gmail.com?subject=Interview%20Invitation%20for%20Bhargav" style="color:#00f2fe; text-decoration:underline;">sivabhargav2006@gmail.com</a> | <strong>Call/WhatsApp:</strong> +91 9989712314<br>
  A confetti burst has been activated in your honor!
</div>
`;
      },
      clear: () => {
        this.body.innerHTML = '';
        return null;
      }
    };

    this.initEvents();
  }

  initEvents() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmdText = this.input.value.trim();
        if (cmdText) {
          this.history.push(cmdText);
          this.historyIdx = this.history.length;
          this.execute(cmdText);
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIdx > 0) {
          this.historyIdx--;
          this.input.value = this.history[this.historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIdx < this.history.length - 1) {
          this.historyIdx++;
          this.input.value = this.history[this.historyIdx];
        } else {
          this.historyIdx = this.history.length;
          this.input.value = '';
        }
      }
    });

    this.cmdButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.execute(cmd);
          this.input.focus();
        }
      });
    });
  }

  execute(cmdText) {
    const raw = cmdText.toLowerCase().trim();

    // Print command line
    const promptLine = document.createElement('div');
    promptLine.className = 't-prompt-line';
    promptLine.innerHTML = `<span class="t-prompt-symbol">guest@the-paradise</span>:<span class="t-prompt-path">~</span>$ <span>${escapeHtml(cmdText)}</span>`;
    this.body.appendChild(promptLine);

    let outputHtml = '';

    if (this.commands[raw]) {
      const result = this.commands[raw]();
      if (result !== null) {
        outputHtml = result;
      }
    } else {
      outputHtml = `<span style="color:#ff5f56;">zsh: command not found: ${escapeHtml(cmdText)}</span>. Type <span style="color:#00f2fe; cursor:pointer;" onclick="document.getElementById('terminal-input').value='help';">help</span> to view available options.`;
    }

    if (outputHtml) {
      const outBlock = document.createElement('div');
      outBlock.className = 'terminal-output-block';
      outBlock.innerHTML = outputHtml;
      this.body.appendChild(outBlock);
    }

    this.body.scrollTop = this.body.scrollHeight;
  }

  triggerHireCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    if (window.AudioSynth && window.AudioSynth.playSuccessTone) {
      window.AudioSynth.playSuccessTone();
    }
  }
}

function escapeHtml(string) {
  const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

window.addEventListener('DOMContentLoaded', () => {
  window.PortfolioTerminal = new InteractiveTerminal();
});
