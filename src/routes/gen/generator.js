import * as htmlToImage from "html-to-image";
// import "./main.css";

export async function generate(selectedSpells) {
   let spellInfo = selectedSpells.map(async spell => {
      // let res = await fetch(`./spells/${spell[1]}.json`);
      // let json = await res.json();

      const card = document.createElement("div");
      card.classList.add("card");

      const title = document.createElement("h1");
      title.innerHTML = "hello";
      card.appendChild(title);

      const desc = document.createElement("p");
      desc.innerHTML = "the quick brown fox jumps over the lazy dog";
      card.appendChild(desc);

      let img = await htmlToImage.toSvg(card, {
         width: "300px",
         height: "500px",
      });
      // return image;
   });

   spellInfo = await Promise.all(spellInfo);
   console.log(spellInfo);
   return spellInfo;
}
