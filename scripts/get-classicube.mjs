// @ts-check

import fs from "node:fs/promises";
import path from "node:path";

const JS_URL = "https://cs.classicube.net/client/latest/ClassiCube.js";
const OUT_DIR = path.join(import.meta.dirname, "..", "public", "classicube");

await fs.rm(OUT_DIR, { recursive: true, force: true });

/**
 * @param {string} url
 */
async function get(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  return res;
}

async function getClassiCube() {
  console.log("Downloading ClassiCube...");
  const js = await get(JS_URL).then((res) => res.text());
  const content = js.replaceAll("/static/", "/classicube/");
  const outPath = path.join(OUT_DIR, "classicube.js");
  await fs.writeFile(outPath, content);
  console.log(`Downloaded ClassiCube to ${outPath}`);
}

async function getTexture() {
  console.log("Downloading texture pack...");
  const zip = await get("https://classicube.net/static/default.zip").then(
    (res) => res.arrayBuffer(),
  );
  const outPath = path.join(OUT_DIR, "default.zip");
  // @ts-expect-error - this is fine
  await fs.writeFile(outPath, Buffer.from(zip));
  console.log(`Downloaded texture packs to ${outPath}`);
}

await fs.mkdir(OUT_DIR, { recursive: true });
await Promise.all([getClassiCube(), getTexture()]);
