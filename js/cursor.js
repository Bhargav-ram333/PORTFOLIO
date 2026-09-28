/**
 * Cybernetic Custom Fluid Glowing Cursor & Particle Spark System
 */

class InteractiveCursor {
  constructor() {
    // Only initialize if device has fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor-dot';

    this.ring = document.createElement('div');
    this.ring.className = 'custom-cursor-ring';

    this.cursorText = document.createElement('span');
    this.cursorText.className = 'cursor-text';
    this.ring.appendChild(this.cursorText);

    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);

    this.mouse = { x: -100, y: -100 };
    this.dotPos = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.lerpSpeed = 0.18;

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99997';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.sparks = [];
    this.resizeCanvas();

    this.initEvents();
    this.render();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Create occasional subtle trail sparks on movement
      if (Math.random() < 0.2) {
        this.addSpark(e.clientX, e.clientY, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 2, 'rgba(0, 242, 254, 0.7)');
      }
    });

    window.addEventListener('mousedown', (e) => {
      // Burst of glowing sparks on click
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
        const speed = 2 + Math.random() * 3.5;
        const color = Math.random() < 0.5 ? 'rgba(0, 242, 254, 0.9)' : 'rgba(157, 78, 221, 0.9)';
        this.addSpark(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed, 3.5, color);
      }
      this.ring.style.transform = `translate(-50%, -50%) scale(0.8)`;
    });

    window.addEventListener('mouseup', () => {
      this.ring.style.transform = `translate(-50%, -50%) scale(1)`;
    });

    // Delegate hover listeners
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .project-card-tilt, .contact-action-card, .t-cmd-btn');
      if (!target) return;

      const cursorType = target.getAttribute('data-cursor');

      if (cursorType === 'view' || target.classList.contains('project-card-tilt')) {
        document.body.classList.add('cursor-view');
        this.cursorText.textContent = 'EXPLORE';
      } else if (cursorType === 'copy' || target.classList.contains('contact-action-card')) {
        document.body.classList.add('cursor-copy');
        this.cursorText.textContent = 'COPY';
      } else {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .project-card-tilt, .contact-action-card, .t-cmd-btn');
      if (!target) return;
      document.body.classList.remove('cursor-hover', 'cursor-view', 'cursor-copy');
      this.cursorText.textContent = '';
    });
  }

  addSpark(x, y, vx, vy, size, color) {
    this.sparks.push({
      x,
      y,
      vx,
      vy,
      size,
      alpha: 1,
      color,
      decay: 0.035 + Math.random() * 0.02
    });
  }

  render() {
    requestAnimationFrame(() => this.render());

    // Lerp smoothing for cursor dot and ring
    this.dotPos.x += (this.mouse.x - this.dotPos.x) * 0.65;
    this.dotPos.y += (this.mouse.y - this.dotPos.y) * 0.65;

    this.ringPos.x += (this.mouse.x - this.ringPos.x) * this.lerpSpeed;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * this.lerpSpeed;

    this.dot.style.transform = `translate(${this.dotPos.x}px, ${this.dotPos.y}px)`;
    this.ring.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px)`;

    // Render Canvas Sparks
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new InteractiveCursor();
});
