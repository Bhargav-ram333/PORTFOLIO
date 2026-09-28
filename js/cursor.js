/**
 * Majestic Flying Crow Cursor & Feather/Ember Particle Engine
 * Custom soaring raven simulation with aerodynamic banking, dynamic wing flap physics,
 * drifting charcoal feather trails, and molten ember bursts.
 */

class FlyingCrowCursor {
  constructor() {
    // Only initialize if device has fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Create the flying crow DOM element
    this.crow = document.createElement('div');
    this.crow.className = 'custom-crow-cursor';
    this.crow.setAttribute('aria-hidden', 'true');

    // Inline crisp SVG crow silhouette with articulated wings, sharp beak, and ruby eyes
    this.crow.innerHTML = `
      <svg class="crow-svg" viewBox="0 0 60 50" width="46" height="38">
        <defs>
          <filter id="crowEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Dynamic Flight Container -->
        <g class="crow-flight-group">
          <!-- Raven Wedge Tail Feathers -->
          <path class="crow-tail" d="M26,28 L22,46 L30,48 L38,46 L34,28 Z" fill="#08090d" stroke="#ff2a42" stroke-width="0.5" stroke-opacity="0.5" />
          <path d="M26,30 L27,45 M30,30 L30,47 M34,30 L33,45" stroke="#161822" stroke-width="0.75" />

          <!-- Left Wing (Hinged at shoulder joint x=25, y=17) -->
          <g class="crow-wing-left">
            <path d="M25,17 C18,13 10,11 2,12 C1,13 0,15 1,17 C4,20 8,22 12,23 C16,24 21,23 25,21 Z" 
                  fill="#0a0c13" stroke="#ff2a42" stroke-width="0.6" stroke-opacity="0.6" />
            <!-- Fingered Primary Feather Tips -->
            <path d="M2,12 C-1,14 0,17 3,18 M4,18 C2,20 4,22 7,22 M8,22 C6,24 9,25 12,24" 
                  stroke="#050608" stroke-width="1.2" fill="none" />
            <!-- Secondary Wing Feather Lines -->
            <path d="M21,17 C15,15 9,16 4,15 M22,19 C17,18 12,20 7,20" 
                  stroke="#1c1f2e" stroke-width="0.7" fill="none" />
          </g>

          <!-- Right Wing (Hinged at shoulder joint x=35, y=17) -->
          <g class="crow-wing-right">
            <path d="M35,17 C42,13 50,11 58,12 C59,13 60,15 59,17 C56,20 52,22 48,23 C44,24 39,23 35,21 Z" 
                  fill="#0a0c13" stroke="#ff2a42" stroke-width="0.6" stroke-opacity="0.6" />
            <!-- Fingered Primary Feather Tips -->
            <path d="M58,12 C61,14 60,17 57,18 M56,18 C58,20 56,22 53,22 M52,22 C54,24 51,25 48,24" 
                  stroke="#050608" stroke-width="1.2" fill="none" />
            <!-- Secondary Wing Feather Lines -->
            <path d="M39,17 C45,15 51,16 56,15 M38,19 C43,18 48,20 53,20" 
                  stroke="#1c1f2e" stroke-width="0.7" fill="none" />
          </g>

          <!-- Sleek Torso -->
          <path class="crow-torso" d="M26,14 C25,18 24,23 26,29 C28,31 32,31 34,29 C36,23 35,18 34,14 Z" 
                fill="#0b0d14" stroke="#ff2a42" stroke-width="0.5" stroke-opacity="0.4" />

          <!-- Head & Razor Curved Beak (Tip at x=30, y=2) -->
          <path class="crow-beak" d="M28.5,8 L30,2 L31.5,8 Z" fill="#181a24" stroke="#ffa200" stroke-width="0.6" />
          <path class="crow-head" d="M27,14 C26.5,10 28,7 30,7 C32,7 33.5,10 33,14 Z" fill="#08090d" />

          <!-- Ruby / Amber Molten Eyes -->
          <circle cx="28.5" cy="8.5" r="1.1" fill="#ff2a42" filter="url(#crowEyeGlow)" />
          <circle cx="31.5" cy="8.5" r="1.1" fill="#ff2a42" filter="url(#crowEyeGlow)" />
          <circle cx="28.5" cy="8.5" r="0.45" fill="#ffa200" />
          <circle cx="31.5" cy="8.5" r="0.45" fill="#ffa200" />
        </g>
      </svg>
    `;

    document.body.appendChild(this.crow);

    // Reference wing elements for dynamic rotation & flapping
    this.leftWing = this.crow.querySelector('.crow-wing-left');
    this.rightWing = this.crow.querySelector('.crow-wing-right');

    // Action indicator pill (appears beside the crow on hoverable targets)
    this.actionPill = document.createElement('div');
    this.actionPill.className = 'crow-action-pill';
    this.actionPill.textContent = 'EXPLORE';
    document.body.appendChild(this.actionPill);

    // Particle Canvas for drifting feathers and fire embers
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'crow-particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99997';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Position, motion, and animation variables
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.crowPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.velocity = { x: 0, y: 0, speed: 0 };

    this.headingAngle = 0; // Degrees
    this.targetHeading = 0;
    this.bankAngle = 0;
    this.flapPhase = 0;

    this.feathers = [];
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

      // Shed drifting feathers periodically during active flight
      if (this.velocity.speed > 3 && Math.random() < 0.22) {
        this.addFeather(
          this.crowPos.x + (Math.random() - 0.5) * 16,
          this.crowPos.y + (Math.random() - 0.5) * 16,
          -this.velocity.x * 0.15 + (Math.random() - 0.5) * 1.5,
          -this.velocity.y * 0.15 + (Math.random() * 0.8 + 0.5)
        );
      }

      // Shed molten embers from the crow's wake
      if (Math.random() < 0.32) {
        const emberColor = Math.random() < 0.55 ? 'rgba(255, 42, 66, 0.9)' : 'rgba(255, 107, 53, 0.9)';
        this.addSpark(
          this.crowPos.x + (Math.random() - 0.5) * 12,
          this.crowPos.y + 12 + Math.random() * 6,
          (Math.random() - 0.5) * 1.8,
          -0.5 - Math.random() * 1.6,
          2.4,
          emberColor
        );
      }
    });

    window.addEventListener('mousedown', (e) => {
      // Rapid dive / wing attack stance
      this.crow.style.transform = `translate(${this.crowPos.x}px, ${this.crowPos.y}px) scale(0.82) rotate(${this.headingAngle}deg)`;

      // Burst of fiery embers on strike
      const emberColors = ['#ff2a42', '#ff6b35', '#ffa200', '#ffd166'];
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
        const speed = 2.2 + Math.random() * 4.5;
        const color = emberColors[Math.floor(Math.random() * emberColors.length)];
        this.addSpark(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.8, 3.4, color);
      }

      // Shed burst of black crow feathers
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 2.2;
        this.addFeather(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed + 0.8);
      }
    });

    window.addEventListener('mouseup', () => {
      this.crow.style.transform = `translate(${this.crowPos.x}px, ${this.crowPos.y}px) scale(1) rotate(${this.headingAngle}deg)`;
    });

    // Delegate hover listeners for interactive feedback
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .project-card-tilt, .contact-action-card, .t-cmd-btn, .filter-chip, .tab-btn');
      if (!target) return;

      const cursorType = target.getAttribute('data-cursor');

      if (cursorType === 'view' || target.classList.contains('project-card-tilt')) {
        document.body.classList.add('cursor-view');
        this.actionPill.textContent = 'EXPLORE';
      } else if (cursorType === 'copy' || target.classList.contains('contact-action-card')) {
        document.body.classList.add('cursor-copy');
        this.actionPill.textContent = 'COPY';
      } else if (target.tagName.toLowerCase() === 'a' && target.getAttribute('download')) {
        document.body.classList.add('cursor-hover');
        this.actionPill.textContent = 'DOWNLOAD';
      } else {
        document.body.classList.add('cursor-hover');
        this.actionPill.textContent = 'ENGAGE';
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .project-card-tilt, .contact-action-card, .t-cmd-btn, .filter-chip, .tab-btn');
      if (!target) return;
      document.body.classList.remove('cursor-hover', 'cursor-view', 'cursor-copy');
    });
  }

  addFeather(x, y, vx, vy) {
    this.feathers.push({
      x,
      y,
      vx,
      vy,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.04 + Math.random() * 0.03,
      size: 9 + Math.random() * 7,
      alpha: 0.95,
      decay: 0.012 + Math.random() * 0.008
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
      decay: 0.032 + Math.random() * 0.02
    });
  }

  render() {
    requestAnimationFrame(() => this.render());

    // Calculate instantaneous mouse velocity
    const dx = this.mouse.x - this.lastMouse.x;
    const dy = this.mouse.y - this.lastMouse.y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.velocity.speed = Math.hypot(dx, dy);

    this.lastMouse.x = this.mouse.x;
    this.lastMouse.y = this.mouse.y;

    // Smooth position interpolation (spring-lerp)
    this.crowPos.x += (this.mouse.x - this.crowPos.x) * 0.28;
    this.crowPos.y += (this.mouse.y - this.crowPos.y) * 0.28;

    // Calculate flight vector heading angle
    if (this.velocity.speed > 1.2) {
      // 90deg offset because SVG crow points UP at 0deg
      this.targetHeading = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
    }

    // Shortest-arc smooth angle interpolation
    let angleDiff = this.targetHeading - this.headingAngle;
    while (angleDiff < -180) angleDiff += 360;
    while (angleDiff > 180) angleDiff -= 360;
    this.headingAngle += angleDiff * 0.16;

    // Aerodynamic banking roll based on lateral turn velocity
    const targetBank = Math.max(-24, Math.min(24, dx * 1.2));
    this.bankAngle += (targetBank - this.bankAngle) * 0.2;

    // Dynamic wing flap frequency: flaps rapidly during fast flight, glides gently when soaring
    if (this.velocity.speed > 1.5) {
      this.flapPhase += 0.18 + Math.min(this.velocity.speed, 20) * 0.04;
      const flapAmp = 26; // Flap angle amplitude
      const flapAngle = Math.sin(this.flapPhase) * flapAmp;

      if (this.leftWing && this.rightWing) {
        this.leftWing.style.transform = `rotate(${flapAngle}deg) scaleY(${1 - Math.abs(flapAngle) * 0.01})`;
        this.rightWing.style.transform = `rotate(${-flapAngle}deg) scaleY(${1 - Math.abs(flapAngle) * 0.01})`;
      }
    } else {
      // Stationary glide: gentle thermal soaring breath
      this.flapPhase += 0.04;
      const flapAngle = Math.sin(this.flapPhase) * 5;
      if (this.leftWing && this.rightWing) {
        this.leftWing.style.transform = `rotate(${flapAngle}deg)`;
        this.rightWing.style.transform = `rotate(${-flapAngle}deg)`;
      }
    }

    // Apply 3D aerodynamic flight transformation to crow
    // Beak tip (x=30, y=2) sits right under the pointer coordinate
    this.crow.style.transform = `translate(${this.crowPos.x}px, ${this.crowPos.y}px) translate(-50%, -12%) rotate(${this.headingAngle}deg) skewX(${this.bankAngle * 0.35}deg)`;

    // Position action pill near the crow
    if (this.actionPill) {
      this.actionPill.style.transform = `translate(${this.crowPos.x + 24}px, ${this.crowPos.y + 14}px)`;
    }

    // Render Canvas: Feathers & Embers
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Drifting Raven Feathers
    for (let i = this.feathers.length - 1; i >= 0; i--) {
      const f = this.feathers[i];
      f.swayPhase += f.swaySpeed;
      f.x += f.vx + Math.sin(f.swayPhase) * 0.9;
      f.y += f.vy;
      f.angle += f.rotSpeed;
      f.alpha -= f.decay;

      if (f.alpha <= 0) {
        this.feathers.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = f.alpha;
      this.ctx.translate(f.x, f.y);
      this.ctx.rotate(f.angle);

      // Feather Quill & Vane
      this.ctx.fillStyle = '#090a0f';
      this.ctx.beginPath();
      this.ctx.moveTo(0, -f.size);
      this.ctx.quadraticCurveTo(f.size * 0.42, 0, 0, f.size);
      this.ctx.quadraticCurveTo(-f.size * 0.42, 0, 0, -f.size);
      this.ctx.fill();

      // Molten rachis line (faint crimson spine)
      this.ctx.strokeStyle = `rgba(255, 42, 66, ${f.alpha * 0.75})`;
      this.ctx.lineWidth = 0.6;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -f.size * 0.9);
      this.ctx.lineTo(0, f.size * 0.9);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // 2. Fiery Embers
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

// Initialize flying crow cursor when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new FlyingCrowCursor();
});
