<script>
   import Generator from '$lib/Generator.svelte';
   import Nav from '$lib/Nav.svelte'
   import { tick } from "svelte";
   import { fade } from 'svelte/transition';
   import { spring } from 'svelte/motion';
   import { downloadImages } from '$lib/zip.js'
   import PageTransition from '$lib/PageTransition.svelte';

   import { selectedSpells } from '$lib/stores.js'
    import { onMount } from 'svelte';

   let generate;
   let progress;
   let selectedCard = 0;
   let backLink;
   let preview;

   let mx, my = 0;

   let downloaded = false;
   function triggerDownloadPopup(){
      downloaded = true;
      setTimeout(()=>downloaded = false, 1500)
   }

   onMount(()=>{
      if($selectedSpells.length === 0)
         backLink.click();
   });


   let cards = (async () => {
      await tick();
      await new Promise(res=>{
         setTimeout(()=>res(), 1000)
      });
      return await generate($selectedSpells)
   })();

   const cardTilt = spring({x:0, y:0}, {stiffness: .01, damping:.5});
   function cursorMove(e){
      mx = e.clientX;
      my = e.clientY;

      cardTilt.set({
      y: -30 * (e.clientY / window.innerHeight) + 15,
      x: 30 * (e.clientX / window.innerWidth) -15
      });
   }
</script>

<Generator bind:generate={generate} bind:p={progress}/>

{#if downloaded}
   <div
    style="
      position: absolute; 
      z-index: 999;
      transform: translateX({mx}px)
      translateY({my}px)">
      <p class="indicator directions"><span>[!]</span>Downloaded!</p>
   </div>
{/if}

<PageTransition>
   <a href="./gen" bind:this={backLink}></a>
   <Nav position="sticky"></Nav>

   
   <div class="center" on:mousemove={cursorMove}>
       <h1>Generate</h1>

      {#await cards}

         <img bind:this={preview} 
              src="https://i.giphy.com/media/GzNzzmpnxXbIxkU5jP/giphy.webp" 
              alt="the wizard is building"
         />

         <p> loading... {progress}/{$selectedSpells.length}</p>

      {:then spellImages}
      
         <!-- svelte-ignore a11y-click-events-have-key-events -->
         <div class="content" in:fade={{duration:500}}>
            <div>
               <img class="spellCard" 
                    src={spellImages[selectedCard]} 
                    alt=""
                    style="transform: perspective(800px) 
                       rotate3d(0,1,0,{$cardTilt.x}deg) 
                       rotate3d(1,0,0,{$cardTilt.y}deg)"
               >
               <p class="noPadBottom">
                  <button class={selectedCard > 0 ? "arrow":"hidden"} on:click={() => {if(selectedCard > 0) selectedCard -= 1}}>&lt;</button>
                   {selectedCard+1}/{spellImages.length} 
                  <button class={selectedCard < spellImages.length - 1 ? "arrow":"hidden"} on:click={() => {if(selectedCard < spellImages.length - 1) selectedCard += 1}}>&gt;</button>
                  <!-- <input type="range" min="0" max={spellImages.length - 1} bind:value={selectedCard}/> -->

               </p>
            </div>
            <div class="options">
               <div>
                  <p class="directions">
                     <span>[!]</span>
                     Done! hit the button to save as a zip file.
                  </p>

                  <button class="downloadButton" on:click={()=>{
                     triggerDownloadPopup();
                     downloadImages(spellImages)
                  }}>
                     Download
                     </button>
               </div>


               <a href="./gen" class="lh35">
                  <span class="arrow">&lt;</span> back
               </a>
            </div>
         </div>
      
      {/await}
   </div>
</PageTransition>

<style>
   button{
      color: #f4f4f4ff;
      background-color: #00000000;
      border: none;
      transition: opacity 500ms;
   }
   button:hover{
      opacity: 50%;
   }
   a, a > *{
      text-decoration: none;
      transition: opacity 500ms;
      line-height: 35px;
   }
   a:hover{
      opacity: 50%;
   }
   a span{
      padding-right: 4px;
   }
   .center{
      margin: 0 auto;
      text-align: center;
   }
   .content{
      display: flex;
      flex-wrap: wrap;
      /* align-items: center; */
      justify-content: center;
      column-gap: 50px;
   }
   .content div{
      width: 30vw;
      min-width: 300px;
      max-width: 350px;
      margin-bottom: 20px;
   }
   .spellCard{
      /* width: 10vw; */
      position: relative;
      display: inline-block;
      margin: 10px;
      max-width: 200px;
      width: 10vw;
      min-width: 275px;
   }
   .options{
      text-align: left;
      display: flex;
      flex-direction:column;
      justify-content: space-between;
      
   }
   .arrow{
      display:inline-block;
      position:relative;
      scale:170%;
      transform: translatey(-1px)
   }
   .hidden{
      opacity: 0;
   }
   .hidden:hover{
      opacity: 0;
   }
   h1{
      margin-bottom: 20px;
   }
   p{
      margin-top: 0;
   }
   .noPadBottom{
      margin-bottom: 0;
   }
   .downloadButton{
      position: relative;
      background-color: rgb(74, 135, 104);
      font-size: 30px;
      padding: 10px;
      border: none;
      transition: transform 500ms;
   }
   .downloadButton:hover{
      opacity: 100%;
      transform: scale(110%);
      animation: shake .5s infinite alternate;
   }
   @media (max-width: 649px){
      .downloadButton{
         display: block;
         margin: 50px auto 30px auto;
      }
   }
   @keyframes shake{
      from{
         transition: rotate(.3turn);
      }
      to{
         transition: rotate(-.3turn);
      }
   }

   .indicator{
      position: absolute;
      opacity: 0;
      pointer-events: none;
      animation: popup 1.5s ease-out;
   }
   @keyframes popup{
      0%{
         opacity: 0%;
         transform: translateY(0);
      }
      30%{
         opacity: 100%;
      }
      100%{
         opacity: 0%;
         transform: translateY(-3rem);
      }
   }
</style>
