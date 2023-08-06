<script>
   import * as htmlToImage from "html-to-image";
   import { tick } from "svelte";
   import { fade } from "svelte/transition";

   const ppi = 300;
   const pixelRatio = ppi / 100;

   // the card that the user is viewing
   let selectedCard = 0;

   // the accent color based on spell level
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

   let generatorOptions = {
      width: 300,
      height: 400,
      pixelRatio: pixelRatio,
      style: {
         backgroundColor: "white",
         fontFamily: "comic sans ms",
         width: "300px",
         height: "400px",
      },
   };

   // the data to insert into the card element
   let cardTemplateData = {};
   // a reference to the card div
   let cardTemplate;

   // a reference to the overflow card
   let cardOverflowTemplate;
   // any description text that didn't fit on the first card
   let descOverflow = "";
   // the images genereated
   let spellImages = [];

   export let p = 0;

   // takes a list of spell names in [name, id] format
   export async function generate(nameAndID) {
      // grabs the spell data for each spell in the list
      let spellDataObjects = nameAndID.map(async (spell) => {
         let res = await fetch(`./spells/${spell[1]}.json`);
         return await res.json();
      });
      spellDataObjects = await Promise.all(spellDataObjects);

      // sorts spells by level
      spellDataObjects.sort((a, b) => parseInt(a.level) - parseInt(b.level));

      // loops through all the spell data
      for (const spellDataObject of spellDataObjects) {
         p += 1;

         // assigns the current spell data to be rendered to the dom
         cardTemplateData = spellDataObject;
         // waits for svelte to render the change
         await tick();

         // if the text is longer than what will fit on a card, crop it
         // and store the rest
         descOverflow = await chopAtOverflow(cardTemplate, spellDataObject);

         // GENERATE CARD
         const img = await htmlToImage.toPng(cardTemplate, generatorOptions);
         spellImages.push(img);

         while (descOverflow.length > 0)
            descOverflow = await chopOverflowAtOverflow(cardOverflowTemplate);
      }

      spellImages = await Promise.all(spellImages);

      return spellImages;
   }

   async function chopAtOverflow(element, spellDataObject) {
      let newDesc = "";

      await tick();
      while (element.clientHeight > 400) {
         const lastIndex = spellDataObject.description.lastIndexOf(" ");
         newDesc =
            spellDataObject.description.substring(lastIndex) + " " + newDesc;
         spellDataObject.description = spellDataObject.description.substring(
            0,
            lastIndex
         );

         cardTemplateData = spellDataObject;

         await tick();
      }
      // console.log("choped off..." + newDesc);
      return newDesc;
   }

   async function chopOverflowAtOverflow(element) {
      let newDesc = "";
      await tick();
      while (element.clientHeight > 400) {
         const lastIndex = descOverflow.lastIndexOf(" ");
         newDesc = descOverflow.substring(lastIndex) + " " + newDesc;

         descOverflow = descOverflow.substring(0, lastIndex);
         await tick();
      }
      // console.log("choped overflow at..." + newDesc);

      const img = await htmlToImage.toPng(
         cardOverflowTemplate,
         generatorOptions
      );
      spellImages.push(img);

      return newDesc;
   }
</script>

<!-- a hidden place to render the html for the cards -->
<div class="hidden">
   <div class="card" bind:this={cardTemplate}>
      <h1>{cardTemplateData.title}</h1>

      <p class="level" style={`color: ${colors[cardTemplateData.level]}`}>
         {cardTemplateData.level === 0
            ? "Cantrip"
            : `Level ${cardTemplateData.level}`}
      </p>

      <div><b>Casting Time:</b> {cardTemplateData["casting time"]}</div>
      <div><b>Range:</b> {cardTemplateData["range"]}</div>
      <div><b>Components:</b> {cardTemplateData["componenents"]}</div>
      <div><b>Duration:</b> {cardTemplateData["duration"]}</div>

      <p>
         {@html cardTemplateData.description}
      </p>
   </div>

   <div class="card" bind:this={cardOverflowTemplate}>
      <p>
         {@html descOverflow}
      </p>
   </div>
</div>

<style>
   .card :global(*) {
      font-size: 10px;
      font-family: "comic sans ms";
      color: black;
      line-height: unset;
   }
   .card {
      background-color: white;
      box-sizing: border-box;
      padding: 15px 30px;
      width: 300px;
      /* min-height: 400px; */
      margin: 0;
   }
   .card :global(h1) {
      letter-spacing: 0;
      font-size: 24px;
      margin-top: 0;
      padding-top: 0;
      margin-bottom: 0;
      padding-bottom: 0;
   }
   .card :global(ul) {
      padding-left: 20px;
   }
   .level {
      padding: 0;
      padding-bottom: 10px;
      margin: 0;
      font-size: 16px;
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
   .display {
      position: absolute;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      text-align: center;
      width: 100vw;
      height: 100vh;
      background-color: #00000088;
   }
   .spellCard {
      display: block;
   }
</style>
