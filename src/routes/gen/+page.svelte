<script>
   //list of available spells stored in [[name, id], ...] format
   import spellList from './spellList.json'
   import Nav from '$lib/Nav.svelte'
   import { generate } from './generator';
   import { fade, fly } from 'svelte/transition';

   //stores specifics about selected spells
   let spellInfo = [];
   // the list of spells the user wants in their book
   let selectedSpells = [];
   // keeps track of what the user typed into the seach bar
   let userInput = '';
   //a ref to the seachbar
   let searchElement;


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
</script>


<section>
   <Nav></Nav>
   <h1>Generator</h1>
   <div class="content">
      <!-- left side -->
      <div id="card" class="w50">
         {#each spellInfo as spell}
            <img src={spell} alt="">
         {/each}
      </div>

      <!-- right side -->
      <div id="list" class="w50">
         <div class="selectedSpellList">
         {#if selectedSpells.length == 0}
            <p class="directions" in:fade={{duration: 1000}} out:fade={{duration: 100}}>
               <span>[!]</span>Type some spell names into the box to add 
               them to your book. When you've added everything hit generate!</p>
         {/if}
         {#each selectedSpells as spell, i}
            <div class="selectedSpell" on:click={() => removeSpell(i)} transition:fly={{duration: 200, y:20}}> 
               <p>{spell[0]}</p>
            </div>
         {/each}
         </div>

         <div class="controls">
            <form action="" on:submit={() => selectSpell(spellsFiltered[0])}>
               <input class="searchBar" placeholder="Search spells" bind:value={userInput} bind:this={searchElement} type="text">
               <input type="submit" value="" hidden>
            </form>

            {#if selectedSpells.length > 0}
               <button on:click={async () => spellInfo = await generate(selectedSpells)} transition:fade={{duration:100}}>Generate</button>
            {/if}
         </div >

         {#if userInput.length > 0 && spellsFiltered.length > 0}
            <div id="suggestions">
               {#each spellsFiltered as spell}
                  <p  class="suggestion" on:click={() => selectSpell(spell)}>
                     {spell[0]}
                  </p>
               {/each}
            </div>
         {/if}
      </div>
   </div>
</section>


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
</style>