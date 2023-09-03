import { writable } from "svelte/store";

export const selectedSpells = writable([]);
export const settings = writable({
   "width": 3,
   "height": 4,
   "fonts": ["comic sans ms", "georgia", "arial"],
   "font-index": 0,
   "body-size": 10,
   "level-size": 16,
   "h-size": 24,
});

