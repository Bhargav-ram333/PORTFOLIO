/**
 * Audio Engine & Welcome Theme
 * Portfolio of Chiravuri Satya Siva Bhargav
 *
 * Features:
 *  - Direct playback of "Swagatham Suswagatham" (స్వాగతం సుస్వాగతం) on site open
 *  - Dual-pipeline audio engine: Web Audio API (zero-latency in-memory decoding) + HTML5 Audio fallback
 *  - Universal browser compatibility (Safari, Chrome, Firefox, Edge, iOS, Android)
 *  - Ultra-responsive multi-event audio unlocking (pointerdown, click, touchstart, keydown, scroll, mousemove)
 *  - Pristine, studio-isolated Indian Crow double-caw with zero background noise
 */

class AudioEngine {
  constructor() {
    this.welcomeM4aUrl = 'assets/svagatham_song.m4a';
    this.welcomeWavUrl = 'assets/svagatham_song.wav';
    this.crowM4aUrl = 'assets/crow_caw.m4a';
    this.crowWavUrl = 'assets/crow_caw.wav';

    this.welcomeAudio = null;
    this.crowAudio = null;
    this.welcomePlayed = false;
    this.lastCawTime = 0;

    // Web Audio API Context & Buffers
    this.audioCtx = null;
    this.welcomeBuffer = null;
    this.crowBuffer = null;
    this.welcomeBufferSource = null;

    this.initAudioContext();
    this.initHTMLAudio();
    this.preloadAudioBuffers();
    this.initDirectPlayback();
  }

  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('[AudioEngine] Web Audio API not supported, falling back to HTML5 audio', e);
    }
  }

  initHTMLAudio() {
    const existingAudio = document.getElementById('welcome-audio');
    if (existingAudio) {
      this.welcomeAudio = existingAudio;
    } else {
      this.welcomeAudio = new Audio();
      this.welcomeAudio.id = 'welcome-audio';
      this.welcomeAudio.preload = 'auto';
      const s1 = document.createElement('source');
      s1.src = this.welcomeM4aUrl;
      s1.type = 'audio/mp4';
      const s2 = document.createElement('source');
      s2.src = this.welcomeWavUrl;
      s2.type = 'audio/wav';
      this.welcomeAudio.appendChild(s1);
      this.welcomeAudio.appendChild(s2);
      document.body.appendChild(this.welcomeAudio);
    }
    this.welcomeAudio.volume = 0.9;

    this.crowAudio = new Audio(this.crowM4aUrl);
    this.crowAudio.preload = 'auto';
    this.crowAudio.volume = 0.85;
  }

  preloadAudioBuffers() {
    if (!this.audioCtx) return;

    // 1. Preload Welcome Song (.m4a first, .wav fallback)
    fetch(this.welcomeM4aUrl)
      .then((r) => {
        if (!r.ok) throw new Error('m4a fetch failed');
        return r.arrayBuffer();
      })
      .then((buf) => this.audioCtx.decodeAudioData(buf))
      .then((decoded) => {
        this.welcomeBuffer = decoded;
        if (!this.welcomePlayed && this.audioCtx.state === 'running') {
          this.playWelcome();
        }
      })
      .catch(() => {
        fetch(this.welcomeWavUrl)
          .then((r) => r.arrayBuffer())
          .then((buf) => this.audioCtx.decodeAudioData(buf))
          .then((decoded) => {
            this.welcomeBuffer = decoded;
            if (!this.welcomePlayed && this.audioCtx.state === 'running') {
              this.playWelcome();
            }
          })
          .catch(() => {});
      });

    // 2. Preload Studio-Clean Crow Caw
    fetch(this.crowM4aUrl)
      .then((r) => {
        if (!r.ok) throw new Error('crow m4a fetch failed');
        return r.arrayBuffer();
      })
      .then((buf) => this.audioCtx.decodeAudioData(buf))
      .then((decoded) => {
        this.crowBuffer = decoded;
      })
      .catch(() => {
        fetch(this.crowWavUrl)
          .then((r) => r.arrayBuffer())
          .then((buf) => this.audioCtx.decodeAudioData(buf))
          .then((decoded) => {
            this.crowBuffer = decoded;
          })
          .catch(() => {});
      });
  }

  /**
   * Play "Swagatham Suswagatham" directly when the website opens
   */
  initDirectPlayback() {
    // If HTML5 element is already playing from autoplay
    if (this.welcomeAudio && !this.welcomeAudio.paused && this.welcomeAudio.currentTime > 0) {
      this.onWelcomeStarted();
      return;
    }

    if (this.welcomeAudio) {
      this.welcomeAudio.addEventListener('playing', () => this.onWelcomeStarted(), { once: true });
    }

    // Try playing immediately
    this.playWelcome();

    // Setup global interaction unlocking
    this.unlockHandler = () => {
      if (!this.welcomePlayed) {
        this.playWelcome();
      }
    };

    const gestureEvents = ['pointerdown', 'mousedown', 'touchstart', 'click', 'keydown'];
    const ambientEvents = ['mousemove', 'mouseenter', 'mouseover', 'scroll', 'wheel', 'focus'];

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, this.unlockHandler, { capture: true, once: true });
    });

    ambientEvents.forEach((evt) => {
      window.addEventListener(evt, this.unlockHandler, { passive: true, once: true });
    });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => this.playWelcome());
    }
    window.addEventListener('load', () => this.playWelcome());
  }

  playWelcome() {
    if (this.welcomePlayed) return;

    // 1. Resume AudioContext
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().then(() => {
        if (!this.welcomePlayed && this.welcomeBuffer) {
          this.startBufferPlayback();
        }
      }).catch(() => {});
    }

    // 2. If Web Audio buffer is ready, start it
    if (this.audioCtx && this.audioCtx.state === 'running' && this.welcomeBuffer) {
      this.startBufferPlayback();
      return;
    }

    // 3. Simultaneously trigger HTML5 audio element
    if (this.welcomeAudio) {
      const p = this.welcomeAudio.play();
      if (p !== undefined) {
        p.then(() => {
          this.onWelcomeStarted();
        }).catch(() => {
          // Browser requires ambient engagement, will auto-play on first motion or focus
        });
      }
    }
  }

  startBufferPlayback() {
    if (this.welcomePlayed || !this.audioCtx || !this.welcomeBuffer) return;
    try {
      const source = this.audioCtx.createBufferSource();
      source.buffer = this.welcomeBuffer;
      source.loop = false;
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.value = 0.9;
      source.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      source.start(0);
      this.welcomeBufferSource = source;

      source.onended = () => {
        const badge = document.getElementById('welcome-music-pill');
        if (badge) {
          badge.classList.add('fade-out');
          setTimeout(() => badge.remove(), 1200);
        }
      };

      this.onWelcomeStarted();
    } catch (e) {
      console.warn('[AudioEngine] Buffer play error', e);
    }
  }

  onWelcomeStarted() {
    if (this.welcomePlayed) return;
    this.welcomePlayed = true;
    this.renderMusicBadge();
    this.removeUnlockListeners();
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
          this.stopWelcome();
          badge.classList.add('fade-out');
          setTimeout(() => badge.remove(), 400);
        });
      }

      if (this.welcomeAudio) {
        this.welcomeAudio.addEventListener('ended', () => {
          badge.classList.add('fade-out');
          setTimeout(() => badge.remove(), 1200);
        });
      }
    }
  }

  stopWelcome() {
    if (this.welcomeAudio) {
      try { this.welcomeAudio.pause(); } catch (e) {}
    }
    if (this.welcomeBufferSource) {
      try { this.welcomeBufferSource.stop(); } catch (e) {}
      this.welcomeBufferSource = null;
    }
  }

  /**
   * Pristine, studio-isolated Indian Crow Caw trigger with zero background noise
   */
  playCrowCaw() {
    const now = Date.now();
    if (now - this.lastCawTime < 380) return;
    this.lastCawTime = now;

    // 1. Try Web Audio buffer for zero latency & pristine fidelity
    if (this.audioCtx && this.crowBuffer) {
      try {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.crowBuffer;
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.value = 0.85;
        source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        source.start(0);
        return;
      } catch (err) {
        console.warn('[AudioEngine] Crow buffer playback error', err);
      }
    }

    // 2. Fallback to HTML5 audio
    if (this.crowAudio) {
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
  }

  /**
   * Celebratory sound for sudo hire / form transmission
   */
  playSuccessTone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = this.audioCtx || new AudioCtx();
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
