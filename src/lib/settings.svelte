<script>
   import { settings } from "$lib/stores.js";
   import { fade } from "svelte/transition";
   export let showSettings = true;

   $: console.log($settings);
</script>

<!-- "width": 300, -->
<!-- "height": 400, -->
<!-- "fonts": ["comic sans ms", "georgia", "arial"], -->
<!-- "font-index": 0, -->
<!-- "body-size": 10, -->
<!-- "level-size": 16, -->
<!-- "h-size": 24, -->

{#if showSettings}
   <div class="content" transition:fade={{duration:100}}>
      <div class="controls">
         <h2>Settings</h2>

         <label for="">Font</label>
         <select name="Font" bind:value={$settings["font-index"]}>
            {#each $settings.fonts as f}
               <option value={f}>
                  {f}
               </option>
            {/each}
         </select>

         <label for="">Title</label>
         <input
            type="range"
            max="50"
            min="0"
            bind:value={$settings["h-size"]}
         />
         <label for="">Body</label>
         <input
            type="range"
            max="50"
            min="0"
            bind:value={$settings["body-size"]}
         />
         <label for="">Level</label>
         <input
            type="range"
            max="50"
            min="0"
            bind:value={$settings["level-size"]}
         />

            <button on:click={()=>showSettings=false}>done</button>
      </div>
      <div 
         class="preview" 
         style={`
            --width: ${$settings["width"]}px;
            --height: ${$settings["height"]}px;
            --body-size: ${$settings["body-size"]}px;
            --h-size: ${$settings["h-size"]}px;
            --level-size: ${$settings["level-size"]}px;
            --font: ${$settings["font-index"]};
         `}>
         <h1>Firebolt</h1>

         <p class="level" style={`color: red`}>Cantrip</p>

         <div>
            <b>Casting Time:</b>instant
         </div>
         <div>
            <b>Range:</b>
            50
         </div>
         <div>
            <b>Components:</b>
            vsm
         </div>
         <div>
            <b>Duration:</b>
            instantanious
         </div>

         <p>
            You hurl a mote of fire at a creature or object within range. Make a
            ranged spell attack against the target. On a hit, the target takes
            1d10 fire damage. A flammable object hit by this spell ignites if it
            isn’t being worn or carried. This spell’s damage increases by 1d10
            when you reach 5th level (2d10), 11th level (3d10), and 17th level
            (4d10).
         </p>
      </div>

   </div>
{/if}

<style>
   .content{
      position: absolute;
      display: flex;
      background-color: var(--dark);
      padding: 50px;
      z-index: 99;
   }
   input,
   select {
      display: block;
   }
   select{
      background-color: var(--dark);
   }
   .preview :global(*) {
      font-size: var(--body-size);
      font-family: var(--font);
      color: black;
      line-height: unset;
   }
   .preview {
      background-color: white;
      box-sizing: border-box;
      padding: 15px 30px;
      width: calc(100 * var(--width));
      height: calc(100 * var(--height));
      /* min-height: 400px; */
      margin: 0;
      overflow: hidden;
   }
   .preview :global(h1) {
      letter-spacing: 0;
      font-size: var(--h-size);
      margin-top: 0;
      padding-top: 0;
      margin-bottom: 0;
      padding-bottom: 0;
   }
   .preview :global(ul) {
      padding-left: 20px;
   }
   .level {
      padding: 0;
      padding-bottom: 10px;
      margin: 0;
      font-size: var(--level-size);
      font-weight: bold;
      position: relative;
      transform: translateY(-3px);
   }
   .hidden {
      height: 0;
      /* opacity: 20%; */
      overflow: hidden;
   }
   b {
      font-weight: bold;
   }
</style>
