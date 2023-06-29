<script>
   import Cta from '$lib/Cta.svelte'
   import Nav from '$lib/Nav.svelte'
   import * as THREE from "three";
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
   import { onMount } from 'svelte';
   import {spring} from 'svelte/motion'
   let canvas;
   let click;
   let anime = spring({x : 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, o: 0}, {
      stiffness: 0.007,
      damping: 0.1
   })
   let idle = true;

   onMount(()=>{
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
      camera.lookAt(0,0,-.5)
      // camera.rotation.x = -0.6;

      // new OrbitControls(camera, renderer.domElement);

      // SCENE
      const scene = new THREE.Scene();

      // GRADIENTMAP
      let gmap = new THREE.TextureLoader().load("/fiveTone.jpg", gmap => {
         gmap.minFilter = THREE.NearestFilter;
         gmap.magFilter = THREE.NearestFilter;
         return gmap;
      });

      // MATERIAL
      const material = new THREE.MeshToonMaterial();
      material.gradientMap = gmap;

      // LIGHT
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.z = 1.5;
      light.position.x = 1;
      light.position.y = 2;
      scene.add(light);

      // AMBIENT LIGHT
      const gi = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(gi);

      // BOOK
      let book = new GLTFLoader().load("/book.glb", gltf => {
         book = gltf.scenes[0].children[0];

         let tmap = book.material.map;
         book.material = material;
         book.material.map = tmap;

         let scale = 0.08;
         book.scale.x = scale;
         book.scale.y = scale;
         book.scale.z = scale;
      
         

         scene.add(book);
         requestAnimationFrame(render);
      });

      function bezier(t, points) {
         return (
            Math.pow(1 - t, 3) * points[0] +
            3 * points[1] * t * Math.pow(1 - t, 2) +
            3 * points[2] * (1 - t) * Math.pow(t, 2) +
            points[3] * Math.pow(t, 3)
         );
      }

      function render(time) {
         renderer.render(scene, camera);
         book.rotation.x = $anime.rx;
         book.rotation.y = $anime.ry;
         book.rotation.z = $anime.rz;
         book.position.x = $anime.x;
         book.position.y = $anime.y;
         book.position.z = $anime.z;
         book.morphTargetInfluences[0] = $anime.o;

         if(idle)
            $anime.ry += .01

         setTimeout(() => {
         requestAnimationFrame(render);
         }, 1000/30);
      }
      requestAnimationFrame(render);

      window.addEventListener("resize", e => {
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
         renderer.setPixelRatio(window.devicePixelRatio);
         renderer.setSize(window.innerWidth, window.innerHeight);
      });

      click = () => {
         console.log(book.rotation.y)
         console.log("click")
         idle = false;
         let rotations = book.rotation.y - (book.rotation.y % 6.28)
         anime.set({x: -.4, z: -1, y:-.5, rx: -1, ry: rotations + 3, rz: 1.4, o:1})
         setTimeout(() => {
            anime.set({x: -.2, z:4, y:4, rx: -.6, ry: rotations + 3.3, rz: 1.8, o:1})
         }, 1400);
      }
   })
</script>



<canvas bind:this={canvas}></canvas>
<div class="content" >
   <div style="
      opacity:{1-$anime.o};
      transform:scale({.2*$anime.o+1})
      ">
      <Nav position="sticky"></Nav>
      <h1>5eBookBinder</h1>
      <p>An automated spell book generator for<br/>Dungeons&Dragons</p>
      <Cta href="gen" text="~ PRESS TO START ~" onclick={click} delay=2000/>
   </div>
</div>



<style>
   canvas{
      position: absolute;
      z-index: -1
   }
   .content{
      height: 100vh;
      width: 100vw;
      text-align: center;
      justify-content: center;
      overflow: hidden;
   }
   .content div{
      position: relative;
   }
   p{
      margin-top: 20px;
   }
</style>