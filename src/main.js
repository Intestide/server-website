import './style.css'
import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 0 ); 

renderer.setAnimationLoop( animate );

document.body.appendChild( renderer.domElement );


// grass block
const loader = new THREE.TextureLoader();
loader.setPath( 'cubes/grass/' );
const textureCube = loader.load( [
	'grass_block_side.png', 'grass_block_side.png',
	'dirt.png'            ,             'dirt.png',
	'grass_block_side.png', 'grass_block_side.png'
] );
                  
var material = [                                                      
    new THREE.MeshLambertMaterial( { map: loader.load( 'grass_block_side.png' ) } ),                      
    new THREE.MeshLambertMaterial( { map: loader.load( 'grass_block_side.png' ) } ),                      
    new THREE.MeshLambertMaterial( { map: loader.load( 'grass_block_top.png' ) } ),                      
    new THREE.MeshLambertMaterial( { map: loader.load( 'dirt.png' ) } ),
    new THREE.MeshLambertMaterial( { map: loader.load( 'grass_block_side.png' ) } ),
    new THREE.MeshLambertMaterial( { map: loader.load( 'grass_block_side.png' ) } )        
];   
material.forEach( ( m ) => {m.map.magFilter = THREE.NearestFilter;});
material.side = THREE.DoubleSide;
material.onBeforeCompile = function(shader) {
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `
        vec3 backfaceColor = vec3(0.4, 0.4, 0.4); // Or any desired color
        gl_FragColor = (gl_FrontFacing) ? vec4(outgoingLight, diffuseColor.a) : vec4(backfaceColor, opacity);
        `
    );
};
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.scale.set( 0.8, 0.8, 0.8 );
cube.rotation.set( Math.PI/8 , Math.PI/4, 0 ); 

//lights
const light1 = new THREE.AmbientLight();
light1.intensity = 0.1;
scene.add(light1);
const light2 = new THREE.DirectionalLight();
light2.position.set( 2, 2, 2 );
light2.intensity = 1;
scene.add(light2);
const light3 = new THREE.DirectionalLight();
light3.position.set( -1, -1, -0.5 );
light3.intensity = 1;
scene.add(light3);

//intialize raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const planeIntersection = new THREE.Vector3();
let intersected = [];
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener( 'pointermove', onPointerMove );

//click event
window.addEventListener('click', () => {
  if (intersected.length > 0) {
    enterWorld();
  }
})

// camera initialization
camera.position.z = 5;
camera.position.x = 0;
camera.position.y = 0;

camera.lookAt( 0, 0, 0 );

//resize
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//animation loop
function animate() {
  renderer.render( scene, camera );
  raycaster.setFromCamera(pointer, camera);
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.ray.intersectPlane(plane, planeIntersection); 

  let currentLookAt = new THREE.Vector3();
  if (entering) return;
  gsap.to(currentLookAt, {
      x: planeIntersection.x ,
      y: planeIntersection.y ,
      z: 5 ,
      duration: 1, // Adjust duration for desired easing speed
      ease: "power2.out", // Choose your preferred easing function
      onUpdate: () => {
        cube.lookAt(currentLookAt);
        cube.rotation.x += Math.PI / 8;
        cube.rotation.y +=  Math.PI / 4;
        // cube.rotation.z += 0.01; 
    }
  });

  intersected = raycaster.intersectObjects( scene.children, false );
  
}

let entering = false;
const enterWorld = () => {
  entering = true;
  gsap.to(camera.position, {
    duration: 1.5,
    x: 0,
    y: 0,
    z: 0,
    ease: 'power2.inOut',
  })
  gsap.to(cube.rotation, {
    duration: 2,
    x: cube.rotation.x + Math.PI ,
    y: cube.rotation.y + Math.PI ,
    z: cube.rotation.z + Math.PI ,
    ease: 'power2.inOut',
    onComplete: () => {
      window.location.href = 'serverinfo/index.html'; 
    }
  })
  
  gsap.to('#enterBackground', {
    duration: 1.5,
    opacity: 1,
    ease: "expo.in",
  });
}
