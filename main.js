import * as THREE from "three";
import * as TWEEN from "tween";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
// renderer.setClearColor(0x87ceeb); // Light blue background
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Change background Color:
// renderer.setClearColor(0xf2f0ef);

//Lighting in the scene
// Ambient light: Provides uniform lighting to the scene
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // White light, 50% intensity
// scene.add(ambientLight);

// // Directional light: Acts like a sun, casting light in a specific direction
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, full intensity
// directionalLight.position.set(0, 2, 0); // Set the position of the light
// scene.add(directionalLight);

// Add SpotLight in the middle of the scene
// Spotlight Setup
//Create a SpotLight and turn on shadows for the light
const spotLight = new THREE.SpotLight(0xffffff, 20); // Intensity set to 5 for stronger light
spotLight.position.set(0, 35, 0); // Above the room center
spotLight.angle = Math.PI / 4; // Wider cone (60 degrees)
spotLight.penumbra = 0.5; // Softer edges
spotLight.decay = 1; // Slower falloff
spotLight.distance = 150; // Larger range

// Enable shadows
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048; // High-resolution shadow maps
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 150;

// Add to scene
scene.add(spotLight);

// Target the spotlight
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight.target);

// Optional: Add a helper to visualize the spotlight
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Geomatry
let room = [];
const ROOM_SIZE = [50, 2, 50];

function showcaseBuilder() {
  // Ground
  const groundGeometry = new THREE.BoxGeometry(
    ROOM_SIZE[0],
    ROOM_SIZE[1],
    ROOM_SIZE[2]
  );
  const DarkMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0f9ff,
    roughness: 0.5, // Adjust surface roughness
    metalness: 0.1, // Non-metallic surface
  });
  const ground = new THREE.Mesh(groundGeometry, DarkMaterial);
  ground.position.set(0, -ROOM_SIZE[1] / 2, 0); // Position ground at the bottom
  ground.castShadow = true; //default is false
  ground.receiveShadow = false; //default is false
  scene.add(ground);
  room.push(ground);

  // Walls
  const wallThickness = 1; // Thickness of the walls
  const wallHeight = 20; // Height of the walls

  // Front Wall
  const frontWallGeometry = new THREE.BoxGeometry(
    ROOM_SIZE[0],
    wallHeight,
    wallThickness
  );
  const frontWall = new THREE.Mesh(frontWallGeometry, DarkMaterial.clone());
  frontWall.position.set(0, wallHeight / 2, -ROOM_SIZE[2] / 2);
  scene.add(frontWall);
  room.push(frontWall);

  // Back Wall
  const backWall = new THREE.Mesh(frontWallGeometry, DarkMaterial.clone());
  backWall.position.set(0, wallHeight / 2, ROOM_SIZE[2] / 2);
  scene.add(backWall);
  room.push(backWall);

  // Left Wall
  const leftWallGeometry = new THREE.BoxGeometry(
    wallThickness,
    wallHeight,
    ROOM_SIZE[2]
  );
  const leftWall = new THREE.Mesh(leftWallGeometry, DarkMaterial.clone());
  leftWall.position.set(-ROOM_SIZE[0] / 2, wallHeight / 2, 0);
  scene.add(leftWall);
  room.push(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(leftWallGeometry, DarkMaterial.clone());
  rightWall.position.set(ROOM_SIZE[0] / 2, wallHeight / 2, 0);
  scene.add(rightWall);
  room.push(rightWall);

  ground.receiveShadow = true;
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;
}

showcaseBuilder();

//OrbitControl
const controls = new OrbitControls(camera, renderer.domElement);

const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(shadowCameraHelper);

camera.position.z = 10;
camera.position.y = 10;
controls.update();

function animate() {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
