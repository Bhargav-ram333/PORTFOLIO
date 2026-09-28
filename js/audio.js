/**
 * Harmonic Sound Design & Sonic Architecture Engine
 * Chiravuri Satya Siva Bhargav Portfolio — "The Paradise" Edition
 * Featuring 432 Hz Master Tuning, D-Minor Pentatonic Navbar Scale,
 * SLR Camera Mechanical Shutter Synthesis, and Cinematic Sub-Bass Harmonics.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.toggleBtn = document.getElementById('sound-toggle');

    // 432 Hz Concert Pitch based D-Minor Pentatonic Scale
    // D4 (288.3Hz), F4 (342.9Hz), G4 (384.9Hz), A4 (432.0Hz), C5 (513.7Hz), D5 (576.7Hz), F5 (685.8Hz)
    this.navScale = [288.33, 342.88, 384.87, 432.00, 513.74, 576.65, 685.76];
    
    this.init();
  }

  init() {
    if (!this.toggleBtn) return;

    this.toggleBtn.addEventListener('click', () => {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.enabled = !this.enabled;
      this.updateUI();
      if (this.enabled) {
        this.playCinematicHarmonicChord();
      }
    });

    // Navigation links play musical notes from the D-Minor Pentatonic scale
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, idx) => {
      link.addEventListener('mouseenter', () => {
        if (!this.enabled || !this.ctx) return;
        const noteFreq = this.navScale[idx % this.navScale.length];
        this.playHarmonicNote(noteFreq);
      });
    });

    // Delegate listeners for interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a:not(.nav-link), button:not(#sound-toggle), .filter-chip, .t-cmd-btn, .contact-action-card, .tab-btn, .telemetry-pill');
      if (target && this.enabled) {
        this.playHoverTone();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.enabled || !this.ctx || e.target.closest('#sound-toggle')) return;

      // Photography Shutter Tone on project architecture or card clicks
      const shutterTarget = e.target.closest('[data-project-trigger], .project-card-tilt, .btn-primary, .optics-meta-stamp');
      if (shutterTarget) {
        this.playShutterTone();
      } else {
        this.playClickTone();
      }
    });
  }

  updateUI() {
    if (this.enabled) {
      this.toggleBtn.classList.add('sound-on');
      const textSpan = this.toggleBtn.querySelector('.sound-text');
      if (textSpan) textSpan.textContent = '432Hz SFX ON';
    } else {
      this.toggleBtn.classList.remove('sound-on');
      const textSpan = this.toggleBtn.querySelector('.sound-text');
      if (textSpan) textSpan.textContent = 'SFX OFF';
    }
  }

  /**
   * Delicate acoustic chime note for D-minor scale navigation
   */
  playHarmonicNote(freq) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  /**
   * Crisp dual-action mechanical camera shutter sound (Photographer touch)
   */
  playShutterTone() {
    try {
      const now = this.ctx.currentTime;
      // Front shutter curtain (mechanical tick)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.025);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.025);

      // Rear shutter curtain (mirror flip click after 45ms)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(850, now + 0.045);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.085);
      gain2.gain.setValueAtTime(0.06, now + 0.045);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.045);
      osc2.stop(now + 0.085);
    } catch (e) {}
  }

  playHoverTone() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(864, this.ctx.currentTime); // 2 * 432 Hz
      osc.frequency.exponentialRampToValueAtTime(1296, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  playClickTone() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(432, this.ctx.currentTime); // 432 Hz
      osc.frequency.exponentialRampToValueAtTime(216, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  /**
   * Rich D-Minor cinematic drone chord when activating sound (432 Hz tuning)
   */
  playCinematicHarmonicChord() {
    if (!this.ctx) return;
    try {
      // D2, A2, D3, F3, A3
      const chord = [72.08, 108.00, 144.17, 171.44, 216.00];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx < 2 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0.03 / (idx + 1), startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch (e) {}
  }
}

window.AudioSynth = new AudioSynthesizer();
