import * as THREE from "three";

export type HunterRig = {
  root: THREE.Group;
  head: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  hand: THREE.Object3D;
  worldGuns: THREE.Group[];
  faceMat: THREE.MeshBasicMaterial;
};

export function buildHunter(face: THREE.Texture, dress: THREE.Texture, ember: number): HunterRig {
  const root = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({
    color: 0xf0e4d8,
    roughness: 0.55,
    metalness: 0.04,
    emissive: 0x3a1818,
    emissiveIntensity: 0.12,
  });
  const hair = new THREE.MeshStandardMaterial({
    color: 0xe8eaf0,
    roughness: 0.38,
    metalness: 0.08,
    emissive: 0x8890a0,
    emissiveIntensity: 0.18,
  });
  dress.colorSpace = THREE.SRGBColorSpace;
  dress.anisotropy = 8;
  const cloth = new THREE.MeshStandardMaterial({
    map: dress,
    color: 0xffffff,
    roughness: 0.42,
    metalness: 0.18,
    emissive: ember,
    emissiveIntensity: 0.28,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xb08a4a,
    metalness: 0.85,
    roughness: 0.28,
    emissive: 0x3a2208,
    emissiveIntensity: 0.35,
  });
  const glow = new THREE.MeshStandardMaterial({
    color: ember,
    emissive: ember,
    emissiveIntensity: 2.4,
    roughness: 0.3,
  });

  const add = (mesh: THREE.Mesh, parent: THREE.Object3D) => {
    mesh.castShadow = false;
    parent.add(mesh);
    return mesh;
  };

  const hips = new THREE.Group();
  hips.position.y = 0.92;
  root.add(hips);

  add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.38, 10), cloth), hips).position.y = 0.12;
  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.95, 12, 1, true), cloth);
  skirt.rotation.x = Math.PI;
  skirt.position.y = -0.42;
  hips.add(skirt);
  add(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 8, 16), gold), hips).position.y = 0.28;
  add(new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 6, 12), gold), hips).position.set(0, 0.34, -0.12);

  const chest = new THREE.Group();
  chest.position.y = 1.28;
  root.add(chest);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), skin), chest).scale.set(1.05, 0.85, 0.7);

  const head = new THREE.Group();
  head.position.y = 1.52;
  root.add(head);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12), skin), head);
  face.colorSpace = THREE.SRGBColorSpace;
  face.wrapS = face.wrapT = THREE.ClampToEdgeWrapping;
  face.anisotropy = 8;
  face.minFilter = THREE.LinearMipmapLinearFilter;
  face.magFilter = THREE.LinearFilter;
  const faceMat = new THREE.MeshBasicMaterial({ map: face, toneMapped: false });
  const faceMesh = new THREE.Mesh(new THREE.CircleGeometry(0.105, 20), faceMat);
  faceMesh.position.set(0, 0.01, -0.11);
  faceMesh.rotation.y = Math.PI;
  head.add(faceMesh);
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 6), skin);
  earL.rotation.z = 0.7;
  earL.position.set(-0.13, 0.02, 0);
  const earR = earL.clone();
  earR.rotation.z = -0.7;
  earR.position.x = 0.13;
  head.add(earL, earR);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), glow), head).position.set(-0.04, 0.02, -0.12);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), glow), head).position.set(0.04, 0.02, -0.12);

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
  hairCap.position.y = 0.04;
  head.add(hairCap);
  for (let i = 0; i < 7; i++) {
    const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.035, 0.85 - i * 0.04, 6), hair);
    const a = (i / 7) * Math.PI - Math.PI * 0.5;
    lock.position.set(Math.sin(a) * 0.08, -0.28, 0.1 + Math.abs(Math.cos(a)) * 0.04);
    lock.rotation.x = 0.25;
    lock.rotation.z = a * 0.15;
    head.add(lock);
  }

  const makeArm = (side: number) => {
    const g = new THREE.Group();
    g.position.set(side * 0.2, 1.32, 0);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.32, 8), skin);
    upper.position.y = -0.16;
    g.add(upper);
    const lower = new THREE.Group();
    lower.position.y = -0.32;
    const lowM = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.3, 8), skin);
    lowM.position.y = -0.14;
    lower.add(lowM);
    g.add(lower);
    root.add(g);
    return { g, lower };
  };
  const left = makeArm(-1);
  const right = makeArm(1);
  const hand = new THREE.Object3D();
  hand.position.set(0, -0.3, -0.08);
  right.lower.add(hand);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.04, 0.62), glow);
  blade.position.set(0, 0, -0.28);
  hand.add(blade);
  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.12, 6), gold);
  hilt.rotation.x = Math.PI / 2;
  hilt.position.set(0, 0, 0.02);
  hand.add(hilt);

  const makeLeg = (side: number) => {
    const g = new THREE.Group();
    g.position.set(side * 0.1, 0.72, 0);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.38, 8), cloth);
    thigh.position.y = -0.18;
    g.add(thigh);
    const shin = new THREE.Group();
    shin.position.y = -0.38;
    const shinM = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.4, 8), cloth);
    shinM.position.y = -0.18;
    shin.add(shinM);
    g.add(shin);
    root.add(g);
    return { g, shin };
  };
  const leftLeg = makeLeg(-1);
  const rightLeg = makeLeg(1);

  return {
    root,
    head,
    leftArm: left.g,
    rightArm: right.g,
    leftLeg: leftLeg.g,
    rightLeg: rightLeg.g,
    hand,
    worldGuns: [],
    faceMat,
  };
}

export function poseHunter(
  rig: HunterRig,
  bob: number,
  grounded: boolean,
  speed: number,
  pitch: number,
  view: number,
) {
  const moving = Math.min(1, speed / 6.5);
  const swing = Math.sin(bob) * moving * 0.55;
  rig.leftArm.rotation.x = swing;
  rig.rightArm.rotation.x = -swing * 0.55 - 0.4;
  rig.leftLeg.rotation.x = grounded ? -swing : -0.45;
  rig.rightLeg.rotation.x = grounded ? swing : 0.28;
  rig.head.rotation.x = THREE.MathUtils.clamp(pitch * 0.22, -0.45, 0.45);
  if (rig.worldGuns) {
    for (let i = 0; i < rig.worldGuns.length; i++) rig.worldGuns[i].visible = i === view;
  }
}
