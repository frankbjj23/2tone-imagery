import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Static integration check for GitHub Pages: broken assets, anchors and UI wiring.
const root = fileURLToPath(new URL("../", import.meta.url));
const [html, css, js] = await Promise.all(
  ["index.html", "styles.css", "app.js"].map((file) =>
    readFile(path.join(root, file), "utf8"),
  ),
);
const errors = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);
for (const id of idSet) {
  if (ids.filter((item) => item === id).length > 1)
    errors.push(`Duplicate HTML id: ${id}`);
}

const localAssets = new Set();
let anchorCount = 0;
for (const [, reference] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (reference.startsWith("#")) {
    const target = decodeURIComponent(reference.slice(1));
    anchorCount += 1;
    if (target && !idSet.has(target))
      errors.push(`Broken anchor: ${reference}`);
  } else if (!/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) {
    localAssets.add(reference.split(/[?#]/)[0]);
  }
}
for (const [, reference] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
  if (!/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference))
    localAssets.add(reference);
}
for (const asset of localAssets) {
  if (asset.startsWith("/")) {
    errors.push(
      `Root-relative asset will break project Pages hosting: ${asset}`,
    );
    continue;
  }
  try {
    const info = await stat(path.resolve(root, asset));
    if (!info.isFile() || info.size === 0)
      errors.push(`Asset is empty or not a file: ${asset}`);
  } catch {
    errors.push(`Missing local asset: ${asset}`);
  }
}

let ariaReferenceCount = 0;
for (const [, references] of html.matchAll(
  /\baria-(?:controls|labelledby|describedby)="([^"]+)"/g,
)) {
  for (const id of references.split(/\s+/)) {
    ariaReferenceCount += 1;
    if (!idSet.has(id)) errors.push(`Broken ARIA reference: ${id}`);
  }
}

const jsIds = new Set(
  [...js.matchAll(/\$\(["']#([a-z\d_-]+)["']\)/gi)].map((match) => match[1]),
);
if (jsIds.size === 0) errors.push("No JavaScript element references were checked.");
for (const id of jsIds) {
  if (!idSet.has(id))
    errors.push(`JavaScript references missing element: #${id}`);
}

const serviceValues = new Set(
  [...html.matchAll(/<input\b[^>]*name="service"[^>]*value="([^"]+)"/g)].map(
    (match) => match[1],
  ),
);
for (const [, service] of html.matchAll(/\bdata-service="([^"]+)"/g)) {
  if (!serviceValues.has(service))
    errors.push(`Service CTA has no matching radio option: ${service}`);
}

const categories = new Set(
  [...html.matchAll(/\bdata-category="([^"]+)"/g)].map((match) => match[1]),
);
for (const [, filter] of html.matchAll(/\bdata-filter="([^"]+)"/g)) {
  if (filter !== "all" && !categories.has(filter))
    errors.push(`Filter matches no service category: ${filter}`);
}

for (const [, image] of html.matchAll(/(<img\b[^>]*>)/g)) {
  if (!/\balt=/.test(image))
    errors.push("An image is missing its alt attribute.");
}

if (errors.length) {
  console.error(errors.map((error) => `FAIL: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `PASS: ${localAssets.size} local assets, ${anchorCount} anchors, ${ariaReferenceCount} ARIA references, ${jsIds.size} JavaScript element references, service presets and image alternatives.`,
  );
}
