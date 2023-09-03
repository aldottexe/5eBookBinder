<script>
   import Cta from "$lib/Cta.svelte";
   import Nav from "$lib/Nav.svelte";
   import * as THREE from "three";
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   import { onMount } from "svelte";
   import { spring } from "svelte/motion";
   import { setupScene } from "$lib/3dHelper";
   import { fade } from "svelte/transition";
   import PageTransition from "$lib/PageTransition.svelte";

   let canvas;
   let click;
   let mouseMove;
   const cameraXY = spring({ x: 0, y: 3 }, { stiffness: 0.05, damping: 0.5 });
   let anime = spring(
      { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, o: 0 },
      {
         stiffness: 0.007,
         damping: 0.1,
      }
   );
   let idle = true;

   onMount(async () => {
      const { redraw, scene, camera } = setupScene(canvas, window);

      // GRADIENTMAP
      let gmap = new Promise((res) => {
         new THREE.TextureLoader().load("/fiveTone.jpg", (gmap) => {
            gmap.minFilter = THREE.NearestFilter;
            gmap.magFilter = THREE.NearestFilter;
            res(gmap);
         });
      });

      // MATERIAL
      const material = new THREE.MeshToonMaterial();
      material.gradientMap = await gmap;

     // BOOK
      let book = await new Promise((res) => {
         new GLTFLoader().load("/book.glb", (gltf) => {
            res(gltf.scenes[0].children[0]);
         });
      });

      let tmap = book.material.map;
      book.material = material;
      book.material.map = tmap;

      let scale = 0.08;
      book.scale.x = scale;
      book.scale.y = scale;
      book.scale.z = scale;

      scene.add(book);
      requestAnimationFrame(render);

      function render(time) {
         book.rotation.x = $anime.rx;
         book.rotation.y = $anime.ry;
         book.rotation.z = $anime.rz;
         book.position.x = $anime.x;
         book.position.y = $anime.y;
         book.position.z = $anime.z;
         book.morphTargetInfluences[0] = $anime.o;

         camera.position.x = $cameraXY.x;
         camera.position.y = $cameraXY.y;
         camera.lookAt(0, 0.5, 0);

         if (idle) $anime.ry = time * 0.0004;

         redraw();
         requestAnimationFrame(render);
      }

      click = () => {
         idle = false;
         cameraXY.set({ x: 0, y: 3 });
         let rotations = book.rotation.y - (book.rotation.y % 6.28);
         anime.set({
            x: -0.4,
            z: -1,
            y: -0.5,
            rx: -0.9,
            ry: rotations + 3.1,
            rz: 1.5,
            o: 1,
         });
         setTimeout(() => {
            anime.set({
               x: -0.2,
               z: 4,
               y: 4,
               rx: -0.6,
               ry: rotations + 3.3,
               rz: 1.8,
               o: 1,
            });
         }, 1400);
      };
      mouseMove = (e) => {
         if (idle)
            cameraXY.set({
               y: 2 * (e.clientY / window.innerHeight) + 2,
               x: -6 * (e.clientX / window.innerWidth) + 3,
            });
      };
   });
</script>

<PageTransition>
   <canvas bind:this={canvas} />

   <div
      class="content"
      transition:fade={{ duration: 200 }}
      on:mousemove={mouseMove}
   >
      <div
         style="
         opacity:{1 - $anime.o};
         transform:scale({0.2 * $anime.o + 1})
         "
      >
         <Nav position="sticky" />
         <h1>5eBookBinder</h1>
         <p>An automated spell book generator for Dungeons&Dragons</p>
         <Cta
            href="gen"
            text="~ PRESS TO START ~"
            onclick={click}
            delay="2000"
         />
      </div>
   </div>
</PageTransition>

<style>
   .content {
      height: 100vh;
      width: 100vw;
      text-align: center;
      justify-content: center;
      overflow: hidden;
   }
   .content div {
      position: relative;
   }
   p {
      max-width: 500px;
      margin: 0 auto;
      margin-top: 20px;
   }
</style>
