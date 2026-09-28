/**
 * Realistic Soaring Raven / Crow Cursor & Sound Engine
 * Portfolio of Chiravuri Satya Siva Bhargav
 * Features:
 *  - Anatomically authentic corvid silhouette with primary flight pinions & wedge tail
 *  - Aerodynamic banking, dynamic dihedral wing flap physics, and pitch-roll mechanics
 *  - Authentic crow cawing sound trigger on interaction with animated beak opening
 *  - Drifting charcoal feathers and molten ember particle engine
 */

class FlyingCrowCursor {
  constructor() {
    // Only initialize if device has fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Create the flying crow DOM element
    this.crow = document.createElement('div');
    this.crow.className = 'custom-crow-cursor';
    this.crow.setAttribute('aria-hidden', 'true');

    // Anatomically detailed Corvid silhouette with individual slotted flight pinions,
    // articulated maxilla beak, throat hackles, and glossy plumage sheen
    this.crow.innerHTML = `
      <svg class="crow-svg" viewBox="0 0 68 56" width="54" height="44">
        <defs>
          <filter id="crowEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="featherSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#141824" />
            <stop offset="50%" stop-color="#08090e" />
            <stop offset="100%" stop-color="#1c1622" />
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#161b28" />
            <stop offset="100%" stop-color="#07080c" />
          </linearGradient>
        </defs>

        <!-- Dynamic Flight Container -->
        <g class="crow-flight-group">
          <!-- Raven Wedge Tail Feathers (12 rectrices forming classic diamond wedge) -->
          <g class="crow-tail-group">
            <path class="crow-tail" d="M30,32 L24,52 L34,55 L44,52 L38,32 Z" fill="url(#wingGradient)" stroke="#ff2a42" stroke-width="0.5" stroke-opacity="0.4" />
            <path d="M28,34 L27,51 M31,34 L31,54 M34,34 L34,55 M37,34 L37,54 M40,34 L41,51" stroke="#222838" stroke-width="0.8" />
          </g>

          <!-- Left Wing (Hinged at shoulder joint x=29, y=20) -->
          <g class="crow-wing-left" style="transform-origin: 29px 20px;">
            <!-- Main Wing Arm & Secondary Coverts -->
            <path d="M29,20 C20,15 12,13 3,14 C1,16 1,18 2,20 C6,23 11,26 16,27 C21,28 26,26 29,24 Z" 
                  fill="url(#wingGradient)" stroke="#ff2a42" stroke-width="0.6" stroke-opacity="0.45" />
            <!-- Emarginated Primary Flight Pinions (6 slotted feathers) -->
            <path class="pinion-p1" d="M3,14 C-1,16 0,18 4,19" stroke="#050608" stroke-width="1.6" fill="none" />
            <path class="pinion-p2" d="M5,19 C1,21 3,23 7,23" stroke="#050608" stroke-width="1.5" fill="none" />
            <path class="pinion-p3" d="M8,23 C5,25 7,27 11,26" stroke="#050608" stroke-width="1.5" fill="none" />
            <path class="pinion-p4" d="M12,26 C9,28 12,30 16,28" stroke="#050608" stroke-width="1.4" fill="none" />
            <path class="pinion-p5" d="M17,28 C15,30 18,31 22,29" stroke="#050608" stroke-width="1.3" fill="none" />
            <!-- Feather Shaft Highlights -->
            <path d="M26,21 C18,18 10,19 4,18 M27,23 C20,22 14,24 8,24" stroke="#2a3245" stroke-width="0.65" fill="none" />
          </g>

          <!-- Right Wing (Hinged at shoulder joint x=39, y=20) -->
          <g class="crow-wing-right" style="transform-origin: 39px 20px;">
            <!-- Main Wing Arm & Secondary Coverts -->
            <path d="M39,20 C48,15 56,13 65,14 C67,16 67,18 66,20 C62,23 57,26 52,27 C47,28 42,26 39,24 Z" 
                  fill="url(#wingGradient)" stroke="#ff2a42" stroke-width="0.6" stroke-opacity="0.45" />
            <!-- Emarginated Primary Flight Pinions (6 slotted feathers) -->
            <path class="pinion-p1" d="M65,14 C69,16 68,18 64,19" stroke="#050608" stroke-width="1.6" fill="none" />
            <path class="pinion-p2" d="M63,19 C67,21 65,23 61,23" stroke="#050608" stroke-width="1.5" fill="none" />
            <path class="pinion-p3" d="M60,23 C63,25 61,27 57,26" stroke="#050608" stroke-width="1.5" fill="none" />
            <path class="pinion-p4" d="M56,26 C59,28 56,30 52,28" stroke="#050608" stroke-width="1.4" fill="none" />
            <path class="pinion-p5" d="M51,28 C53,30 50,31 46,29" stroke="#050608" stroke-width="1.3" fill="none" />
            <!-- Feather Shaft Highlights -->
            <path d="M42,21 C50,18 58,19 64,18 M41,23 C48,22 54,24 60,24" stroke="#2a3245" stroke-width="0.65" fill="none" />
          </g>

          <!-- Aerodynamic Torso with Mantle & Scapulars -->
          <path class="crow-torso" d="M30,17 C28,21 27,27 29,33 C32,36 36,36 39,33 C41,27 40,21 38,17 Z" 
                fill="#0a0c13" stroke="#ff2a42" stroke-width="0.5" stroke-opacity="0.3" />

          <!-- Throat Hackles (Feathery neck ruff) -->
          <path d="M29,17 L31,21 L34,17 L37,21 L39,17" stroke="#1c202d" stroke-width="0.8" fill="none" />

          <!-- Corvid Head -->
          <path class="crow-head" d="M31,17 C30,12 32,8 34,8 C36,8 38,12 37,17 Z" fill="#08090e" />

          <!-- Articulated Sharp Beak (Opens during caw) -->
          <g class="crow-beak-group" style="transform-origin: 34px 9px;">
            <!-- Upper Beak Maxilla -->
            <path class="crow-beak-upper" d="M32.5,9 L34,2 L35.5,9 Z" fill="#181a24" stroke="#ffa200" stroke-width="0.65" />
            <!-- Lower Beak Mandible -->
            <path class="crow-beak-lower" d="M33,9 L34,3.5 L35,9 Z" fill="#0e1017" />
          </g>

          <!-- Molten Amber / Ruby Eyes with Glint -->
          <circle cx="32.5" cy="10" r="1.2" fill="#ff2a42" filter="url(#crowEyeGlow)" />
          <circle cx="35.5" cy="10" r="1.2" fill="#ff2a42" filter="url(#crowEyeGlow)" />
          <circle cx="32.5" cy="10" r="0.45" fill="#ffd166" />
          <circle cx="35.5" cy="10" r="0.45" fill="#ffd166" />
        </g>
      </svg>
    `;

    document.body.appendChild(this.crow);

    // Reference wing and beak elements
    this.leftWing = this.crow.querySelector('.crow-wing-left');
    this.rightWing = this.crow.querySelector('.crow-wing-right');
    this.beakGroup = this.crow.querySelector('.crow-beak-group');

    // Action indicator pill
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
      if (this.velocity.speed > 3.5 && Math.random() < 0.2) {
        this.addFeather(
          this.crowPos.x + (Math.random() - 0.5) * 16,
          this.crowPos.y + (Math.random() - 0.5) * 16,
          -this.velocity.x * 0.15 + (Math.random() - 0.5) * 1.5,
          -this.velocity.y * 0.15 + (Math.random() * 0.8 + 0.5)
        );
      }

      // Shed molten embers from the crow's wake
      if (Math.random() < 0.3) {
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
      // 1. Play authentic realistic crow caw sound
      if (window.AudioSynth && window.AudioSynth.playCrowCaw) {
        window.AudioSynth.playCrowCaw();
      }

      // 2. Beak caw animation
      this.triggerCawAnimation();

      // 3. Rapid dive / wing attack stance
      this.crow.style.transform = `translate(${this.crowPos.x}px, ${this.crowPos.y}px) scale(0.82) rotate(${this.headingAngle}deg)`;

      // 4. Burst of fiery embers on strike
      const emberColors = ['#ff2a42', '#ff6b35', '#ffa200', '#ffd166'];
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
        const speed = 2.2 + Math.random() * 4.5;
        const color = emberColors[Math.floor(Math.random() * emberColors.length)];
        this.addSpark(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.8, 3.4, color);
      }

      // 5. Shed burst of raven feathers
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

  /**
   * Realistic beak opening animation during crow caw
   */
  triggerCawAnimation() {
    if (this.beakGroup) {
      this.beakGroup.style.transition = 'transform 0.08s ease';
      this.beakGroup.style.transform = 'scaleY(1.5) scaleX(1.15) translateY(-2px)';
      setTimeout(() => {
        if (this.beakGroup) {
          this.beakGroup.style.transform = 'scaleY(1) scaleX(1) translateY(0)';
        }
      }, 280);
    }
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
    this.crow.style.transform = `translate(${this.crowPos.x}px, ${this.crowPos.y}px) translate(-50%, -12%) rotate(${this.headingAngle}deg) skewX(${this.bankAngle * 0.35}deg)`;

    // Position action pill near the crow
    if (this.actionPill) {
      this.actionPill.style.transform = `translate(${this.crowPos.x + 26}px, ${this.crowPos.y + 14}px)`;
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
