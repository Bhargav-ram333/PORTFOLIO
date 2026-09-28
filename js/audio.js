/**
 * Audio Engine & Welcome Theme
 * Portfolio of Chiravuri Satya Siva Bhargav
 * Features:
 *  - Automatic welcoming melody: "Svagatham Susvagatham" (స్వాగతం సుస్వాగతం)
 *  - Realistic Crow Caw sound trigger for the flying crow cursor
 *  - Interactive feedback synthesis (confetti, terminal hire protocol)
 */

class AudioEngine {
  constructor() {
    this.welcomeSongUrl = 'assets/svagatham_song.wav';
    this.crowCawUrl = 'assets/crow_caw.wav';

    this.welcomeAudio = null;
    this.crowAudio = null;
    this.welcomePlayed = false;

    this.initAudioElements();
    this.initAutoPlayWelcome();
  }

  initAudioElements() {
    // 1. Welcome Song Audio Element
    this.welcomeAudio = new Audio(this.welcomeSongUrl);
    this.welcomeAudio.preload = 'auto';
    this.welcomeAudio.volume = 0.85;

    // 2. Crow Caw Audio Element (preloaded for instant latency-free caw)
    this.crowAudio = new Audio(this.crowCawUrl);
    this.crowAudio.preload = 'auto';
    this.crowAudio.volume = 0.75;
  }

  /**
   * Play "Svagatham Susvagatham" welcoming theme when opening website
   */
  initAutoPlayWelcome() {
    const playSong = () => {
      if (this.welcomePlayed) return;

      const promise = this.welcomeAudio.play();
      if (promise !== undefined) {
        promise.then(() => {
          this.welcomePlayed = true;
          this.renderMusicBadge();
          this.removeGestureListeners();
        }).catch(() => {
          // Autoplay was blocked by browser security policy; will play on first gesture
        });
      }
    };

    const gestureUnlock = () => {
      if (this.welcomePlayed) return;
      playSong();
    };

    this.gestureHandler = gestureUnlock;

    // Try immediately upon script execution & DOM readiness
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      playSong();
    } else {
      window.addEventListener('DOMContentLoaded', playSong);
    }

    // Attach user gesture listeners to guarantee playback on first click, touch, or scroll
    window.addEventListener('pointerdown', gestureUnlock, { once: true });
    window.addEventListener('click', gestureUnlock, { once: true });
    window.addEventListener('touchstart', gestureUnlock, { once: true });
    window.addEventListener('keydown', gestureUnlock, { once: true });
    window.addEventListener('scroll', gestureUnlock, { once: true });
  }

  removeGestureListeners() {
    if (!this.gestureHandler) return;
    window.removeEventListener('pointerdown', this.gestureHandler);
    window.removeEventListener('click', this.gestureHandler);
    window.removeEventListener('touchstart', this.gestureHandler);
    window.removeEventListener('keydown', this.gestureHandler);
    window.removeEventListener('scroll', this.gestureHandler);
  }

  /**
   * Display sleek floating music badge when "Svagatham Susvagatham" plays
   */
  renderMusicBadge() {
    let badge = document.getElementById('welcome-music-pill');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'welcome-music-pill';
      badge.className = 'welcome-music-pill';
      badge.innerHTML = `
        <div class="music-pill-icon">
          <span class="music-clef">🎵</span>
          <div class="music-wave-bars">
            <span class="bar b1"></span>
            <span class="bar b2"></span>
            <span class="bar b3"></span>
            <span class="bar b4"></span>
          </div>
        </div>
        <div class="music-pill-text">
          <span class="music-telugu-title">స్వాగతం సుస్వాగతం</span>
          <span class="music-sub-title">Svagatham Susvagatham • Now Playing</span>
        </div>
        <button class="music-pill-close" title="Mute/Stop Song" aria-label="Stop audio">&times;</button>
      `;

      document.body.appendChild(badge);

      // Close button
      const closeBtn = badge.querySelector('.music-pill-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.welcomeAudio) {
            this.welcomeAudio.pause();
          }
          badge.classList.add('fade-out');
          setTimeout(() => badge.remove(), 400);
        });
      }

      // Smooth fade out when track finishes
      this.welcomeAudio.addEventListener('ended', () => {
        badge.classList.add('fade-out');
        setTimeout(() => badge.remove(), 1200);
      });
    }
  }

  /**
   * Authentic Crow Cawing sound trigger
   */
  playCrowCaw() {
    if (!this.crowAudio) return;
    try {
      // Clone or reset to allow rapid successive caws
      const cawClone = this.crowAudio.cloneNode();
      cawClone.volume = 0.7;
      cawClone.play().catch(() => {});
    } catch (e) {
      try {
        this.crowAudio.currentTime = 0;
        this.crowAudio.play().catch(() => {});
      } catch (err) {}
    }
  }

  /**
   * Celebratory sound for terminal 'sudo hire' and form submit
   */
  playSuccessTone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [554.37, 659.25, 830.61, 1108.74]; // Warm celebratory arpeggio
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        const startTime = ctx.currentTime + idx * 0.05;
        gain.gain.setValueAtTime(0.04, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }
}

window.AudioSynth = new AudioEngine();
