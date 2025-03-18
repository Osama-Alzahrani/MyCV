import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import { startAnimation } from '../../../main.js';
export function createScene(scene,monitor){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.075); // Soft white light
    scene.add(ambientLight);

    


    // scene.fog = new THREE.FogExp2( 0xefd1b5, 1 );
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(0, 1000, 0); // Set light position
    // directionalLight.castShadow = true; // Set light position
    // scene.add(directionalLight);

    // const helper = new THREE.DirectionalLightHelper( directionalLight, 50 );
    // scene.add( helper );

      // const geometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xDCDCDC , side: THREE.DoubleSide} );
    // const mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

    


    const spotLight = new THREE.SpotLight(0xffffff, 4000, 300, Math.PI/2.8,0.2);
    // spotLight.position.set(0, 500, 0);
    spotLight.castShadow = true;
    // spotLight.shadow.bias = -0.00033;
    scene.add(spotLight);

    // Target the spotlight
    spotLight.target.position.set(50, 200, 0);
    scene.add(spotLight.target);

    // Optional: Add a helper to visualize the spotlight


    const light = new THREE.RectAreaLight(0xFFFFFF, 0.5,100,100);
    
    
    
    // light.castShadow = true;
    // light.shadow.bias = -0.0001;
    scene.add(light);
    


    const helper = new RectAreaLightHelper(light);

    light.add(helper);

    const sphere = new THREE.SphereGeometry( 10, 16, 8 );

				//lights

    const pointLight = new THREE.PointLight( 0xFFA757, 1000 );
    pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFA757 } ) ) );
    scene.add( pointLight );

    const deskLight = new THREE.SpotLight(0xFFA757, 15000, 300, Math.PI/3.5,0.07);
    // spotLight.position.set(0, 500, 0);
    deskLight.castShadow = true;
    // spotLight.shadow.bias = -0.00033;
    scene.add(deskLight);

    // Target the spotlight
    deskLight.target.position.set(50, 200, -10);
    scene.add(deskLight.target);


    
    

    const loader = new GLTFLoader();

    let isItFinished = false;
    
    loader.load( '../../model/desktop/last.gltf', function ( gltf ) {
        isItFinished = true;
        light.children[0].material.fog = true;
        console.log(light.children[0]);
        


        scene.add( gltf.scene );
        gltf.scene.scale.set(50, 50, 50);

        gltf.scene.traverse( function( object ) {

            object.frustumCulled = false;
            
            // console.log(object );
            
            // object.receiveShadow = true;
            object.castShadow = true; //default is false
            object.receiveShadow = true; //default is false
            // object.material.envMap = null;         // Remove environment map
            // object.material.toneMapped = false;    // Exclude from tone mapping
            
            if(object.material){
                // console.log(object.material);
                // object.material.fog = false;
            }
            
            // Optional: Use a simple material without HDR influence
            // object.material.roughness = 1.0;       // Ensure no reflection
            // object.material.metalness = 0.0;
        
        } );




        let worldPosition = new THREE.Vector3();
        const monitor3D = gltf.scene.getObjectByName('Screen');
        // const plane3D = gltf.scene.getObjectByName('Plane');
        const cup3D = gltf.scene.getObjectByName('Cup');
        const light3D = gltf.scene.getObjectByName('lightGlass');
        // if(plane3D){

        //     plane3D.traverse((child) => {
        //         if (child.isMesh && child.material) {
        //             // Disable HDR effects
        //             child.material.envMap = null;         // Remove environment map
        //             child.material.toneMapped = false;    // Exclude from tone mapping
                    
        //             // Optional: Use a simple material without HDR influence
        //             child.material.roughness = 1.0;       // Ensure no reflection
        //             child.material.metalness = 0.0;
                    
        //             // Ensure changes are applied
        //             child.material.needsUpdate = true;
        //         }
        //     });
        // }

        if(cup3D){
            if (cup3D.material) {
                cup3D.material.roughness = 0.0;
            } else if (cup3D.children.length > 0) {
                // Iterate over children and modify their materials
                cup3D.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.roughness = 0.0;
                    }
                });
            }
        }
        if(light3D){
            if (light3D.material) {
                const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black', transparent: true, opacity:0.01,depthWrite:false, depthTest: false,envMapIntensity:0.0,blending: THREE.CustomBlending} );
                light3D.material = darkMaterial;
                light3D.getWorldPosition(worldPosition);
                deskLight.position.x = worldPosition.x;
                deskLight.position.y = worldPosition.y+5.5;
                deskLight.position.z = worldPosition.z;

                pointLight.position.x = worldPosition.x;
                pointLight.position.y = worldPosition.y+5.5;
                pointLight.position.z = worldPosition.z;

                // const spotLightHelper = new THREE.SpotLightHelper(deskLight);
                // scene.add(spotLightHelper);
            }
        }
        if (monitor3D) {
            if (monitor3D.material) {
                // monitor3D.material.transparent = true; // Enable transparency
                // // monitor3D.material.blending = THREE.NoBlending  ; // Use additive blending
                // monitor3D.material.opacity = 0.2; // Set transparency level
                // // monitor3D.material.blendEquation = THREE.MinEquation; //default 
                // monitor3D.material.roughness = 0.0;
                // monitor3D.material.metalness = 1.0;
                // monitor3D.material.depthWrite = false;
                // monitor3D.material.envMapIntensity = 0.0;
                const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black', transparent: true, opacity:0.01,depthWrite:false, depthTest: false,envMapIntensity:0.0,blending: THREE.CustomBlending} );
                monitor3D.material = darkMaterial;
                
            }
            monitor3D.getWorldPosition(worldPosition);
            monitor.object3D.position.x = worldPosition.x+1.3;
            monitor.object3D.position.y = worldPosition.y+4.5;
            monitor.object3D.position.z = worldPosition.z+2;
            console.log(monitor.object3D.position);

            // light.position.copy(worldPosition);
            light.position.x = worldPosition.x+1.4;
            light.position.y = worldPosition.y+5.5;
            light.position.z = worldPosition.z;
            light.rotateX(Math.PI);

            spotLight.position.x = worldPosition.x+8.8;
            spotLight.position.y = worldPosition.y+5.5;
            spotLight.position.z = worldPosition.z+5;
            // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
            // scene.add(spotLightHelper);

            // spotLight.target.position.set(worldPosition);
            
        }

        startAnimation();

    }, undefined, function ( error ) {

        console.error( error );

    } );



    // const geometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xDCDCDC , side: THREE.DoubleSide} );
    // const mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

    // const geometry = new THREE.BoxGeometry( 5000, 100, 5000 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // const mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

    // const geometry1 = new THREE.BoxGeometry( -5000, 5000, 100 );
    // const material1 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // const mesh1 = new THREE.Mesh( geometry1, material1 );
    // mesh1.position.set( 0, 0, 5000)
    // scene.add( mesh1 );

    // const geometry2 = new THREE.BoxGeometry( 0, 5000, 5000 );
    // const material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // const mesh2 = new THREE.Mesh( geometry2, material2 );
    // mesh2.position.set( 5000, 0, 0)
    // scene.add( mesh2 );


    
    
    

    
    // console.log(desktop.getObjectByName('Monitor1'));
    return {
        deskLight,
        pointLight,
        isItFinished,
    }
    
}