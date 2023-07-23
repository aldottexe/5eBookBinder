<script>
   import Generator from '$lib/Generator.svelte';
   import Nav from '$lib/Nav.svelte'
   import {tick} from "svelte";
   import { fade } from 'svelte/transition';
   import {downloadImages} from '$lib/zip.js'
   import PageTransition from '$lib/PageTransition.svelte';

   let generate;
   let selectedCard = 0;


   let cards = (async () => {
      await tick();
      return await generate([["wish", "wish"], ["Firebolt", "fire-bolt"]])
   })();

</script>

<Generator bind:generate={generate}/>

<PageTransition>
   <Nav position="sticky"></Nav>
   
   {#await cards}
      <p> loading... </p>

   {:then spellImages}
   
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="display" transition:fade={{duration:500}}>
         <div>
            <img class="spellCard" src={spellImages[selectedCard]} alt="">
            <input type="range" min="0" max={spellImages.length - 1} bind:value={selectedCard}/>
            <button on:click={()=>downloadImages(spellImages)}>download</button>
         </div>
      </div>
   
   {/await}
</PageTransition>

<style>
   img{
      width: 30vw;
   }
   button{
      color: #f4f4f4ff;
      background-color: #00000000;
      border: none;
      transition: color 500ms;
   }
   button:hover{
      color: #f4f4f488;
   }
</style>

