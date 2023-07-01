import * as htmlToImage from "html-to-image";
// import "./main.css";
const style = `h1{
      color:red;
      text-align: center;
   }
   p{
      font-size: 8px;
   }`;

export async function generate(selectedSpells) {
   let spellInfo = selectedSpells.map(async spell => {
      let res = await fetch(`./spells/${spell[1]}.json`);
      let json = await res.json();

      const card = document.createElement("div");

      const title = document.createElement("h1");
      title.innerHTML = json.title;
      card.appendChild(title);

      const props = document.createElement("p");
      props.innerHTML = json.level === 0 ? "Cantrip" : `Level ${json.level}`;
      card.appendChild(props);

      const desc = document.createElement("p");
      desc.innerHTML = json.description;
      card.appendChild(desc);

      const sty = document.createElement("style");
      sty.innerHTML = style;
      card.appendChild(sty);

      const img = await htmlToImage.toSvg(card, {
         width: "300px",
         height: "500px",
         style: {
            backgroundColor: "white",
            fontFamily: "comic sans ms",
            boxSizing: "border-box",
            padding: "10px",
            height: "500px",
         },
      });

      return img;
   });

   spellInfo = await Promise.all(spellInfo);
   console.log(spellInfo);
   return spellInfo;
}
