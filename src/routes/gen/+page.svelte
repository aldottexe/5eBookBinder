<script>
   //list of available spells stored in [[name, id], ...] format
   import spellList from "./spellList.json";
   import Nav from "$lib/Nav.svelte";
   import Toggle from "$lib/Toggle.svelte";
   import PageTransition from "$lib/PageTransition.svelte";

   import { onMount } from "svelte";
   import { fade, fly } from "svelte/transition";
   import { spring } from "svelte/motion";

   import * as THREE from "three";
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   import { setupScene } from "$lib/3dHelper.js";

   // the list of spells the user wants in their book
   import { selectedSpells } from "$lib/stores.js";

   import Settings from "$lib/settings.svelte";

   // keeps track of what the user typed into the seach bar
   let userInput = "";
   //a ref to the seachbar
   let searchElement;
   // a ref to the canvas
   let canvas;
   // toggles whether you wanna generate cards or a spellbook
   let toggleSelection;
   let generateBook = false;
   
   let showSettings = false;

   // a ref to an anchor that points to the done page
   let nextLink;

   // a function that runs when you click the generate button
   let generateButtonClick;

   let useOffset = true;

   let xOffset = spring(0, { duration: 100 });

   let anime = spring(
      {
         bx: -2,
         by: 0,
         bz: 0,
         cx: -2,
         cy: 0,
         cz: -20,
         brx: 0.5 * 3.14,
         bry: -0.5 * 3.14,
         brz: 0,
      },
      {
         stiffness: 0.03,
         damping: 0.3,
      }
   );
   let open = spring(
      { b: 0, c: 0 },
      {
         stiffness: 0.01,
         damping: 0.2,
      }
   );

   // the list of spells that fit the user's search
   $: spellsFiltered = (() => {
      let output = new Set();

      spellList.forEach((element) => {
         if (element[0].toLowerCase().startsWith(userInput.toLowerCase()))
            output.add(element);
      });
      spellList.forEach((element) => {
         if (element[0].toLowerCase().includes(userInput.toLowerCase()))
            output.add(element);
      });
      return Array.from(output);
   })();

   // adds a spell to selected spells
   function selectSpell(spell) {
      if (spell && !(userInput === ""))
         selectedSpells.update((s) => [...s, spell]);
      userInput = "";
      setTimeout(() => searchElement.focus(), 100);
   }

   // removes spell at index i from selected spells
   function removeSpell(i) {
      selectedSpells.update((s) => {
         s.splice(i, 1);
         return s;
      });
   }

   //3d stuff
   onMount(async () => {
      const { redraw, scene, camera } = setupScene(canvas, window);
      camera.position.y = 0;
      camera.position.z = 5;
      camera.lookAt(0, 0, 0);

      // scale how far left the objects sit relative to the window width.
      // the useOffset variable controls whether or not this is used
      const calculateXOffset = () => {
         if (useOffset) {
            let yoff = -(800 - window.innerHeight) / 220 + 0.3;
            let xoff = (-2.6 * window.innerWidth) / 1000 + 2.2 + yoff;
            xOffset.set(xoff);
         } else xOffset.set(0);
      };
      window.addEventListener("resize", calculateXOffset);
      calculateXOffset();

      // GRADIENTMAP
      const gmap = await new Promise((res) => {
         new THREE.TextureLoader().load("/fiveTone.jpg", (gmap) => {
            gmap.minFilter = THREE.NearestFilter;
            gmap.magFilter = THREE.NearestFilter;
            res(gmap);
         });
      });

      // BOOK
      let book = new Promise((res) => {
         new GLTFLoader().load("/book.glb", (gltf) => {
            book = gltf.scenes[0].children[0];
            let tmap = book.material.map;
            book.material = new THREE.MeshToonMaterial();
            book.material.map = tmap;
            book.material.gradientMap = gmap;

            let scale = 0.08;
            book.scale.x = scale;
            book.scale.y = scale;
            book.scale.z = scale;
            res(gltf.scenes[0].children[0]);
         });
      });

      // CARD
      let card = new Promise((res) => {
         new GLTFLoader().load("/cards.glb", (gltf) => {
            card = gltf.scenes[0].children[0];

            let tmap = card.material.map;
            card.material = new THREE.MeshToonMaterial();
            card.material.map = tmap;
            card.material.gradientMap = gmap;

            let scale = 0.08;
            card.scale.x = scale;
            card.scale.y = scale;
            card.scale.z = scale;
            card.position.x = -3;
            card.rotation.y = 1.5 * 3.14;

            card.rotation.x = 0.5 * 3.14;

            card.morphTargetInfluences[0] = 0;
            res(card);
         });
      });

      [book, card] = await Promise.all([book, card]);

      scene.add(book);
      scene.add(card);
      requestAnimationFrame(render);

      function render(time) {
         card.position.x = $anime.cx + $xOffset;
         card.position.y = $anime.cy;
         card.position.z = $anime.cz;
         book.position.x = $anime.bx + $xOffset;
         book.position.y = $anime.by;
         book.position.z = $anime.bz;
         book.rotation.x = $anime.brx;
         book.rotation.y = $anime.bry;
         book.rotation.z = $anime.brz;

         card.morphTargetInfluences[0] = $open.c;
         book.morphTargetInfluences[0] = $open.b;

         redraw();
         requestAnimationFrame(render);
      }
      toggleSelection = () => {
         if (generateBook)
            anime.set({
               brx: 0.5 * 3.14,
               bry: -0.5 * 3.14,
               brz: 0,
               bx: -2,
               by: 0,
               bz: 0,
               cx: -2,
               cy: 0,
               cz: -20,
            });
         else
            anime.set({
               brx: 0.5 * 3.14,
               bry: -0.5 * 3.14,
               brz: 0,
               bx: -2,
               by: 0,
               bz: -20,
               cx: -2,
               cy: 0,
               cz: 0,
            });
      };
      toggleSelection();

      generateButtonClick = async () => {
         if (generateBook) {
            // open.set({b:1, c:0})
            // anime.set({...$anime,
            //    brx: 0 * 3.14,
            //    bry: -1 * 3.14,
            //    brz: -.5 * 3.14,
            //    bx: .2,
            //    bz: 2,
            // })
         } else {
            useOffset = false;
            calculateXOffset();

            open.set({ b: 0, c: 1 });
            anime.set({ ...$anime, cx: 0, cz: 2, cy: -1 });
            setTimeout(() => nextLink.click(), 1000);
            // nextLink.click()
         }
      };
   });
</script>


<a href="./done" bind:this={nextLink} />

<PageTransition>
   <section>
      <canvas bind:this={canvas} />

      <Nav />

      <Settings bind:showSettings={showSettings} settings={{"fonts":["comic-sans"]}}/>
      <h1>Generate</h1>



      <div class="content">
         <!-- left side -->
         <div id="card" class="w50 bottomCenter">
            <img class="gear" src="gear.svg" alt="" height="30px" on:click={()=>showSettings = ! showSettings}>
            <div class="toggle">
               Cards
               <Toggle bind:state={generateBook} onClick={toggleSelection} />
               Book
            </div>
         </div>

         <!-- right side -->
         <div id="list" class="w50">
            <div class="selectedSpellList">
               {#if $selectedSpells.length == 0}
                  <p
                     class="directions"
                     in:fade={{ duration: 1000 }}
                     out:fade|local={{ duration: 100 }}
                  >
                     <span>[!]</span>Type some spell names into the box to add
                     them to your book. Once you've added everything, hit
                     generate!
                  </p>
               {/if}

               {#each $selectedSpells as spell, i}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                     class="selectedSpell"
                     on:click={() => removeSpell(i)}
                     transition:fly|local={{ duration: 200, y: 20 }}
                  >
                     <p>{spell[0]}</p>
                  </div>
               {/each}
            </div>

            <div class="controls">
               <form action="" on:submit={() => selectSpell(spellsFiltered[0])}>
                  <input
                     class="searchBar"
                     placeholder="Search spells"
                     bind:value={userInput}
                     bind:this={searchElement}
                     type="text"
                  />
                  <input type="submit" value="" hidden />
               </form>

               <!-- generate button -->
               {#if $selectedSpells.length > 0}
                  <button
                     on:click={generateButtonClick}
                     transition:fade|local={{ duration: 100 }}
                  >
                     {generateBook ? "WIP :/" : "Generate"}
                  </button>
               {/if}
            </div>

            {#if userInput.length > 0 && spellsFiltered.length > 0}
               <div id="suggestions">
                  {#each spellsFiltered as spell}
                     <!-- svelte-ignore a11y-click-events-have-key-events -->
                     <p class="suggestion" on:click={() => selectSpell(spell)}>
                        {spell[0]}
                     </p>
                  {/each}
               </div>
            {/if}
         </div>
      </div>
   </section>
</PageTransition>

<style>
   .gear{
      margin-left: 20%;
      opacity: 50%;
      position:relative;
      transform: rotate(0turn);
      transition: all .5s ease;
   }
   .gear:hover{
      transform: rotate(.25turn) scale(1.2);
      opacity: 100%;
   }
   .list {
      position: relative;
      transform: rotate3d(1, 2, 3, 20deg);
   }
   .content {
      width: 100vw;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: top;
   }
   .w50 {
      width: 50%;
      box-sizing: border-box;
      padding: 20px;
   }
   .selectedSpellList {
      height: 40vh;
      overflow-x: hidden;
      overflow-y: scroll;
      padding-left: 15px;
      width: 430px;
   }
   .selectedSpell {
      cursor: default;
      position: relative;
      transition: ease 0.5s transform;
   }
   .selectedSpell p {
      padding-bottom: 5px;
      border-bottom: solid 2px #f4f4f466;
      width: 400px;
   }
   .selectedSpell:hover {
      transform: scale(1.05);
   }
   .selectedSpell p:hover::before {
      content: url(./line.svg);
      position: absolute;
      width: 400px;
      transform: scaleY(0.6);
      color: var(--light);
   }
   h1 {
      text-align: center;
      font-weight: 700;
   }
   #suggestions {
      overflow: scroll;
      max-height: 40vh;
      position: absolute;
      display: flex;
      flex-direction: column;
      width: fit-content;
      box-sizing: border-box;
      padding: 0 5px;
      background-color: var(--dark);
   }
   .suggestion {
      display: inline-block;
      font-size: 21px;
   }
   section {
      max-height: 100vh;
   }
   .controls {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 400px;
      margin-left: 15px;
   }
   button {
      background-color: rgb(74, 135, 104);
      font-size: 30px;
      padding: 10px;
      border: none;
      transition: transform 500ms;
   }
   button:hover {
      opacity: 100%;
      transform: scale(110%);
   }
   .searchBar {
      font-size: 30px;
      background-color: #00000000;
      border: none;
      border-radius: 0px;
      padding: 5px;
      border-bottom: solid 2px var(--light);
      margin-right: 10px;
   }
   .searchBar:focus {
      outline: none;
   }
   #card {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: space-between;
   }
   .toggle {
      width: 215px;
      margin: 0 auto;
      color: var(--tlight);
   }
   canvas {
      position: absolute;
      z-index: 99;
      pointer-events: none;
   }
   .directions {
      position: absolute;
   }
   @media (max-width: 900px) {
      .w50 {
         width: unset;
      }
      .gear{
         margin-left: 0;
      }
   }
   @media (max-width: 740px) {
      canvas {
         z-index: -1;
      }
   }
</style>
