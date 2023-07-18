<script>
import * as htmlToImage from "html-to-image";
import {tick} from "svelte";
import {fade} from 'svelte/transition'

const ppi = 300;
const pixelRatio = ppi / 100;

let cardNum = 0;

const colors = [
   "red",
   "green",
   "blue",
   "yellow",
   "pink",
   "orange",
   "purple",
   "orange",
   "orange",
   "orange",
];

generatorOptions = {
   width: 300,
   height: 400,
   pixelRatio: pixelRatio,
   style: {
      backgroundColor: "white",
      fontFamily: "comic sans ms",
      width: "300px",
      height: "400px",
   },
}

let cardTemplateData = {};
let cardTemplate;

let cardOverflowTemplate;
let descOverflow = ""

let spellInfo = [];
let spellImages = [];

export async function generate(selectedSpells) {

   let spellDataObjects = selectedSpells.map(async spell => {
      let res = await fetch(`./spells/${spell[1]}.json`);
      return await res.json();
   });
   spellDataObjects = await Promise.all(spellDataObjects);

   spellDataObjects.sort((a, b) => 
      parseInt(a.level) - parseInt(b.level)
   );

   for (const [i, spellDataObject] of spellDataObjects.entries()) {
      cardTemplateData = spellDataObject;
      await tick();
      let overflow = chopAtOverflow(cardTemplate, spellDataObject, cardTemplateData);

      //GENERATE CARD
      const img = await htmlToImage.toPng(cardTemplate, generatorOptions);
      
      spellInfo[i] = img;
   }


   spellInfo = await Promise.all(spellInfo);

   return spellInfo;
}

function checkOverflow(element){
   return (
      element.clientHeight > 400
   )
}

async function chopAtOverflow(element, spellDataObject){
   let newDesc = "";

   await tick();
   while (element.clientHeight > 400){
      const lastIndex = spellDataObject.description.lastIndexOf(" ");
      newDesc = spellDataObject.description.substring(lastIndex) + " " + newDesc;
      spellDataObject.description = spellDataObject.description.substring(0, lastIndex);
      
      console.log("removed" + newDesc);

      cardTemplateData = spellDataObject

      await tick();
   }
   return newDesc;
}
</script>


<!-- a hidden place to render the html for the cards -->
<div class="hidden">
   <div class="card" bind:this={cardTemplate}>
      <h1>{cardTemplateData.title}</h1>

      <p class="level"
         style={`color: ${colors[cardTemplateData.level]}`}>{cardTemplateData.level === 0 ? "Cantrip" : `Level ${cardTemplateData.level}`}
      </p>

      <div><b>Casting Time:</b> {cardTemplateData["casting time"]}</div>
      <div><b>Range:</b> {cardTemplateData["range"]}</div>
      <div><b>Components:</b> {cardTemplateData["componenents"]}</div>
      <div><b>Duration:</b> {cardTemplateData["duration"]}</div>

      <p>
         {@html cardTemplateData.description}
      </p>
   </div>

   <div class="card" bond:this={cardOverflowTemplate}>
   {@html descOverflow}
   
   </div>
</div>

{#if spellInfo.length > 0}
   <div class="display" transition:fade={{duration:100}}>
      <div>
         <!-- displays the final images -->
         <img class="spellCard" src={spellInfo[cardNum]} alt="">
         <input type="range" min="0" max={spellInfo.length - 1} bind:value={cardNum}/>
      </div>
   </div>
{/if}

<style>
   .card :global(*){
      font-size: 10px;
      font-family: "comic sans ms";
      color: black;
   }
   .card{
            background-color: white;
            box-sizing: border-box;
            padding: 15px 30px;
            width: 300px;
            /* min-height: 400px; */
            margin: 0;
            
   }
   .card :global(h1){
      letter-spacing: 0;
      font-size: 24px;
      margin-top: 0;
      padding-top: 0;
      margin-bottom: 0;
      padding-bottom: 0;
   }
   .level{
      padding: 0;
      padding-bottom: 10px;
      margin: 0;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      transform: translateY(-3px);

   }
   img{
      width: 30vw;
   }
   .hidden{
      height: 0;
      /* overflow: hidden; */
   }
   b{
      font-weight: bold;
   }
   :global(ul){
      padding-left: 20px;
   }
   .display{
      position: absolute;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      text-align: center;
      width: 100vw;
      height: 100vh;
      background-color: #00000088;
   }
   .spellCard{
      display: block;
   }
</style>