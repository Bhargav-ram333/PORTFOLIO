/**
 * Futuristic Web Audio Synthesizer for Portfolio UI Micro-Interactions
 * Chiravuri Satya Siva Bhargav Portfolio
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.toggleBtn = document.getElementById('sound-toggle');
    
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
        this.playSuccessTone();
      }
    });

    // Attach listeners to interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .filter-chip, .t-cmd-btn, .contact-action-card, .tab-btn');
      if (target && this.enabled) {
        this.playHoverTone();
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .btn, .filter-chip, .tab-btn, .contact-action-card');
      if (target && this.enabled && target !== this.toggleBtn) {
        this.playClickTone();
      }
    });
  }

  updateUI() {
    if (this.enabled) {
      this.toggleBtn.classList.add('sound-on');
      const textSpan = this.toggleBtn.querySelector('.sound-text');
      if (textSpan) textSpan.textContent = 'SFX ON';
    } else {
      this.toggleBtn.classList.remove('sound-on');
      const textSpan = this.toggleBtn.querySelector('.sound-text');
      if (textSpan) textSpan.textContent = 'SFX OFF';
    }
  }

  playHoverTone() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // AudioContext policy suppression fallback
    }
  }

  playClickTone() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      // ignore
    }
  }

  playSuccessTone() {
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.15);
      });
    } catch (e) {
      // ignore
    }
  }
}

window.AudioSynth = new AudioSynthesizer();
