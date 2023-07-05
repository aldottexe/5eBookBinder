<script>
   import Cta from '$lib/Cta.svelte'
   import Nav from '$lib/Nav.svelte'
   import * as THREE from "three";
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   import { onMount } from 'svelte';
   import {spring} from 'svelte/motion'
   import { setupScene } from '$lib/3dHelper';
   let canvas;
   let click;
   let anime = spring({x : 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, o: 0}, {
      stiffness: 0.007,
      damping: 0.1
   })
   let idle = true;

   onMount(()=>{
      const {redraw, scene} = setupScene(canvas, window);

      // GRADIENTMAP
      let gmap = new THREE.TextureLoader().load("/fiveTone.jpg", gmap => {
         gmap.minFilter = THREE.NearestFilter;
         gmap.magFilter = THREE.NearestFilter;
         return gmap;
      });

      // MATERIAL
      const material = new THREE.MeshToonMaterial();
      material.gradientMap = gmap;

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

      function render(time) {
         redraw();
         book.rotation.x = $anime.rx;
         book.rotation.y = $anime.ry;
         book.rotation.z = $anime.rz;
         book.position.x = $anime.x;
         book.position.y = $anime.y;
         book.position.z = $anime.z;
         book.morphTargetInfluences[0] = $anime.o;

         if(idle)
            $anime.ry += .01

         requestAnimationFrame(render);
      }

      click = () => {
         console.log(book.rotation.y)
         console.log("click")
         idle = false;
         let rotations = book.rotation.y - (book.rotation.y % 6.28)
         anime.set({x: -.4, z: -1, y:-.5, rx: -.9, ry: rotations + 3.1, rz: 1.5, o:1})
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