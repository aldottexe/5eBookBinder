<script>
   //list of available spells stored in [[name, id], ...] format
   import spellList from './spellList.json'
   import Nav from '$lib/Nav.svelte'
   import Toggle from '$lib/Toggle.svelte'
   import Generator from '$lib/Generator.svelte';

   import { fade, fly } from 'svelte/transition';
   import {spring} from 'svelte/motion'
   import PageTransition from '$lib/PageTransition.svelte';

   import * as THREE from 'three'
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   import { setupScene } from '$lib/3dHelper.js'
   import {onMount} from 'svelte'

   //stores specifics about selected spells
   let spellInfo = [];
   // the list of spells the user wants in their book
   let selectedSpells = [];
   // keeps track of what the user typed into the seach bar
   let userInput = '';
   //a ref to the seachbar
   let searchElement;
   // a ref to the canvas
   let canvas;
   // toggles whether you wanna generate cards or a spellbook
   let toggleSelection;
   let generateBook = true;
   
   let generateButtonClick;

   let useOffset = true;

   // the generate function that gets 
   // assigned when the generator componenent is rendered
   let generate;

   let resetScene;

   let xOffset = spring(0, {duration: 100})

   let anime = spring({
         bx: -2, 
         by: 0, 
         bz: 0, 
         cx: -2, 
         cy: 0, 
         cz: -20, 
         brx: .5 * 3.14, 
         bry: -.5*3.14, 
         brz:0
      }, {
         stiffness: 0.03,
         damping: 0.3
   })
   let open = spring({b:0, c:0}, {
      stiffness: .01,
      damping: .2,
   })

   // the list of spells that fit the user's search
   $: spellsFiltered = (()=>{
      let output = new Set();

      spellList.forEach(element =>{
         if(element[0].toLowerCase().startsWith(userInput.toLowerCase())) 
            output.add(element)
      });
      spellList.forEach(element => {
         if(element[0].toLowerCase().includes(userInput.toLowerCase()))
            output.add(element);
      });
      return Array.from(output);
   })();

   // adds a spell to selected spells
   function selectSpell(spell){
      if(spell && !(userInput === ''))
      selectedSpells = [...selectedSpells, spell];
      userInput = '';
      setTimeout(()=>
      searchElement.focus(), 100)
   }

   // removes spell at index i from selected spells
   function removeSpell(i){
      selectedSpells.splice(i, 1);
      selectedSpells = selectedSpells
   }

   //3d stuff
   onMount(()=>{
      const {redraw, scene, camera} = setupScene(canvas, window);
      camera.position.y = 0
      camera.position.z = 5
      camera.lookAt(0,0,0)
   
      // scale how far left the objects sit relative to the window width.
      // the useOffset variable controls whether or not this is used
      const calculateXOffset = () => {
         if(useOffset){
            let yoff = - (800-window.innerHeight)/220 + .3
            console.log(yoff)
            let xoff = - 2.6* window.innerWidth/1000 + 2.2 + yoff
            xOffset.set(xoff)
         }
         else
            xOffset.set(0)
      };
      window.addEventListener("resize", calculateXOffset);
      calculateXOffset();


      // GRADIENTMAP
      new THREE.TextureLoader().load("/fiveTone.jpg", gmap => {
         gmap.minFilter = THREE.NearestFilter;
         gmap.magFilter = THREE.NearestFilter;
         book.material.gradientMap = gmap;
         card.material.gradientMap = gmap;
         return gmap;
      });


      // BOOK
      let book = new GLTFLoader().load("/book.glb", gltf => {
         book = gltf.scenes[0].children[0];

         let tmap = book.material.map;
         book.material = new THREE.MeshToonMaterial();
         book.material.map = tmap;

         let scale = 0.08;
         book.scale.x = scale;
         book.scale.y = scale;
         book.scale.z = scale;

         scene.add(book);
      });

      let card = new GLTFLoader().load("/cards.glb", gltf => {
         card = gltf.scenes[0].children[0];

         let tmap = card.material.map;
         card.material = new THREE.MeshToonMaterial();
         card.material.map = tmap;

         let scale = 0.08;
         card.scale.x = scale;
         card.scale.y = scale;
         card.scale.z = scale;
         card.position.x = -3;
         card.rotation.y = 1.5 * 3.14

         card.rotation.x = .5 * 3.14

         card.morphTargetInfluences[0] = 0;
         scene.add(card);
         requestAnimationFrame(render);
      });

      // const light = new THREE.PointLight(0xffffff, 1, 3);
      // light.position.z = 4;
      // light.position.x = 2;
      // light.position.y = 0;
      // scene.add(light);

      
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

         card.morphTargetInfluences[0] = $open.c
         book.morphTargetInfluences[0] = $open.b

         redraw();
         requestAnimationFrame(render);
      }
      toggleSelection = () => {
         if(generateBook)
            anime.set({
               brx: .5 * 3.14, 
               bry: -.5*3.14, 
               brz:0, 
               bx: -2, 
               by: 0,
               bz: 0, 
               cx: -2, 
               cy: 0,
               cz: -20
            });
         else
            anime.set({
               brx: .5 * 3.14, 
               bry: -.5*3.14, 
               brz:0, 
               bx: -2, 
               by: 0,
               bz: -20, 
               cx: -2, 
               cy: 0,
               cz: 0
            });
      };

      generateButtonClick = async () => {

         if(generateBook){
            // open.set({b:1, c:0})
            // anime.set({...$anime, 
            //    brx: 0 * 3.14, 
            //    bry: -1 * 3.14, 
            //    brz: -.5 * 3.14,
            //    bx: .2,
            //    bz: 2,
            // })
         }else{
            useOffset = false;
            calculateXOffset();

            open.set({b:0, c:1})
            anime.set({...$anime, 
               cx: 0,
               cz: 2,
               cy: -1,
            })
            spellInfo = await generate(selectedSpells)
         }
      }

      resetScene = () => {
         open.set({b:0, c:0})
         useOffset = true;
         calculateXOffset();
         toggleSelection();
      }

   });


</script>


<Generator bind:generate={generate} onClose={resetScene}/>

<PageTransition>
<section>
   <canvas bind:this={canvas}></canvas>

   <Nav></Nav>

   <h1>Generator</h1>

   <div class="content" >

      <!-- left side -->
      <div id="card" class="w50 bottomCenter">
         <div class="toggle">
            Cards
            <Toggle bind:state = {generateBook} onClick = {toggleSelection}/>
            Book
         </div>
      </div>

      <!-- right side -->
      <div id="list" class="w50">

         <div class="selectedSpellList">
            {#if selectedSpells.length == 0}
               <p class="directions" 
                  in:fade={{duration: 1000}} 
                  out:fade|local={{duration: 100}}
                  >
                  <span>[!]</span>Type some spell names into the box to add 
                  them to your book. Once you've added everything, hit generate!</p>
            {/if}

            {#each selectedSpells as spell, i}
               <!-- svelte-ignore a11y-click-events-have-key-events -->
               <div class="selectedSpell" on:click={() => removeSpell(i)} transition:fly|local={{duration: 200, y:20}}> 
                  <p>{spell[0]}</p>
               </div>
            {/each}
         </div>

         <div class="controls">
            <form action="" on:submit={() => selectSpell(spellsFiltered[0])}>
               <input class="searchBar" placeholder="Search spells" bind:value={userInput} bind:this={searchElement} type="text">
               <input type="submit" value="" hidden>
            </form>

            <!-- generate button -->
            {#if selectedSpells.length > 0}
               
               <button on:click={generateButtonClick} transition:fade|local={{duration:100}}>
               {generateBook ? "WIP :/":"Generate"}
               </button>
            {/if}
         </div >

         {#if userInput.length > 0 && spellsFiltered.length > 0}
            <div id="suggestions">
               {#each spellsFiltered as spell}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <p  class="suggestion" on:click={() => selectSpell(spell)}>
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
   .list{
      position: relative;
      transform: rotate3d(1,2,3, 20deg);
   }
   .content{
      display: flex;
      justify-content: center;
      align-items: top;
   }
   .w50{
      width: 50%;
      box-sizing: border-box;
      padding: 20px;
   }
   .selectedSpellList{
      height: 40vh;
      overflow-x: hidden;
      overflow-y: scroll;
      padding-left: 15px;
      width: 430px;
   }
   .selectedSpell{
      cursor: default;
      position: relative;
      transition: ease .5s transform;
   }
   .selectedSpell p{
      padding-bottom: 5px;
      border-bottom: solid 2px #f4f4f466;
      width: 400px;
   }
   .selectedSpell:hover{
      transform: scale(1.05);
   }
   .selectedSpell p:hover::before{
      content: url(./line.svg);
      position: absolute;
      width: 400px;
      transform: scaleY(.6);
      color: #f4f4f4;
   }
   h1{
      text-align: center;
      font-weight: 700;
   }
   #suggestions{
      overflow: scroll;
      max-height: 40vh;
      position:absolute;
      display:flex;
      flex-direction: column;
      width:fit-content;
      box-sizing: border-box;
      padding: 0 5px;
      background-color: #262626;
   }
   .suggestion{
      display:inline-block;
      font-size: 21px;
   }
   section{
      max-height: 100vh;
   }
   .directions{
      opacity: 50%;
      position: absolute;
      width: 430px;
   }
   .directions span{
      font-size: 35px;
      position: absolute;
      transform: translateX(-40px) rotateZ(-5deg);
   }
   .controls{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 400px;
      margin-left: 15px;
   }
   button{
      background-color: rgb(74, 135, 104);
      font-size: 30px;
      padding: 10px;
      border: none;
   }
   .searchBar{
      font-size: 30px;
      background-color: #00000000;
      border: none;
      border-radius: 0px;
      padding: 5px;
      border-bottom: solid 2px #f4f4f4;
   }
   .searchBar:focus{
      outline: none;
   }
   img{
      width: 100%;
   }
   .bottomCenter{
      display: flex;
      justify-content: center;
      align-items:end;
   }
   .toggle{
      width: 215px;
      margin: 0 auto;
      color: #f4f4f488;
   }
   #card{
      flex-direction: column-reverse;
      justify-content: flex-start;
   }
   canvas{
      position: absolute;
      z-index: 99;
      pointer-events: none;
   }
</style>
