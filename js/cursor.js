/**
 * Full 3D Interactive Soaring Raven / Crow Cursor & Sound Engine
 * Built with Three.js WebGL
 * Portfolio of Chiravuri Satya Siva Bhargav
 *
 * Features:
 *  - Real-time 3D sculpted Corvid (Crow/Raven) with specular obsidian plumage
 *  - Articulated 3D dual-jointed wings with aerodynamic avian kinematics (flapping, soaring, banking)
 *  - 3D animated opening beak during vocal cawing
 *  - Glowing molten ruby/amber 3D corvid eyes with point lights
 *  - Authentic Indian Crow (Corvus splendens) cawing sound on interaction
 *  - 3D drifting feather particle simulation with tumbling aerodynamics
 *  - Molten fire ember wake particles
 */

class ThreeCrowCursor {
  constructor() {
    // Only initialize on desktop/fine-pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not found, falling back');
      return;
    }

    this.initCanvas();
    this.initThree();
    this.create3DCrow();
    this.initParticles();
    this.initActionPill();
    this.initEvents();
    this.animate();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'crow-3d-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);
  }

  initThree() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();

    // Perspective Camera: at Z=100
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    // Renderer with transparency & antialiasing
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Dynamic Cinematic Lighting for 3D crow plumage
    const ambientLight = new THREE.AmbientLight(0x222634, 1.2);
    this.scene.add(ambientLight);

    // Warm key light (golden amber from top-front)
    this.keyLight = new THREE.DirectionalLight(0xffa200, 2.2);
    this.keyLight.position.set(20, 40, 50);
    this.scene.add(this.keyLight);

    // Molten crimson rim light (creates beautiful feather edge silhouette)
    this.rimLight = new THREE.DirectionalLight(0xff2a42, 3.0);
    this.rimLight.position.set(-30, -20, 30);
    this.scene.add(this.rimLight);

    // Calculate screen-to-world conversion factor at Z=0
    this.updateWorldBounds();

    // Mouse & Motion State
    this.mouse = { x: this.width / 2, y: this.height / 2 };
    this.lastMouse = { x: this.width / 2, y: this.height / 2 };
    this.worldMouse = new THREE.Vector3(0, 0, 0);
    this.crowPos = new THREE.Vector3(0, 0, 0);
    this.velocity = { x: 0, y: 0, speed: 0 };

    this.headingAngle = 0; // Yaw
    this.targetHeading = 0;
    this.bankAngle = 0;    // Roll
    this.pitchAngle = 0;   // Pitch
    this.flapPhase = 0;
    this.isCawing = false;
  }

  updateWorldBounds() {
    const vFov = (this.camera.fov * Math.PI) / 180;
    this.worldHeight = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    this.worldWidth = this.worldHeight * this.camera.aspect;
  }

  screenToWorld(screenX, screenY, targetVec) {
    const normX = (screenX / this.width) * 2 - 1;
    const normY = -(screenY / this.height) * 2 + 1;
    targetVec.x = normX * (this.worldWidth / 2);
    targetVec.y = normY * (this.worldHeight / 2);
    targetVec.z = 0;
    return targetVec;
  }

  create3DCrow() {
    this.crowGroup = new THREE.Group();
    this.scene.add(this.crowGroup);

    // Materials: Deep Obsidian Plumage with iridescent specular reflections
    const featherMat = new THREE.MeshStandardMaterial({
      color: 0x08090d,
      roughness: 0.35,
      metalness: 0.25,
      flatShading: false
    });

    const featherMatDark = new THREE.MeshStandardMaterial({
      color: 0x050608,
      roughness: 0.45,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    const beakMat = new THREE.MeshStandardMaterial({
      color: 0x161822,
      roughness: 0.25,
      metalness: 0.45
    });

    const beakTipMat = new THREE.MeshStandardMaterial({
      color: 0xffa200,
      roughness: 0.3,
      metalness: 0.4
    });

    // 1. Torso / Body (Aerodynamic spindle)
    const bodyGeo = new THREE.ConeGeometry(2.2, 8.5, 16);
    // Rotate so cone tip points towards tail (backward along +Y)
    bodyGeo.rotateX(Math.PI);
    this.bodyMesh = new THREE.Mesh(bodyGeo, featherMat);
    this.bodyMesh.scale.set(1.0, 1.25, 0.65);
    this.crowGroup.add(this.bodyMesh);

    // Breast / Chest curve (rounded front)
    const chestGeo = new THREE.SphereGeometry(2.1, 16, 12);
    const chestMesh = new THREE.Mesh(chestGeo, featherMat);
    chestMesh.position.set(0, 2.2, 0.2);
    chestMesh.scale.set(0.95, 1.2, 0.7);
    this.crowGroup.add(chestMesh);

    // 2. Corvid Head & Throat Hackles
    const headGeo = new THREE.SphereGeometry(1.6, 16, 16);
    this.headMesh = new THREE.Mesh(headGeo, featherMat);
    this.headMesh.position.set(0, 4.4, 0.25);
    this.headMesh.scale.set(0.85, 1.15, 0.85);
    this.crowGroup.add(this.headMesh);

    // 3. Articulated 3D Sharp Beak (Upper Maxilla + Animated Lower Mandible)
    this.beakGroup = new THREE.Group();
    this.beakGroup.position.set(0, 5.2, 0.25);
    this.crowGroup.add(this.beakGroup);

    // Upper Beak
    const upperBeakGeo = new THREE.ConeGeometry(0.7, 3.4, 8);
    // Beak points forward (+Y)
    upperBeakGeo.translate(0, 1.7, 0);
    this.upperBeak = new THREE.Mesh(upperBeakGeo, beakMat);
    this.upperBeak.scale.set(0.8, 1.0, 0.5);
    this.beakGroup.add(this.upperBeak);

    // Beak Golden Tip Accent
    const tipGeo = new THREE.ConeGeometry(0.4, 1.2, 8);
    tipGeo.translate(0, 2.9, 0);
    const tipMesh = new THREE.Mesh(tipGeo, beakTipMat);
    tipMesh.scale.set(0.8, 1.0, 0.5);
    this.beakGroup.add(tipMesh);

    // Lower Mandible (Hinged to open realistically during cawing)
    this.mandibleGroup = new THREE.Group();
    this.mandibleGroup.position.set(0, 0.3, -0.1);
    const lowerBeakGeo = new THREE.ConeGeometry(0.55, 3.0, 8);
    lowerBeakGeo.translate(0, 1.5, 0);
    this.lowerBeak = new THREE.Mesh(lowerBeakGeo, beakMat);
    this.lowerBeak.scale.set(0.75, 0.95, 0.4);
    this.mandibleGroup.add(this.lowerBeak);
    this.beakGroup.add(this.mandibleGroup);

    // 4. Molten Ruby/Amber 3D Corvid Eyes
    const eyeGeo = new THREE.SphereGeometry(0.35, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2a42 });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.9, 4.6, 0.7);
    this.crowGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.9, 4.6, 0.7);
    this.crowGroup.add(rightEye);

    // Eye Pupils (amber sparks)
    const pupilGeo = new THREE.SphereGeometry(0.16, 8, 8);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });

    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.95, 4.7, 0.9);
    this.crowGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.95, 4.7, 0.9);
    this.crowGroup.add(rightPupil);

    // Small eye point light
    this.eyeLight = new THREE.PointLight(0xff2a42, 0.8, 8);
    this.eyeLight.position.set(0, 4.6, 1.2);
    this.crowGroup.add(this.eyeLight);

    // 5. Dual-Jointed Hierarchical 3D Wings (Left & Right)
    this.leftWingRoot = new THREE.Group();
    this.leftWingRoot.position.set(-1.6, 2.0, 0.1);
    this.crowGroup.add(this.leftWingRoot);

    this.rightWingRoot = new THREE.Group();
    this.rightWingRoot.position.set(1.6, 2.0, 0.1);
    this.crowGroup.add(this.rightWingRoot);

    // Build Left Wing
    this.leftWingComponents = this.buildWingMesh(-1, featherMat, featherMatDark);
    this.leftWingRoot.add(this.leftWingComponents.root);

    // Build Right Wing
    this.rightWingComponents = this.buildWingMesh(1, featherMat, featherMatDark);
    this.rightWingRoot.add(this.rightWingComponents.root);

    // 6. 3D Wedge Tail (Diamond rectrices)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, -4.5, -0.1);
    tailGroup.rotation.x = 0.12;

    for (let i = -3; i <= 3; i++) {
      const len = 7.5 - Math.abs(i) * 1.0; // Central feathers longest = classic wedge shape
      const tailFeatherGeo = new THREE.PlaneGeometry(1.2, len);
      tailFeatherGeo.translate(0, -len / 2, 0);
      const tailFeather = new THREE.Mesh(tailFeatherGeo, featherMatDark);
      tailFeather.position.x = i * 0.45;
      tailFeather.rotation.z = -i * 0.04;
      tailGroup.add(tailFeather);
    }
    this.crowGroup.add(tailGroup);
    this.tailGroup = tailGroup;

    // Scale overall 3D crow cursor to an ideal visual size
    this.crowGroup.scale.set(0.95, 0.95, 0.95);
  }

  buildWingMesh(side, featherMat, featherMatDark) {
    // side: -1 for left, +1 for right
    const root = new THREE.Group();

    // Upper Wing (Arm + Secondary coverts)
    const armGeo = new THREE.BoxGeometry(6.5, 5.0, 0.3);
    armGeo.translate(side * 3.25, -0.5, 0);
    const armMesh = new THREE.Mesh(armGeo, featherMat);
    root.add(armMesh);

    // Elbow Joint
    const elbow = new THREE.Group();
    elbow.position.set(side * 6.2, 0.2, 0);
    root.add(elbow);

    // Forearm & Outer Wing
    const forearmGeo = new THREE.BoxGeometry(7.0, 4.6, 0.25);
    forearmGeo.translate(side * 3.5, -0.4, 0);
    const forearmMesh = new THREE.Mesh(forearmGeo, featherMat);
    elbow.add(forearmMesh);

    // Emarginated Primary Flight Pinions (6 individually angled primary feather blades)
    for (let p = 0; p < 6; p++) {
      const pLen = 7.5 + p * 0.4;
      const pGeo = new THREE.PlaneGeometry(1.1, pLen);
      pGeo.translate(side * 0.5, -pLen / 2 + 1.5, 0);
      const pMesh = new THREE.Mesh(pGeo, featherMatDark);
      pMesh.position.set(side * (5.5 + p * 0.7), -0.5, (p - 3) * 0.04);
      pMesh.rotation.z = side * (0.15 + p * 0.08);
      elbow.add(pMesh);
    }

    return { root, elbow };
  }

  initParticles() {
    // 3D Feather particles simulation
    this.feathers = [];
    this.featherGeo = new THREE.PlaneGeometry(0.9, 2.4);
    this.featherMat = new THREE.MeshBasicMaterial({
      color: 0x07080c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    // 3D Fire Ember Particles simulation
    this.embers = [];
    this.emberGeo = new THREE.SphereGeometry(0.35, 6, 6);
  }

  add3DFeather(pos, vel) {
    const mesh = new THREE.Mesh(this.featherGeo, this.featherMat.clone());
    mesh.position.copy(pos);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    this.scene.add(mesh);

    this.feathers.push({
      mesh,
      vel: vel.clone(),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.12
      ),
      life: 1.0,
      decay: 0.015 + Math.random() * 0.01
    });
  }

  add3DEmber(pos, vel, colorHex) {
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 1.0
    });
    const mesh = new THREE.Mesh(this.emberGeo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);

    this.embers.push({
      mesh,
      vel: vel.clone(),
      life: 1.0,
      decay: 0.035 + Math.random() * 0.02
    });
  }

  initActionPill() {
    this.actionPill = document.createElement('div');
    this.actionPill.className = 'crow-action-pill';
    this.actionPill.textContent = 'EXPLORE';
    document.body.appendChild(this.actionPill);
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.updateWorldBounds();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Shed drifting feathers during active flight
      if (this.velocity.speed > 4.0 && Math.random() < 0.22) {
        const spawnPos = this.crowPos.clone();
        spawnPos.x += (Math.random() - 0.5) * 4;
        spawnPos.y += (Math.random() - 0.5) * 4;
        const spawnVel = new THREE.Vector3(
          -this.velocity.x * 0.08 + (Math.random() - 0.5) * 0.4,
          -this.velocity.y * 0.08 - 0.3 - Math.random() * 0.4,
          (Math.random() - 0.5) * 0.5
        );
        this.add3DFeather(spawnPos, spawnVel);
      }

      // Shed molten embers
      if (Math.random() < 0.35) {
        const emberColor = Math.random() < 0.6 ? 0xff2a42 : 0xffa200;
        const spawnPos = this.crowPos.clone();
        spawnPos.y -= 3.0;
        const spawnVel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          -0.6 - Math.random() * 0.8,
          (Math.random() - 0.5) * 0.6
        );
        this.add3DEmber(spawnPos, spawnVel, emberColor);
      }
    });

    // Mousedown / Click trigger: Realistic Indian Crow Caw + 3D Dive & Beak Opening
    const triggerCawInteraction = () => {
      // 1. Play original authentic Indian Crow Caw sound
      if (window.AudioSynth && window.AudioSynth.playCrowCaw) {
        window.AudioSynth.playCrowCaw();
      }

      // 2. Beak caw animation (mandible opens wide)
      this.animateCaw();

      // 3. 3D dive strike: burst of embers & feathers
      const emberColors = [0xff2a42, 0xff6b35, 0xffa200, 0xffd166];
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const spd = 0.8 + Math.random() * 1.5;
        const vel = new THREE.Vector3(Math.cos(angle) * spd, Math.sin(angle) * spd, (Math.random() - 0.5) * 1.0);
        const col = emberColors[Math.floor(Math.random() * emberColors.length)];
        this.add3DEmber(this.crowPos, vel, col);
      }

      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 0.4 + Math.random() * 0.8;
        const vel = new THREE.Vector3(Math.cos(angle) * spd, Math.sin(angle) * spd - 0.5, (Math.random() - 0.5) * 0.8);
        this.add3DFeather(this.crowPos, vel);
      }
    };

    window.addEventListener('mousedown', triggerCawInteraction);

    // Also trigger on document click for button clicks
    document.addEventListener('click', () => {
      if (window.AudioSynth && window.AudioSynth.playCrowCaw) {
        window.AudioSynth.playCrowCaw();
      }
      this.animateCaw();
    });

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

  animateCaw() {
    this.isCawing = true;
    if (this.mandibleGroup) {
      // Lower mandible drops down in 3D
      this.mandibleGroup.rotation.x = -0.45;
      setTimeout(() => {
        if (this.mandibleGroup) {
          this.mandibleGroup.rotation.x = 0;
        }
        this.isCawing = false;
      }, 350);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Instantaneous pixel delta & speed
    const dx = this.mouse.x - this.lastMouse.x;
    const dy = this.mouse.y - this.lastMouse.y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.velocity.speed = Math.hypot(dx, dy);

    this.lastMouse.x = this.mouse.x;
    this.lastMouse.y = this.mouse.y;

    // Convert mouse position to 3D world coordinates
    this.screenToWorld(this.mouse.x, this.mouse.y, this.worldMouse);

    // Smooth spring-lerp chasing world target
    this.crowPos.x += (this.worldMouse.x - this.crowPos.x) * 0.26;
    this.crowPos.y += (this.worldMouse.y - this.crowPos.y) * 0.26;
    this.crowGroup.position.set(this.crowPos.x, this.crowPos.y, 0);

    // Position action pill beside crow in screen space
    if (this.actionPill) {
      this.actionPill.style.transform = `translate(${this.mouse.x + 28}px, ${this.mouse.y + 14}px)`;
    }

    // 3D Heading Calculation (Yaw)
    if (this.velocity.speed > 1.2) {
      // Model points towards +Y; calculate angle relative to +Y
      this.targetHeading = Math.atan2(-dx, dy);
    }

    // Shortest-arc smooth angle interpolation for Yaw
    let yawDiff = this.targetHeading - this.headingAngle;
    while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
    while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    this.headingAngle += yawDiff * 0.18;

    // Aerodynamic Banking (Roll) based on turn rate
    const targetBank = Math.max(-0.6, Math.min(0.6, (-dx * 0.035)));
    this.bankAngle += (targetBank - this.bankAngle) * 0.22;

    // Pitch: dives slightly when moving down, ascends when moving up
    const targetPitch = Math.max(-0.4, Math.min(0.4, (-dy * 0.02)));
    this.pitchAngle += (targetPitch - this.pitchAngle) * 0.2;

    // Apply 3D Rotations to Crow Group
    this.crowGroup.rotation.set(0, 0, 0);
    this.crowGroup.rotateZ(this.headingAngle);
    this.crowGroup.rotateY(this.bankAngle);
    this.crowGroup.rotateX(this.pitchAngle);

    // Wing Kinematics: 3D Flapping & Soaring
    if (this.velocity.speed > 1.8) {
      // Active flapping in flight
      this.flapPhase += 0.22 + Math.min(this.velocity.speed, 20) * 0.03;
      const flapAmp = 0.55; // Radians
      const flapZ = Math.sin(this.flapPhase) * flapAmp;
      const flapX = Math.cos(this.flapPhase) * 0.15; // Dihedral sweep

      this.leftWingRoot.rotation.z = -flapZ;
      this.leftWingRoot.rotation.x = flapX;
      this.leftWingComponents.elbow.rotation.z = -flapZ * 0.6;

      this.rightWingRoot.rotation.z = flapZ;
      this.rightWingRoot.rotation.x = flapX;
      this.rightWingComponents.elbow.rotation.z = flapZ * 0.6;
    } else {
      // Gentle thermal soaring glide
      this.flapPhase += 0.04;
      const glideZ = Math.sin(this.flapPhase) * 0.08;

      this.leftWingRoot.rotation.z = -glideZ;
      this.leftWingRoot.rotation.x = 0;
      this.leftWingComponents.elbow.rotation.z = -glideZ * 0.3;

      this.rightWingRoot.rotation.z = glideZ;
      this.rightWingRoot.rotation.x = 0;
      this.rightWingComponents.elbow.rotation.z = glideZ * 0.3;
    }

    // Subtle tail flex
    if (this.tailGroup) {
      this.tailGroup.rotation.z = -this.bankAngle * 0.4;
      this.tailGroup.rotation.x = 0.12 - this.pitchAngle * 0.5;
    }

    // Update 3D Feathers
    for (let i = this.feathers.length - 1; i >= 0; i--) {
      const f = this.feathers[i];
      f.mesh.position.add(f.vel);
      f.mesh.rotation.x += f.rotSpeed.x;
      f.mesh.rotation.y += f.rotSpeed.y;
      f.mesh.rotation.z += f.rotSpeed.z;
      f.life -= f.decay;

      if (f.life <= 0) {
        this.scene.remove(f.mesh);
        f.mesh.geometry.dispose();
        f.mesh.material.dispose();
        this.feathers.splice(i, 1);
      } else {
        f.mesh.material.opacity = f.life * 0.85;
      }
    }

    // Update 3D Embers
    for (let i = this.embers.length - 1; i >= 0; i--) {
      const em = this.embers[i];
      em.mesh.position.add(em.vel);
      em.life -= em.decay;

      if (em.life <= 0) {
        this.scene.remove(em.mesh);
        em.mesh.geometry.dispose();
        em.mesh.material.dispose();
        this.embers.splice(i, 1);
      } else {
        em.mesh.material.opacity = em.life;
        const sc = Math.max(0.01, em.life);
        em.mesh.scale.set(sc, sc, sc);
      }
    }

    // Render 3D Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize 3D Crow Cursor when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new ThreeCrowCursor();
});
