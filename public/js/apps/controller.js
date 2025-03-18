import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function controls(camera, renderer, options){
    const control = new OrbitControls(camera, renderer.domElement);
    // control.enableDamping = true; // Smooth motion
    // control.dampingFactor = 0.05;
    control.minDistance = options.minDistance; // Minimum zoom distance
    control.maxDistance = options.maxDistance; // Maximum zoom distance
    // control.minZoom = options.minZoom; // Maximum zoom distance
    // control.maxZoom = options.maxZoom; // Maximum zoom distance
    // control.minAzimuthAngle = options.minAzimuthAngle; // Maximum zoom distance
    // control.maxTargetRadius = 500; // Maximum zoom distance
    control.maxPolarAngle = 1.7; // Maximum zoom distance
    control.enablePan = false; //


    return{
        control
    }
}