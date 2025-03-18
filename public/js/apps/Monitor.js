import * as THREE from 'three';
import { CSS3DRenderer,CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createMonitor(scene,options) {

    const container = $("#css");

    const CSSRenderer = new CSS3DRenderer({antialias: true});
    CSSRenderer.setSize(window.innerWidth, window.innerHeight);
    container.append(CSSRenderer.domElement);

    /**
     * Create one 3D object for webGL so it can handle CSS3D and the GL plane
     * to occlude the CSS plane
     */

    const object3D = new THREE.Object3D();

    const $element = $('<iframe>')
    .css({
        width: '1920px',
        height: '1080px',
        opacity: 1,
        border: 'none',
    })
    .attr('src', '../../../innerWebsite/pc.html');



    const css3dObject = new CSS3DObject($element[0]);
    css3dObject.position.set(0, 0, 0);
    css3dObject.scale.copy(options.scale)
    object3D.css3dObject = css3dObject;
    object3D.add(css3dObject);

    // Create the Gl Panel for CSS3d to render it ==> before --> MeshPhongMaterial
    const material = new THREE.MeshBasicMaterial({
        opacity	: 0.0,
        blending: THREE.NoBlending,
        color	: "#000000",
        transparent: true,
        // side: THREE.DoubleSide
      });
    var geometry = new THREE.BoxGeometry( 1920, 1080, 1 );
    var GLPanel = new THREE.Mesh( geometry, material );
    GLPanel.name = "backdrop";
    GLPanel.scale.copy(options.scale)
    object3D.add(GLPanel);
    scene.add(object3D);

    


    // const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    return{
        CSSRenderer,
        object3D
    }
}