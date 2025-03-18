import * as THREE from 'three';

export function Camera(position){
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(position.x, position.y, position.z);
    
    return{
        camera
    }

}