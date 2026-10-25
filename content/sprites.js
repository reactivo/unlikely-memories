// Hand-made sprites by name: pixel art as rows of letters, one letter per pixel ("." = empty), each letter a colour
// in COLORS (only the 16 EGA colours, ART-DIRECTION.md §3). There are none now: every world's things carry their
// own sprites (`sprite` and `floorSprite` on the object, rows of hex palette numbers: worlds/<id>/sprites.js), drawn
// by ui/sprite.js (16×16 item sprites) and ui/draw.js (small floor sprites on room pictures).
export const COLORS = {};
export const SPRITES = {};
