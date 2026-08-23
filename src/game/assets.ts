import { NAMES, WEAPONS } from "./story";
import { SKILLS, SHEET_ART, TREE_ART } from "./skills";

export const ART_URLS: string[] = [
  ...NAMES.map((n) => n.portrait),
  ...WEAPONS.map((w) => w.icon),
  ...SKILLS.map((s) => s.art),
  SHEET_ART,
  TREE_ART,
  "/lore/title-wide.jpg",
  "/lore/palace-approach.jpg",
  "/lore/aelith-monolith.png",
  "/lore/aelith-origin.png",
  "/lore/hunter-face.jpg",
  "/lore/hunter-body.jpg",
  "/ui/pulse-frame.png",
  "/ui/weapon-bag.png",
  "/ui/world-map.jpg",
  "/ui/ember-fortitude.jpg",
  "/arms/arsenal-sheet.jpg",
  "/arms/sovereign-axe.jpg",
  "/arms/sovereign-sword.jpg",
  "/arms/war-scythe.jpg",
  "/arms/rune-lance.jpg",
  "/arms/ember-hammer.jpg",
  "/lore/char-warden.jpg",
  "/lore/char-reaver.jpg",
  "/lore/char-gunner.jpg",
  "/lore/char-weaver.jpg",
  "/lore/construct-titan.jpg",
  "/lore/hunter-hood.jpg",
  "/lore/vaelith-field.jpg",
  "/lore/rynara-basin.jpg",
  "/lore/sanguara-pool.jpg",
  "/lore/nyxara-isles.jpg",
  "/lore/throne-hall.jpg",
  "/lore/palace-stairs.jpg",
  "/lore/sentinel.jpg",
  "/lore/shade.jpg",
  "/lore/construct.jpg",
  "/lore/aelith-ankh-queen.jpg",
  "/lore/aelith-boss.jpg",
  "/lore/knight.jpg",
  "/lore/ankh-gunner.jpg",
  "/textures/floor.jpg",
  "/textures/wall.jpg",
  "/textures/column.jpg",
  "/textures/energy.jpg",
  "/textures/water.jpg",
  "/textures/sky.jpg",
];

export function preloadArt(onProgress?: (p: number) => void): Promise<void> {
  const list = [...new Set(ART_URLS)];
  if (list.length === 0) return Promise.resolve();
  let done = 0;
  return Promise.all(
    list.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.decoding = "async";
          const finish = () => {
            done += 1;
            onProgress?.(done / list.length);
            resolve();
          };
          img.onload = finish;
          img.onerror = finish;
          img.src = url;
        }),
    ),
  ).then(() => undefined);
}
