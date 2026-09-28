/**
 * Photorealistic Real Crow Cursor & Indian Crow Caw Sound Engine
 * Portfolio of Chiravuri Satya Siva Bhargav
 *
 * Features:
 *  - High-definition authentic Real Crow photographic asset (assets/real_crow.png)
 *  - Aerodynamic 3D avian flight kinematics: Yaw heading, 3D banking roll, pitch, and wingbeat flapping
 *  - Authentic Indian Crow (Corvus splendens) cawing sound on interaction
 *  - Drifting raven feathers and molten ember particle engine
 */

class RealCrowCursor {
  constructor() {
    // Only initialize on desktop / fine-pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.initDOM();
    this.initCanvas();
    this.initActionPill();
    this.initEvents();
    this.animate();
  }

  initDOM() {
    // Create the real crow cursor container
    this.crow = document.createElement('div');
    this.crow.className = 'real-crow-cursor';
    this.crow.setAttribute('aria-hidden', 'true');

    // Real Crow Image & Molten Eye Glint
    this.crow.innerHTML = `
      <img src="assets/real_crow.png" alt="" class="real-crow-img" draggable="false">
      <div class="real-crow-eye"></div>
    `;

    document.body.appendChild(this.crow);
    this.crowImg = this.crow.querySelector('.real-crow-img');

    // Coordinates and kinematics state
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.crowPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.velocity = { x: 0, y: 0, speed: 0 };

    this.headingAngle = 0; // Degrees
    this.targetHeading = 0;
    this.bankAngle = 0;
    this.pitchAngle = 0;
    this.flapPhase = 0;
    this.strikeProgress = 0;
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'crow-particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99997';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    this.feathers = [];
    this.sparks = [];
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initActionPill() {
    this.actionPill = document.createElement('div');
    this.actionPill.className = 'crow-action-pill';
    this.actionPill.textContent = 'EXPLORE';
    document.body.appendChild(this.actionPill);
  }

  initEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Shed feathers during rapid flight
      if (this.velocity.speed > 3.8 && Math.random() < 0.22) {
        this.addFeather(
          this.crowPos.x + (Math.random() - 0.5) * 16,
          this.crowPos.y + (Math.random() - 0.5) * 16,
          -this.velocity.x * 0.12 + (Math.random() - 0.5) * 1.5,
          -this.velocity.y * 0.12 + (Math.random() * 0.8 + 0.5)
        );
      }

      // Shed glowing molten embers
      if (Math.random() < 0.32) {
        const emberColor = Math.random() < 0.55 ? 'rgba(255, 42, 66, 0.9)' : 'rgba(255, 107, 53, 0.9)';
        this.addSpark(
          this.crowPos.x + (Math.random() - 0.5) * 12,
          this.crowPos.y + 14 + Math.random() * 6,
          (Math.random() - 0.5) * 1.8,
          -0.5 - Math.random() * 1.6,
          2.4,
          emberColor
        );
      }
    });

    // Pointerdown trigger: Authentic Indian Crow Caw + Dive Strike + Ember burst
    let lastCawTime = 0;
    const triggerCaw = (e) => {
      const now = Date.now();
      if (now - lastCawTime < 450) return;
      lastCawTime = now;

      // Trigger 3D dive strike
      this.strikeProgress = 1.0;

      // 1. Play original authentic Indian Crow caw
      if (window.AudioSynth && window.AudioSynth.playCrowCaw) {
        window.AudioSynth.playCrowCaw();
      }

      // 2. Embers burst on strike
      const emberColors = ['#ff2a42', '#ff6b35', '#ffa200', '#ffd166'];
      const clickX = e ? e.clientX : this.mouse.x;
      const clickY = e ? e.clientY : this.mouse.y;

      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const speed = 2.0 + Math.random() * 4.0;
        const color = emberColors[Math.floor(Math.random() * emberColors.length)];
        this.addSpark(clickX, clickY, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.8, 3.2, color);
      }

      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 2.0;
        this.addFeather(clickX, clickY, Math.cos(angle) * speed, Math.sin(angle) * speed + 0.8);
      }
    };

    window.addEventListener('pointerdown', triggerCaw);

    // Interactive element hover labels
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .project-card-tilt, .contact-action-card, .t-cmd-btn, .filter-chip, .tab-btn');
      if (!target) return;

      const cursorType = target.getAttribute('data-cursor');
      if (cursorType === 'view' || target.classList.contains('project-card-tilt')) {
        this.actionPill.textContent = 'EXPLORE';
        this.actionPill.style.opacity = '1';
      } else if (cursorType === 'copy' || target.classList.contains('contact-action-card')) {
        this.actionPill.textContent = 'COPY';
        this.actionPill.style.opacity = '1';
      } else if (target.tagName.toLowerCase() === 'a' && target.getAttribute('download')) {
        this.actionPill.textContent = 'DOWNLOAD';
        this.actionPill.style.opacity = '1';
      } else {
        this.actionPill.textContent = 'ENGAGE';
        this.actionPill.style.opacity = '1';
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .project-card-tilt, .contact-action-card, .t-cmd-btn, .filter-chip, .tab-btn');
      if (!target) return;
      this.actionPill.style.opacity = '0';
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

  animate() {
    requestAnimationFrame(() => this.animate());

    // Instantaneous mouse delta & velocity
    const dx = this.mouse.x - this.lastMouse.x;
    const dy = this.mouse.y - this.lastMouse.y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.velocity.speed = Math.hypot(dx, dy);

    this.lastMouse.x = this.mouse.x;
    this.lastMouse.y = this.mouse.y;

    // Smooth spring-lerp chasing cursor position
    this.crowPos.x += (this.mouse.x - this.crowPos.x) * 0.28;
    this.crowPos.y += (this.mouse.y - this.crowPos.y) * 0.28;

    // Heading Angle (Yaw) in direction of flight
    if (this.velocity.speed > 1.2) {
      // The real crow image points UP (+90deg offset)
      this.targetHeading = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
    }

    // Shortest-arc smooth angle interpolation
    let angleDiff = this.targetHeading - this.headingAngle;
    while (angleDiff < -180) angleDiff += 360;
    while (angleDiff > 180) angleDiff -= 360;
    this.headingAngle += angleDiff * 0.18;

    // Aerodynamic 3D Banking (Roll) based on lateral turn velocity
    const targetBank = Math.max(-28, Math.min(28, dx * 1.2));
    this.bankAngle += (targetBank - this.bankAngle) * 0.22;

    // Aerodynamic Pitch: nose dips down on descent, raises on ascent
    const targetPitch = Math.max(-20, Math.min(20, dy * 0.8));
    this.pitchAngle += (targetPitch - this.pitchAngle) * 0.2;

    // Wing Flapping Kinematics:
    // Flaps in 3D when moving fast, glides motionless when cruising
    let flapScaleX = 1.0;
    let flapScaleY = 1.0;

    if (this.velocity.speed > 1.8) {
      this.flapPhase += 0.22 + Math.min(this.velocity.speed, 20) * 0.03;
      const flapSine = Math.sin(this.flapPhase);
      // Realistic wing fold & extension
      flapScaleX = 1.0 + flapSine * 0.15;
      flapScaleY = 1.0 - Math.abs(flapSine) * 0.09;
    } else {
      // Gentle thermal soaring glide
      this.flapPhase += 0.04;
      flapScaleX = 1.0 + Math.sin(this.flapPhase) * 0.03;
      flapScaleY = 1.0;
    }

    // Smooth decay of dive strike
    if (this.strikeProgress > 0.01) {
      this.strikeProgress *= 0.84;
    } else {
      this.strikeProgress = 0;
    }
    const strikeScale = 1.0 - this.strikeProgress * 0.22;
    flapScaleX *= strikeScale;
    flapScaleY *= strikeScale;

    // Apply full 3D aerodynamic transformation:
    // Positioning beak tip (x=50%, y=30%) precisely under mouse pointer
    this.crow.style.transform = `
      translate(${this.crowPos.x}px, ${this.crowPos.y}px)
      translate(-50%, -30%)
      rotate(${this.headingAngle}deg)
      rotateX(${this.pitchAngle * 0.6}deg)
      skewX(${this.bankAngle * 0.35}deg)
      scale(${flapScaleX}, ${flapScaleY})
    `;

    // Position action pill beside crow
    if (this.actionPill) {
      this.actionPill.style.transform = `translate(${this.mouse.x + 28}px, ${this.mouse.y + 14}px)`;
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
      this.ctx.fillStyle = '#08090d';
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

// Initialize Real Crow Cursor when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new RealCrowCursor();
});
