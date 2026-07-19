---
id: threejs
title: Three.js
sidebar_label: Three.js
sidebar_position: 1
tags: [webgl, 3d, javascript, graphics]
---

Three.js is a JavaScript library that wraps WebGL (and can target WebGPU) to make building 3D graphics for the browser dramatically easier. Instead of writing raw shaders and buffer management, you work with a **scene graph** made of familiar objects: cameras, lights, meshes, and materials.

## The Core Trio

Every Three.js app needs three things:

1. **Scene** — the container/tree that holds everything you want to render.
2. **Camera** — defines the viewpoint (most commonly `PerspectiveCamera`).
3. **Renderer** — draws the scene from the camera's point of view into a `<canvas>`.

```js
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,                                   // fov (degrees)
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,                                  // near clipping plane
  1000                                  // far clipping plane
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

:::tip
`renderer.setPixelRatio(window.devicePixelRatio)` sharpens things up on high-DPI (Retina) screens. It's easy to forget and the result looks blurry without it.
:::

## Cameras

- **PerspectiveCamera** — mimics human vision, objects farther away look smaller. Used for almost everything (games, product viewers, most scenes).
- **OrthographicCamera** — no perspective distortion, parallel lines stay parallel. Used for 2D-ish UI overlays, isometric games, CAD-style views, minimaps.

```js
const aspect = window.innerWidth / window.innerHeight;
const d = 5;
const orthoCam = new THREE.OrthographicCamera(
  -d * aspect, d * aspect, d, -d, 0.1, 1000
);
```

## Geometry + Material = Mesh

A `Mesh` is the combination of a **shape** (geometry) and a **surface appearance** (material).

```js
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x2194ce });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

### Common built-in geometries

`BoxGeometry`, `SphereGeometry`, `PlaneGeometry`, `CylinderGeometry`, `TorusGeometry`, `ConeGeometry`, `BufferGeometry` (for fully custom vertex data).

### Common materials

| Material | Reacts to light? | Typical use |
|---|---|---|
| `MeshBasicMaterial` | No | Flat color, UI elements, wireframes, unlit stylized look |
| `MeshStandardMaterial` | Yes (PBR) | Realistic, physically-based rendering — default go-to |
| `MeshPhysicalMaterial` | Yes (PBR+) | Adds clearcoat, transmission (glass), sheen |
| `MeshPhongMaterial` | Yes (non-PBR) | Cheaper shiny look, older approach |
| `MeshToonMaterial` | Yes | Cel-shaded/cartoon look |

:::note
If your `MeshStandardMaterial` object looks pitch black, it's almost always because **there's no light in the scene**. `MeshBasicMaterial` ignores lights entirely, which is a handy way to debug "is this a lighting problem or a positioning problem?"
:::

## Lights

- `AmbientLight` — flat light from everywhere, no shadows, no direction. Good baseline fill light.
- `DirectionalLight` — parallel rays, like the sun. Casts shadows.
- `PointLight` — radiates from a single point, like a bulb. Falls off with distance.
- `SpotLight` — cone-shaped, like a flashlight/stage light.
- `HemisphereLight` — blends a sky color and ground color, nice for outdoor scenes.

```js
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);
```

To actually see shadows you need **three** things enabled: renderer, light, and each mesh.

```js
renderer.shadowMap.enabled = true;
dirLight.castShadow = true;
mesh.castShadow = true;
ground.receiveShadow = true;
```

## The Animation Loop

Three.js has no built-in game loop — you drive it yourself, typically with `requestAnimationFrame`.

```js
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
```

For frame-rate-independent motion, use `THREE.Clock` and multiply by `deltaTime` instead of adding a fixed constant every frame:

```js
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // seconds since last frame
  cube.rotation.y += delta * 1.0; // 1 radian/sec, regardless of FPS
  renderer.render(scene, camera);
}
```

## Handling Resize

Forgetting this is one of the most common "why is my scene stretched/blurry" bugs.

```js
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // required after changing camera params
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## Controls (OrbitControls)

Not part of core three.js — it's an "example" module you import separately. Lets the user drag to orbit, scroll to zoom.

```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth, inertia-like movement

// inside the animate loop:
controls.update(); // required every frame when damping is enabled
```

## Loading Models

Most real projects load `.glb`/`.gltf` files rather than building geometry by hand.

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load(
  '/models/character.glb',
  (gltf) => {
    scene.add(gltf.scene);
  },
  (progress) => console.log(`${(progress.loaded / progress.total) * 100}% loaded`),
  (error) => console.error(error)
);
```

`.glb` (binary, single file) is generally preferable to `.gltf` (json + separate assets) for web delivery — fewer requests, smaller.

## Raycasting (Mouse Picking)

How you detect clicks/hovers on 3D objects — cast an invisible ray from the camera through the mouse position and see what it hits.

```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    console.log('Clicked:', intersects[0].object);
  }
});
```

## Coordinate System & Units

- Three.js is **right-handed**: +X right, +Y up, +Z **toward the camera** (out of the screen).
- No built-in real-world unit — "1" is just whatever scale you decide (commonly treated as 1 meter for physics/game-like scenes).
- Rotations are in **radians**, not degrees (`Math.PI / 2` for 90°).

## Performance Notes / Gotchas

- **Dispose your resources.** Removing a mesh from the scene doesn't free GPU memory — call `geometry.dispose()` and `material.dispose()` (and `texture.dispose()`) when you're done with them, or you'll leak memory on dynamic scenes.
- **Reuse geometries/materials** across many meshes instead of creating new ones per object.
- **InstancedMesh** for rendering thousands of copies of the same geometry (e.g. grass, particles, trees) in a single draw call instead of one mesh per object.
- **Texture sizes should be powers of two** (256, 512, 1024, 2048...) where possible for best compatibility/performance.
- Avoid creating new objects (`new THREE.Vector3()`, etc.) inside the animation loop — allocate once outside and mutate in place to avoid garbage-collection stutter.
- `renderer.setPixelRatio()` — capping at 2 (`Math.min(window.devicePixelRatio, 2)`) avoids murdering performance on very high-DPI mobile screens.

## Useful Helpers While Developing

```js
scene.add(new THREE.AxesHelper(5));           // red/green/blue = x/y/z
scene.add(new THREE.GridHelper(10, 10));      // ground reference grid
scene.add(new THREE.DirectionalLightHelper(dirLight)); // visualize light direction
```

## React Integration

For React projects, **React Three Fiber (`@react-three/fiber`)** is the standard wrapper — it lets you write the scene graph declaratively as JSX instead of imperative `.add()` calls, while still being "real" three.js underneath. **`@react-three/drei`** adds a big library of ready-made helpers (`OrbitControls`, loaders, text, environment maps, etc.) on top of it.

```jsx
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  );
}
```

## Quick Reference: Mental Model

- **Scene** = the world
- **Camera** = your eye
- **Renderer** = the thing that paints what the eye sees onto the canvas
- **Mesh** = geometry (shape) + material (surface)
- **Light** = required for any material that reacts to light (everything except Basic/normal materials)
- **Animation loop** = you drive every frame yourself via `requestAnimationFrame`

## Further Reading

- [Official docs](https://threejs.org/docs/)
- [Three.js Journey](https://threejs-journey.com/) — widely regarded as the best paid course
- [Discover three.js](https://discoverthreejs.com/) — free, well-written book
- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber)
