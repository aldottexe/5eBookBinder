import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function setup(canvas, window) {
   //RENDERER
   const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
   });
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.setSize(window.innerWidth, window.innerHeight);

   //CAMERA
   const fov = 75;
   const aspect = window.innerWidth / window.innerHeight; // the canvas default
   const near = 0.1;
   const far = 7;
   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
   camera.position.z = 3;
   camera.position.y = 3;
   camera.lookAt(0, 0, -0.5);
   // camera.rotation.x = -0.6;

   // new OrbitControls(camera, renderer.domElement);

   // SCENE
   const scene = new THREE.Scene();

   // LIGHT
   const light = new THREE.PointLight(0xffffff, 1);
   light.position.z = 1.5;
   light.position.x = 1;
   light.position.y = 2;
   scene.add(light);

   // AMBIENT LIGHT
   const gi = new THREE.AmbientLight(0xffffff, 0.1);
   scene.add(gi);

   window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
   });

   const redraw = () => renderer.render(scene, camera);

   return { redraw, scene };
}

function bezier(t, points) {
   return (
      Math.pow(1 - t, 3) * points[0] +
      3 * points[1] * t * Math.pow(1 - t, 2) +
      3 * points[2] * (1 - t) * Math.pow(t, 2) +
      points[3] * Math.pow(t, 3)
   );
}
