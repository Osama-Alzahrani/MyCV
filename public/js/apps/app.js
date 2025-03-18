import * as THREE from 'three';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';

export function init(options) {
    options = options || null;
    const container = $("#webgl");
    const scene = new THREE.Scene;

    const renderer = new THREE.WebGLRenderer({antialias: options.antialias});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000);
    // renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.zIndex = 1;
    container.append(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;

    // const hdrLoader = new UltraHDRLoader();
    // hdrLoader.load('../../hdr/studio_small_09_4k.jpg', function (hdr) {
    //     hdr.mapping = THREE.EquirectangularRefractionMapping;
    //     // scene.background = hdr;
    //     scene.environment = hdr;
    // });

    return{
        scene,
        renderer
    }
}