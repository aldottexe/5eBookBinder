<script>
import * as htmlToImage from "html-to-image";
// import "./main.css";

const ppi = 300;
const pixelRatio = ppi / 100;

const style = `
   h1{
      text-align: center;
      font-size: 24px;
      margin-top: 0;
      padding-top: 0;
      margin-bottom: 0;
      padding-bottom: 0;
   }
   *{
      font-size: 10px;
   }
   .level{
      padding: 0;
      margin: 0;
   }`;

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
let spellInfo = [];
export async function generate(selectedSpells) {
   spellInfo = selectedSpells.map(async spell => {
      let res = await fetch(`./spells/${spell[1]}.json`);
      let json = await res.json();

      const card = document.createElement("div");

      const title = document.createElement("h1");
      title.innerHTML = json.title;
      card.appendChild(title);

      const level = document.createElement("p");
      level.innerHTML = json.level === 0 ? "Cantrip" : `Level ${json.level}`;
      level.classList.add("level");
      level.style.color = colors[json.level];
      card.appendChild(level);

      [
         // `Book: ${json["book"]}`,
         `<b>Casting Time:</b> ${json["casting time"]}`,
         `<b>Range:</b> ${json["range"]}`,
         `<b>Components:</b> ${json["componenents"]}`,
         `<b>Duration:</b> ${json["duration"]}`,
      ].forEach(text => {
         const el = document.createElement("div");
         el.innerHTML = text;
         card.appendChild(el);
      });

      const desc = document.createElement("p");
      desc.innerHTML = json.description;
      card.appendChild(desc);

      const sty = document.createElement("style");
      sty.innerHTML = style;
      card.appendChild(sty);

      console.log("height: " + card.clientHeight);

      const img = await htmlToImage.toPng(card, {
         width: 300,
         height: 400,
         pixelRatio: pixelRatio,
         style: {
            backgroundColor: "white",
            fontFamily: "comic sans ms",
            boxSizing: "border-box",
            padding: "30px",
            width: "300px",
            height: "400px",
         },
      });

      return img;
   });

   spellInfo = await Promise.all(spellInfo);
   console.log(spellInfo);
   return spellInfo;
}
</script>

{#each spellInfo as spell}
   <img src={spell} alt="">
{/each}

<style>
   *{
      width: 50vw;
   }
</style>