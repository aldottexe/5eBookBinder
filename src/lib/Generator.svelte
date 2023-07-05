<script>
import * as htmlToImage from "html-to-image";

const ppi = 300;
const pixelRatio = ppi / 100;

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

let json = {};
let card;
let spellInfo = [];

export async function generate(selectedSpells) {
   spellInfo = selectedSpells.map(async spell => {
      let res = await fetch(`./spells/${spell[1]}.json`);
      json = await res.json();

      console.log("overflowing: " + (card.scrollHeight > card.clientHeight));

      const img = await htmlToImage.toPng(card, {
         width: 300,
         height: 400,
         pixelRatio: pixelRatio,
         style: {
            backgroundColor: "white",
            fontFamily: "comic sans ms",
            width: "300px",
            height: "400px",
         },
      });

      return img;
   });

   spellInfo = await Promise.all(spellInfo);
   return spellInfo;
}
</script>

<!-- displays the final images -->
{#each spellInfo as spell}
   <img src={spell} alt="">
{/each}

<!-- a hidden place to render the html for the cards -->
<div class="hidden">
   <div class="card" bind:this={card}>
      <h1>{json.title}</h1>

      <p class="level"
      style={`color: ${colors[json.level]}`}>{json.level === 0 ? "Cantrip" : `Level ${json.level}`}</p>

      <div><b>Casting Time:</b> {json["casting time"]}</div>
      <div><b>Range:</b> {json["range"]}</div>
      <div><b>Components:</b> {json["componenents"]}</div>
      <div><b>Duration:</b> {json["duration"]}</div>

      <p>
         {@html json.description}
      </p>
   </div>
</div>

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
            height: 400px;
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
      overflow: hidden;
   }
   b{
      font-weight: bold;
   }
   :global(ul){
      padding-left: 20px;
   }
</style>