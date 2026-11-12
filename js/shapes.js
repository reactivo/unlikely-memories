// Shapes: the small tests of what a piece of data is, in one place with no imports, so any module can use them (fields.js imports
// conditions.js and movers.js, which used to keep their own copies). Pure.

// A plain object: not null, not a list.
export const isObject = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
// A line a thing or a rule says: a text, or a list of texts (varied, never the same twice in a row).
export const isLine = (x) => (typeof x === "string" && x.trim() !== "") || (Array.isArray(x) && x.length > 0 && x.every(y => typeof y === "string" && y.trim() !== ""));
// A gap [min, max] in whole numbers, min no more than max, min at least 1.
export const gap = (x) => Array.isArray(x) && x.length === 2 && x.every(Number.isInteger) && x[0] >= 1 && x[0] <= x[1];
// Drop empty fields (null, undefined) from an applied effect or a story block.
export const clean = (x) => Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined && v !== null));
