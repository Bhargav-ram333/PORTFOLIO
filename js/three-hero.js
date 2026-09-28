/**
 * Three.js 3D Interactive AI Neural Constellation
 * Hero Section 3D Visualizer for Chiravuri Satya Siva Bhargav
 */

class NeuralSphereHero {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particlePositions = null;
    this.originalPositions = null;
    this.linesMesh = null;
    this.rings = [];
    
    this.particleCount = 550;
    this.radius = 280;
    this.maxConnections = 45;
    this.minDistance = 65;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0 };
    this.rotation = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.pulse = { active: false, radius: 0, maxRadius: 350, speed: 8 };

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
    this.camera.position.z = 850;

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create Neural Nodes & Connections
    this.createNeuralNetwork();

    // 5. Create Holographic Orbit Rings
    this.createOrbitRings();

    // 6. Bind Event Listeners
    this.bindEvents();

    // 7. Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createNeuralNetwork() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    this.originalPositions = new Float32Array(this.particleCount * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const purpleColor = new THREE.Color(0x9d4edd);
    const emeraldColor = new THREE.Color(0x00f5a0);

    for (let i = 0; i < this.particleCount; i++) {
      // Fibonacci sphere distribution for uniform organic neural shell
      const phi = Math.acos(-1 + (2 * i) / this.particleCount);
      const theta = Math.sqrt(this.particleCount * Math.PI) * phi;

      // Slight radial variation for depth
      const r = this.radius * (0.85 + Math.random() * 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.originalPositions[i * 3] = x;
      this.originalPositions[i * 3 + 1] = y;
      this.originalPositions[i * 3 + 2] = z;

      // Color interpolation: Cyan -> Purple -> Emerald
      const mixedColor = cyanColor.clone();
      const rand = Math.random();
      if (rand < 0.6) {
        mixedColor.lerp(purpleColor, Math.random() * 0.7);
      } else {
        mixedColor.lerp(emeraldColor, Math.random() * 0.8);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with round glowing dots
    const canvasTexture = this.generateParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 7,
      map: canvasTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particles);
    this.particlePositions = positions;

    // Line segments connecting nearby nodes
    const maxLineSegments = this.particleCount * this.maxConnections;
    const linePositions = new Float32Array(maxLineSegments * 3);
    const lineColors = new Float32Array(maxLineSegments * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.linesMesh);
  }

  generateParticleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(0, 242, 254, 0.8)');
    gradient.addColorStop(0.7, 'rgba(157, 78, 221, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  createOrbitRings() {
    const ringRadii = [340, 420];
    const ringColors = [0x00f2fe, 0x9d4edd];

    ringRadii.forEach((r, idx) => {
      const ringGeom = new THREE.RingGeometry(r, r + 1.5, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3 + (idx * 0.4);
      ringMesh.rotation.y = idx * 0.5;
      this.scene.add(ringMesh);
      this.rings.push({ mesh: ringMesh, rotSpeed: 0.002 * (idx % 2 === 0 ? 1 : -1) });
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      const width = this.canvas.parentElement.clientWidth;
      const height = this.canvas.parentElement.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const mouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      this.mouse.targetX = mouseX * 0.4;
      this.mouse.targetY = mouseY * 0.4;

      if (this.mouse.isDown) {
        const deltaX = e.clientX - this.mouse.prevX;
        const deltaY = e.clientY - this.mouse.prevY;
        this.rotation.targetY += deltaX * 0.005;
        this.rotation.targetX += deltaY * 0.005;
        this.mouse.prevX = e.clientX;
        this.mouse.prevY = e.clientY;
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;
      this.triggerShockwave();
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    // Touch support for mobile devices
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.mouse.isDown = true;
        this.mouse.prevX = e.touches[0].clientX;
        this.mouse.prevY = e.touches[0].clientY;
        this.triggerShockwave();
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && this.mouse.isDown) {
        const deltaX = e.touches[0].clientX - this.mouse.prevX;
        const deltaY = e.touches[0].clientY - this.mouse.prevY;
        this.rotation.targetY += deltaX * 0.005;
        this.rotation.targetX += deltaY * 0.005;
        this.mouse.prevX = e.touches[0].clientX;
        this.mouse.prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.isDown = false;
    });
  }

  triggerShockwave() {
    this.pulse.active = true;
    this.pulse.radius = 0;
  }

  animate() {
    requestAnimationFrame(this.animate);

    const time = Date.now() * 0.001;

    // Smooth inertia mouse tracking
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Continuous auto-rotation plus manual drag inertia
    this.rotation.targetY += 0.002;
    this.rotation.x += (this.rotation.targetX - this.rotation.x) * 0.08;
    this.rotation.y += (this.rotation.targetY - this.rotation.y) * 0.08;

    this.particles.rotation.x = this.rotation.x + this.mouse.y * 0.3;
    this.particles.rotation.y = this.rotation.y + this.mouse.x * 0.3;
    this.linesMesh.rotation.x = this.particles.rotation.x;
    this.linesMesh.rotation.y = this.particles.rotation.y;

    // Rotate holographic rings
    this.rings.forEach((ring) => {
      ring.mesh.rotation.z += ring.rotSpeed;
    });

    // Shockwave pulse progression
    if (this.pulse.active) {
      this.pulse.radius += this.pulse.speed;
      if (this.pulse.radius > this.pulse.maxRadius) {
        this.pulse.active = false;
        this.pulse.radius = 0;
      }
    }

    // Dynamic wave oscillation on particle positions
    const pos = this.particlePositions;
    const orig = this.originalPositions;
    const shockR = this.pulse.radius;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const ox = orig[i3];
      const oy = orig[i3 + 1];
      const oz = orig[i3 + 2];

      const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
      // Sinusoidal organic breathing wave
      const wave = Math.sin(dist * 0.03 - time * 2) * 6;

      let shockOffset = 0;
      if (this.pulse.active) {
        const diff = Math.abs(dist - shockR);
        if (diff < 40) {
          shockOffset = Math.sin((1 - diff / 40) * Math.PI) * 25;
        }
      }

      const scale = (dist + wave + shockOffset) / dist;
      pos[i3] = ox * scale;
      pos[i3 + 1] = oy * scale;
      pos[i3 + 2] = oz * scale;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // Connect close neighbors with dynamic lines
    let vertexPos = 0;
    let colorPos = 0;
    let connectionsCount = 0;
    const linePositions = this.linesMesh.geometry.attributes.position.array;
    const lineColors = this.linesMesh.geometry.attributes.color.array;

    for (let i = 0; i < this.particleCount; i += 2) {
      if (connectionsCount >= this.particleCount * this.maxConnections) break;

      const p1x = pos[i * 3];
      const p1y = pos[i * 3 + 1];
      const p1z = pos[i * 3 + 2];

      for (let j = i + 1; j < this.particleCount; j += 3) {
        const p2x = pos[j * 3];
        const p2y = pos[j * 3 + 1];
        const p2z = pos[j * 3 + 2];

        const dx = p1x - p2x;
        const dy = p1y - p2y;
        const dz = p1z - p2z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < this.minDistance) {
          const alpha = 1.0 - dist / this.minDistance;

          linePositions[vertexPos++] = p1x;
          linePositions[vertexPos++] = p1y;
          linePositions[vertexPos++] = p1z;
          linePositions[vertexPos++] = p2x;
          linePositions[vertexPos++] = p2y;
          linePositions[vertexPos++] = p2z;

          // Cyan to purple gradient lines
          lineColors[colorPos++] = 0.0;
          lineColors[colorPos++] = 0.95 * alpha;
          lineColors[colorPos++] = 1.0 * alpha;

          lineColors[colorPos++] = 0.62 * alpha;
          lineColors[colorPos++] = 0.31 * alpha;
          lineColors[colorPos++] = 0.87 * alpha;

          connectionsCount++;
        }
      }
    }

    this.linesMesh.geometry.setDrawRange(0, vertexPos / 3);
    this.linesMesh.geometry.attributes.position.needsUpdate = true;
    this.linesMesh.geometry.attributes.color.needsUpdate = true;

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    new NeuralSphereHero('three-hero-canvas');
  }
});
