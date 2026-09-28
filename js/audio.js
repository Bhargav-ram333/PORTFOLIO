/**
 * Audio Engine & Welcome Theme
 * Portfolio of Chiravuri Satya Siva Bhargav
 *
 * Features:
 *  - Direct playback of "Swagatham Suswagatham" (స్వాగతం సుస్వాగతం) on site open
 *  - Ultra-responsive multi-event audio unlocking (mousemove, mouseenter, scroll, touch, click)
 *  - Authentic Indian Crow caw playback on cursor click
 */

class AudioEngine {
  constructor() {
    this.welcomeSongUrl = 'assets/svagatham_song.wav';
    this.crowCawUrl = 'assets/crow_caw.wav';

    this.welcomeAudio = null;
    this.crowAudio = null;
    this.welcomePlayed = false;

    this.initAudioElements();
    this.initDirectPlayback();
  }

  initAudioElements() {
    // 1. Welcome Song
    const existingAudio = document.getElementById('welcome-audio');
    if (existingAudio) {
      this.welcomeAudio = existingAudio;
    } else {
      this.welcomeAudio = new Audio(this.welcomeSongUrl);
      this.welcomeAudio.id = 'welcome-audio';
      this.welcomeAudio.preload = 'auto';
      document.body.appendChild(this.welcomeAudio);
    }
    this.welcomeAudio.volume = 0.9;

    // 2. Original Indian Crow Caw Audio
    this.crowAudio = new Audio(this.crowCawUrl);
    this.crowAudio.preload = 'auto';
    this.crowAudio.volume = 0.85;
  }

  /**
   * Play "Swagatham Susvagatham" directly when the website opens
   */
  initDirectPlayback() {
    const handleStarted = () => {
      this.welcomePlayed = true;
      this.renderMusicBadge();
      this.removeUnlockListeners();
      const hint = document.getElementById('welcome-audio-hint');
      if (hint) hint.remove();
    };

    if (this.welcomeAudio && !this.welcomeAudio.paused && this.welcomeAudio.currentTime > 0) {
      handleStarted();
      return;
    }

    if (this.welcomeAudio) {
      this.welcomeAudio.addEventListener('playing', handleStarted, { once: true });
    }

    const startSong = () => {
      if (this.welcomePlayed) return;

      const promise = this.welcomeAudio.play();
      if (promise !== undefined) {
        promise.then(() => {
          handleStarted();
        }).catch((err) => {
          // If browser policy deferred sound, show subtle tap-to-play hint banner
          this.showAudioHint();
        });
      }
    };

    // Instant attempt on invocation
    startSong();

    // Setup unlock handlers on user interactions
    const gestureEvents = ['pointerdown', 'mousedown', 'click', 'touchstart', 'keydown'];
    const ambientEvents = ['mousemove', 'mouseenter', 'mouseover', 'scroll', 'wheel', 'focus'];

    this.unlockHandler = () => {
      if (!this.welcomePlayed) {
        startSong();
      }
    };

    ambientEvents.forEach((evt) => {
      window.addEventListener(evt, this.unlockHandler, { passive: true, once: true });
    });

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, this.unlockHandler, { capture: true, once: true });
    });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', startSong);
    }
    window.addEventListener('load', startSong);
  }

  removeUnlockListeners() {
    if (!this.unlockHandler) return;
    const allEvents = [
      'pointerdown',
      'mousedown',
      'click',
      'touchstart',
      'keydown',
      'mousemove',
      'mouseenter',
      'mouseover',
      'scroll',
      'wheel',
      'focus'
    ];
    allEvents.forEach((evt) => {
      window.removeEventListener(evt, this.unlockHandler, { capture: true });
      window.removeEventListener(evt, this.unlockHandler, { passive: true });
      window.removeEventListener(evt, this.unlockHandler);
    });
  }

  showAudioHint() {
    if (this.welcomePlayed || document.getElementById('welcome-audio-hint')) return;

    const hint = document.createElement('div');
    hint.id = 'welcome-audio-hint';
    hint.className = 'welcome-audio-hint';
    hint.innerHTML = `
      <div class="audio-hint-inner">
        <span class="hint-pulse">🎵</span>
        <span class="hint-text">నమస్కారం! Click anywhere to play <strong>స్వాగతం సుస్వాగతం</strong></span>
      </div>
    `;

    hint.addEventListener('click', () => {
      this.welcomeAudio.play().then(() => {
        this.welcomePlayed = true;
        this.renderMusicBadge();
        hint.remove();
      }).catch(() => {});
    });

    document.body.appendChild(hint);
  }

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
          <span class="music-sub-title">Swagatham Suswagatham • Playing</span>
        </div>
        <button class="music-pill-close" title="Mute/Stop Song" aria-label="Stop audio">&times;</button>
      `;

      document.body.appendChild(badge);

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

      this.welcomeAudio.addEventListener('ended', () => {
        badge.classList.add('fade-out');
        setTimeout(() => badge.remove(), 1200);
      });
    }
  }

  /**
   * Authentic Indian Crow Caw trigger
   */
  playCrowCaw() {
    if (!this.crowAudio) return;
    try {
      const cawClone = this.crowAudio.cloneNode();
      cawClone.volume = 0.85;
      cawClone.play().catch(() => {});
    } catch (e) {
      try {
        this.crowAudio.currentTime = 0;
        this.crowAudio.play().catch(() => {});
      } catch (err) {}
    }
  }

  /**
   * Celebratory sound for sudo hire / form transmission
   */
  playSuccessTone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [554.37, 659.25, 830.61, 1108.74];
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
