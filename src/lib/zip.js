import JSZip from "jszip";
import { saveAs } from "file-saver";

// takes a list of images and returns some kind of zip
export async function downloadImages(images) {
   const zip = new JSZip();

   const promises = images.map(async (image, i) => {
      const res = await fetch(image);
      const blob = await res.blob();

      console.log(blob);

      zip.file(`${i + 1}.png`, blob);
   });

   await Promise.all(promises);

   const file = await zip.generateAsync({ type: "blob" });
   saveAs(file, "cards.zip");
}
