import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const mount = document.getElementById('device3d');
if (mount) initViewer(mount);

function initViewer(mount) {
  const width = () => mount.clientWidth || 640;
  const height = () => mount.clientHeight || 460;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width(), height());
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(34, width() / height(), 0.1, 100);
  camera.position.set(4.6, 2.7, 6.4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  controls.minDistance = 4.2;
  controls.maxDistance = 13;
  controls.maxPolarAngle = Math.PI * 0.86;
  controls.target.set(0, 0.05, 0);

  // Lighting (env does most of it; these add definition)
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(5, 7, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x88c8ff, 1.2);
  rim.position.set(-6, 3, -5);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xdfeefc, 0x141e26, 0.5));

  // ---- Materials ----
  const steel = new THREE.MeshStandardMaterial({ color: 0xcfd9e0, metalness: 0.92, roughness: 0.26 });
  const steelDark = new THREE.MeshStandardMaterial({ color: 0x8493a0, metalness: 0.9, roughness: 0.38 });
  const bore = new THREE.MeshStandardMaterial({ color: 0x0a2230, metalness: 0.5, roughness: 0.6 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xbdf3ff, metalness: 0, roughness: 0.06,
    transmission: 0.92, thickness: 0.4, ior: 1.45,
    transparent: true, opacity: 0.34, clearcoat: 1, clearcoatRoughness: 0.08,
  });
  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x0bd1ec, emissive: 0x0bbfe0, emissiveIntensity: 1.0,
    transparent: true, opacity: 0.30, roughness: 0.4,
  });
  const electrodeMat = new THREE.MeshStandardMaterial({
    color: 0xff9e35, emissive: 0xff7a18, emissiveIntensity: 1.1, metalness: 0.4, roughness: 0.35,
  });
  const enclosureMat = new THREE.MeshStandardMaterial({ color: 0x2b3a45, metalness: 0.6, roughness: 0.5 });
  const fishMat = new THREE.MeshStandardMaterial({
    color: 0x9af0ff, emissive: 0x46d8f5, emissiveIntensity: 1.4, roughness: 0.5,
  });

  // Body clipping plane (for cutaway) — cuts the top off
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2.0); // constant 2 = no cut
  [steel, steelDark, glass, interiorMat].forEach(m => { m.clippingPlanes = [clip]; m.clipShadows = true; });

  const root = new THREE.Group();
  scene.add(root);

  const L = 3.0; // body length along X
  const R = 0.72;

  // Parts that explode along given offset directions
  const parts = [];
  const addPart = (obj, dir) => { obj.userData.base = obj.position.clone(); obj.userData.dir = dir; parts.push(obj); root.add(obj); };

  // Main body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 64, 1, true), steel);
  body.rotation.z = Math.PI / 2;
  addPart(body, new THREE.Vector3(0, 0, 0));

  // Interior glow volume
  const interior = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.82, R * 0.82, L * 0.98, 48), interiorMat);
  interior.rotation.z = Math.PI / 2;
  addPart(interior, new THREE.Vector3(0, 0, 0));

  // Glass inspection window (raised box on top)
  const win = new THREE.Group();
  const winShell = new THREE.Mesh(new THREE.BoxGeometry(L * 0.62, 0.42, 1.04), glass);
  winShell.position.y = R * 0.66;
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(L * 0.66, 0.12, 1.12), steelDark);
  winFrame.position.y = R * 0.46;
  win.add(winShell, winFrame);
  addPart(win, new THREE.Vector3(0, 1, 0));

  // Electrode cassette: 4 plates across the flow
  const cassette = new THREE.Group();
  const nE = 4;
  for (let i = 0; i < nE; i++) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.12, 0.96), electrodeMat);
    plate.position.x = -0.72 + i * (1.44 / (nE - 1));
    plate.position.y = 0.02;
    cassette.add(plate);
  }
  addPart(cassette, new THREE.Vector3(0, 1.6, 0));

  // Flanges + pipe stubs at both ends
  function endAssembly(sign) {
    const g = new THREE.Group();
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.34, R * 1.34, 0.16, 48), steel);
    flange.rotation.z = Math.PI / 2;
    flange.position.x = sign * (L / 2);
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.74, R * 0.74, 0.9, 40), steel);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.x = sign * (L / 2 + 0.5);
    const mouth = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.6, R * 0.6, 0.92, 36), bore);
    mouth.rotation.z = Math.PI / 2;
    mouth.position.x = sign * (L / 2 + 0.5);
    // bolt circle
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12), steelDark);
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(sign * (L / 2), Math.cos(a) * R * 1.08, Math.sin(a) * R * 1.08);
      g.add(bolt);
    }
    g.add(flange, pipe, mouth);
    return g;
  }
  const endL = endAssembly(-1); addPart(endL, new THREE.Vector3(-1, 0, 0));
  const endR = endAssembly(1); addPart(endR, new THREE.Vector3(1, 0, 0));

  // Control enclosure on top-back with a glowing HMI + nameplate
  const ctrl = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.5), enclosureMat);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.42),
    new THREE.MeshStandardMaterial({ map: makeHMITexture(), emissive: 0xffffff, emissiveMap: makeHMITexture(), emissiveIntensity: 0.9 }));
  screen.position.set(0, 0.02, 0.251);
  ctrl.add(box, screen);
  ctrl.position.set(0.2, R + 0.55, -0.62);
  addPart(ctrl, new THREE.Vector3(0, 1.2, -0.4));

  // Nameplate on the body side
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.3),
    new THREE.MeshStandardMaterial({ map: makeNameTexture(), transparent: true, metalness: 0.3, roughness: 0.5 }));
  plate.position.set(0.0, 0.12, R + 0.02);
  plate.material.clippingPlanes = [clip];
  addPart(plate, new THREE.Vector3(0, 0, 1));

  // Inner point lights for the glow
  const glow1 = new THREE.PointLight(0x32d6f0, 6, 4, 2); glow1.position.set(0, 0, 0); root.add(glow1);
  const glow2 = new THREE.PointLight(0xff8a3a, 3, 3, 2); glow2.position.set(0, 0.1, 0); root.add(glow2);

  // Flow particles ("fish")
  const fishCount = 46;
  const fishGeo = new THREE.SphereGeometry(0.07, 10, 8);
  const fish = new THREE.InstancedMesh(fishGeo, fishMat, fishCount);
  const dummy = new THREE.Object3D();
  const seeds = [];
  for (let i = 0; i < fishCount; i++) {
    seeds.push({
      x: -L / 2 - 0.6 + Math.random() * (L + 1.2),
      y: (Math.random() - 0.5) * R * 1.0,
      z: (Math.random() - 0.5) * R * 1.0,
      sp: 0.012 + Math.random() * 0.02,
      sc: 0.7 + Math.random() * 0.8,
    });
  }
  fishMat.clippingPlanes = [clip];
  root.add(fish);
  let flowOn = true;

  function makeNameTexture() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 140;
    const x = c.getContext('2d');
    x.clearRect(0, 0, 512, 140);
    x.fillStyle = '#eafcff'; x.font = '700 92px system-ui, sans-serif'; x.textBaseline = 'middle';
    x.fillText('FlowStun', 18, 76);
    x.fillStyle = '#36d6f0'; x.fillRect(20, 116, 250, 7);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeHMITexture() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const x = c.getContext('2d');
    x.fillStyle = '#04141c'; x.fillRect(0, 0, 256, 128);
    x.fillStyle = '#1ce0b0'; x.font = '700 22px monospace';
    x.fillText('● IN ENVELOPE', 14, 32);
    x.fillStyle = '#7fe9ff'; x.font = '16px monospace';
    x.fillText('I 4.1A  V 320  Z 78Ω', 14, 64);
    x.fillStyle = '#9fb6c4'; x.fillText('dwell 1.4s  cond 38mS', 14, 92);
    x.strokeStyle = '#0d5366'; x.strokeRect(8, 8, 240, 112);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  // ---- Modes ----
  let explodeTarget = 0, explode = 0;
  let clipTarget = 2.0, clipNow = 2.0; // 2 = whole, ~0 = cut to centre

  const buttons = mount.parentElement.querySelectorAll('[data-mode]');
  buttons.forEach(b => b.addEventListener('click', () => {
    buttons.forEach(x => x.classList.toggle('active', x === b));
    const m = b.dataset.mode;
    if (m === 'orbit') { explodeTarget = 0; clipTarget = 2.0; controls.autoRotate = true; }
    if (m === 'explode') { explodeTarget = 1; clipTarget = 2.0; controls.autoRotate = false; }
    if (m === 'cutaway') { explodeTarget = 0; clipTarget = 0.02; controls.autoRotate = true; }
  }));
  const flowBtn = mount.parentElement.querySelector('[data-flow]');
  if (flowBtn) flowBtn.addEventListener('click', () => {
    flowOn = !flowOn; flowBtn.classList.toggle('active', flowOn);
    fish.visible = flowOn;
  });

  // ---- Loop ----
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    explode += (explodeTarget - explode) * 0.08;
    parts.forEach(p => {
      p.position.copy(p.userData.base).addScaledVector(p.userData.dir, explode * 0.85);
    });
    clipNow += (clipTarget - clipNow) * 0.1;
    clip.constant = clipNow;

    glow1.intensity = 5 + Math.sin(t * 2.2) * 1.6;
    electrodeMat.emissiveIntensity = 1.0 + Math.sin(t * 3.0) * 0.35;
    interiorMat.emissiveIntensity = 0.8 + Math.sin(t * 2.2) * 0.25;

    if (flowOn) {
      for (let i = 0; i < fishCount; i++) {
        const s = seeds[i];
        s.x += s.sp;
        if (s.x > L / 2 + 0.6) { s.x = -L / 2 - 0.6; s.y = (Math.random() - 0.5) * R; s.z = (Math.random() - 0.5) * R; }
        dummy.position.set(s.x, s.y + Math.sin(t * 2 + i) * 0.02, s.z);
        dummy.scale.set(s.sc * 1.6, s.sc * 0.8, s.sc * 0.8);
        dummy.rotation.y = 0.3;
        dummy.updateMatrix();
        fish.setMatrixAt(i, dummy.matrix);
      }
      fish.instanceMatrix.needsUpdate = true;
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  const ro = new ResizeObserver(() => {
    renderer.setSize(width(), height());
    camera.aspect = width() / height();
    camera.updateProjectionMatrix();
  });
  ro.observe(mount);
}
