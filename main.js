import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


// The scene is where all the objects and lights and cameras will be stored
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio);
//set the size to the whole screen
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// call the renderer to draw the scene
renderer.render(scene,camera);

// set up game loops so we dont have to keep calling renderer
function animate(){
  requestAnimationFrame(animate);
  // rotate torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // rotate d20
  d20.rotation.z += .01;
  // set up moving light
  const timer = Date.now() * 0.00025;
  particleLight.position.x = Math.sin( timer * 7 ) * 50;
	particleLight.position.y = Math.cos( timer * 5 ) * 150;
	particleLight.position.z = Math.cos( timer * 3 ) * 50;
  controls.update();
  renderer.render(scene, camera);
}

// Create an object
const geometry = new THREE.TorusGeometry( 8, 2.5, 15, 100)
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh( geometry, material);

scene.add(torus)

// add lighting
// point lights are like lightbulbs
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)
// ambient light is more like a flood light
const ambientLight = new THREE.AmbientLight(0xffffff);
let particleLight = new THREE.Mesh(new THREE.SphereGeometry(1, 4, 4), new THREE.MeshBasicMaterial({ color: 0xffffff}));
scene.add(particleLight);
const pointLight2 = new THREE.PointLight( 0xffffff, 2, 800 );
particleLight.add( pointLight2 );
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(4, 3,47);
scene.add(pointLight, ambientLight,light)

//scene.add(light);

 //Used for testing
// light helper shows us the position of a light
const lightHelper = new THREE.PointLightHelper(pointLight)
const lightHelper2 = new THREE.PointLightHelper(light)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper, lightHelper2)

// will listen for a dom events on the mouse and update the camera position
const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  // create a star shape
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  // Randomly place them on the screen
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star)
}

// add 200 stars
Array(200).fill().forEach(addStar)

// load in texture background
const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
// note: can add a callback function that will tell you when your texture is done loading
scene.background = spaceTexture;

// daniel cube
const danielTexture = new THREE.TextureLoader().load('daniel.png');
const daniel = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: danielTexture})
);
// adding myself to a scene feels weird
scene.add(daniel);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpeg');
// added normal map to make the moon look more realistic
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture, 
    normalMap: normalTexture
  })
);
scene.add(moon);
moon.position.setZ(30);
moon.position.setX(-10);

// adding d20
//const d20Texture = new THREE.TextureLoader().load('d20TextMap.png');
const d20Geometry = new THREE.IcosahedronGeometry(2,0);
const d20Material = new THREE.MeshStandardMaterial({color: 0x41838});
d20Material.roughness = .3;
d20Material.metalness = .8;
const d20 = new THREE.Mesh(d20Geometry, d20Material);
scene.add(d20);
d20.position.setZ(43);
d20.position.setX(10);
d20.rotation.x = 90;

function moveCamera(){
  // calculate where the user has scrolled to
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.005;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.005;

  daniel.rotation.y += 0.01;
  daniel.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera

animate()