import * as THREE from "three";
import { init } from "./public/js/apps/app.js";
import { Camera } from "./public/js/apps/camera.js";
import { createMonitor } from "./public/js/apps/Monitor.js";
import { controls } from "./public/js/apps/controller.js";
import { createScene } from "./public/js/apps/scene.js";

import { Tween, Group, Easing } from "@tweenjs/tween.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const app = init({ antialias: true });
const camera = Camera(new THREE.Vector3(0, 300, 200));
const controller = controls(camera.camera, app.renderer, {
  maxDistance: 1300,
  minDistance: 0.1,
});
const monitor = createMonitor(app.scene, {
  scale: new THREE.Vector3(0.1, 0.1, 1),
});
const scene = createScene(app.scene, monitor);
controller.control.target.set(0, 300, 10);
console.log(controller.control);

const params = {
  threshold: 0,
  strength: 0.2,
  radius: 0.5,
  exposure: 0.1,
  // light
  deskLight: true,
  // camera
  cameraRadius: 700,
  cameraAngle: 0,
  cameraSpeed: 0.005,
  // computer
  computerActive: false,
};

const renderScene = new RenderPass(app.scene, camera.camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.1,
  0.1,
  0.1
);
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(app.renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);
bloomComposer.renderToScreen = false;

const mixPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture },
    },
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
  }),
  "baseTexture"
);

const finalComposer = new EffectComposer(app.renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(mixPass);

const outputPass = new OutputPass();
finalComposer.addPass(outputPass);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.camera.aspect = window.innerWidth / window.innerHeight;
  camera.camera.updateProjectionMatrix();

  app.renderer.setSize(window.innerWidth, window.innerHeight);
  monitor.CSSRenderer.setSize(window.innerWidth, window.innerHeight);

  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  finalComposer.setSize(window.innerWidth, window.innerHeight);
}

let cameraMoving = false;
let cameraRotating = false;
let UIClicked = false;
controller.control.enabled = false;

const group = new Group();

function smoothCameraTransition(targetPosition, duration = 2000) {
  if (cameraMoving || params.computerActive) {
    return;
  }

  cameraRotating = false;

  let initialPosition = camera.camera.position.clone();

  controller.control.enabled = false;
  controller.control.minDistance = 0.1;

  if (camera.camera.position.z < 0) {
    // alert("Camera" + targetPosition.z);

    new Tween(initialPosition, group)
      .to(
        {
          x: targetPosition.x,
          y: targetPosition.y + 200,
          z: targetPosition.z + 50,
        },
        duration / 2
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        camera.camera.position.set(
          initialPosition.x,
          initialPosition.y,
          initialPosition.z
        );
        camera.camera.lookAt(
          targetPosition.x,
          targetPosition.y,
          targetPosition.z
        );
        controller.control.target.set(
          targetPosition.x,
          targetPosition.y,
          targetPosition.z
        );
      })
      .onComplete(() => {
        console.log(controller.control);
        // controller.control.enabled = true;
        cameraMoving = false;
        // cameraRotating = true;
        initialPosition = camera.camera.position.clone();
        new Tween(initialPosition, group)
          .to(
            {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z + 50,
            },
            duration / 2
          )
          .easing(Easing.Quadratic.Out)
          .onUpdate(() => {
            camera.camera.position.set(
              initialPosition.x,
              initialPosition.y,
              initialPosition.z
            );
            camera.camera.lookAt(
              targetPosition.x,
              targetPosition.y,
              targetPosition.z
            );
            controller.control.target.set(
              targetPosition.x,
              targetPosition.y,
              targetPosition.z
            );
          })
          .onComplete(() => {
            console.log(controller.control);
            // controller.control.enabled = true;
            cameraMoving = false;
            // cameraRotating = true;
          })
          .start();
      })
      .start();
  } else {
    new Tween(initialPosition, group)
      .to(
        { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z + 50 },
        duration
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        camera.camera.position.set(
          initialPosition.x,
          initialPosition.y,
          initialPosition.z
        );
        camera.camera.lookAt(
          targetPosition.x,
          targetPosition.y,
          targetPosition.z
        );
        controller.control.target.set(
          targetPosition.x,
          targetPosition.y,
          targetPosition.z
        );
      })
      .onComplete(() => {
        console.log(controller.control);
        // controller.control.enabled = true;
        cameraMoving = false;
        // cameraRotating = true;
      })
      .start();
  }
  cameraMoving = true;

  params.computerActive = true;
  $("#UI").hide();
  $("#webgl").css("pointer-events", "none");
}

let cameraRotationPosition;

function cameraToRotation() {
  params.computerActive = false;
  params.cameraAngle = 0;
  controller.control.minDistance = 0.1;
  $("#webgl").css("pointer-events", "auto");

  if (cameraMoving) {
    return;
  }

  cameraRotating = false;

  const initialPosition = camera.camera.position.clone();

  const duration = initialPosition.distanceTo(new THREE.Vector3(0, 400, 700));

  controller.control.enabled = false;

  new Tween(initialPosition, group)
    .to({ x: 0, y: 400, z: 700 }, duration)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      camera.camera.position.set(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z
      );
      camera.camera.lookAt(40, 270, -10);
      controller.control.target.set(40, 270, -10);
    })
    .onComplete(() => {
      cameraMoving = false;
      cameraRotating = true;
    })
    .start();
  cameraMoving = true;
}

$("#CameraMode").click(function () {
  // alert("CLICK")

  cameraRotating = cameraRotating ? false : true;
  if (cameraRotating) {
    cameraToRotation();
    // controller.control.enabled = false;
  } else {
    cameraRotationPosition = camera.camera.position.clone();
    controller.control.enabled = true;
    controller.control.minDistance = 400;
  }
});
$("#DeskLight").click(function () {
  // $(this).children().first().removeAttr("type");

  deskLampONOFF();
});
$("#UI").click(function () {
  UIClicked = true;
});

const darkMaterial = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  opacity: 0.01,
});
let deskLampMaterial;

function deskLampONOFF() {
  if (params.deskLight) {
    scene.deskLight.intensity = 0;
    scene.pointLight.intensity = 0;

    deskLampMaterial = scene.pointLight.children[0].material;
    scene.pointLight.children[0].material = darkMaterial;
    params.deskLight = false;
  } else {
    scene.deskLight.intensity = 15000;
    scene.pointLight.intensity = 100;

    scene.pointLight.children[0].material = deskLampMaterial;
    params.deskLight = true;
  }
}

window.addEventListener("click", (event) => {
  // Convert mouse position to normalized device coordinates (-1 to +1 range)
  if (UIClicked) {
    UIClicked = false;
    return;
  }
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera.camera);

  // Calculate intersections
  const intersects = raycaster.intersectObjects(app.scene.children);

  if (intersects.length > 0) {
    console.log("Clicked on:", intersects[0].object);
    let worldPosition = new THREE.Vector3();
    intersects[0].object.getWorldPosition(worldPosition);
    // console.log(worldPosition);
    const objName = intersects[0].object.name;
    if (objName === "Monitor1" || objName === "Screen") {
      cameraRotationPosition = camera.camera.position.clone();
      smoothCameraTransition({ x: 40, y: 270, z: -10 }, 2000);
    }

    if (
      objName !== "Monitor1" &&
      objName !== "Screen" &&
      params.computerActive
    ) {
      $("#UI").show();
      cameraToRotation();
    }

    if (intersects[0].object.parent.name === "Desklamp") {
      deskLampONOFF();
    }
  } else {
    console.log("Clicked on empty space");
    if (params.computerActive) {
      cameraToRotation();
      $("#UI").show();
    }
  }
});

// console.log(Math.sin(params.cameraAngle) * params.cameraRadius);
// console.log(Math.cos(params.cameraAngle) * params.cameraRadius);

$(document).ready(function () {
  console.log("ready!");
});

export function startAnimation() {
  animate();
  setTimeout(() => {
    $("#loading-screen").addClass("fadeout-up-screen");
    cameraRotating = true;
  }, 500);
  // $("#loading-screen").addClass("fadeout-up-screen")
  // alert("Animation started");
}

function animate() {
  requestAnimationFrame(animate);

  if (!scene.isItFinished) {
    group.update(); // Update the group instead of TWEEN.update()

    controller.control.update();
    // app.renderer.render( app.scene, camera.camera );
    monitor.CSSRenderer.render(app.scene, camera.camera);
    // app.scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    // app.scene.traverse( restoreMaterial );
    finalComposer.render();
    if (cameraRotating) {
      // console.log(params.cameraAngle );

      params.cameraAngle += params.cameraSpeed;

      // Camera position (circular path)

      camera.camera.position.x =
        Math.sin(params.cameraAngle) * params.cameraRadius;
      camera.camera.position.z =
        Math.cos(params.cameraAngle) * params.cameraRadius;
      camera.camera.position.y = 400;
      // console.log(camera.camera.position);
    }
  }
}
