/**
 * Interactive Audio Synthesizer Engine
 * Portfolio of Chiravuri Satya Siva Bhargav
 * Clean, futuristic Web Audio API UI feedback tones
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

    // Subtle hover sounds on interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button:not(#sound-toggle), .filter-chip, .t-cmd-btn, .contact-action-card, .tab-btn');
      if (target && this.enabled) {
        this.playHoverTone();
      }
    });

    // Click sounds on interactive elements
    document.addEventListener('click', (e) => {
      if (!this.enabled || !this.ctx || e.target.closest('#sound-toggle')) return;
      this.playClickTone();
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
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playClickTone() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playSuccessTone() {
    if (!this.enabled || !this.ctx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C-Major arpeggio
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        const startTime = this.ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.03, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {}
  }
}

window.AudioSynth = new AudioSynthesizer();
