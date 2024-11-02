// @ts-check

import fs from "node:fs/promises";
import path from "node:path";

const JS_URL = "https://cs.classicube.net/client/latest/ClassiCube.js";

const GITHUB_REPO = "Podter/classicube-assets";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;
const TEXTURE_URL = GITHUB_API + "default.zip";
const SOUNDS_URL = GITHUB_API + "sounds";

const OUT_DIR = path.join(import.meta.dirname, "..", "public", "classicube");

await fs.rm(OUT_DIR, { recursive: true, force: true });

/**
 * @param {string} url
 * @param {boolean} github
 */
async function get(url, github = false) {
  const res = await fetch(url, {
    headers: github
      ? {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.raw",
        }
      : {},
  });
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
  if (!process.env.GITHUB_TOKEN) return;
  console.log("Downloading texture pack...");
  const zip = await get(TEXTURE_URL, true).then((res) => res.arrayBuffer());
  const outPath = path.join(OUT_DIR, "default.zip");
  // @ts-expect-error - this is fine
  await fs.writeFile(outPath, Buffer.from(zip));
  console.log(`Downloaded texture packs to ${outPath}`);
}

/**
 * @typedef {Object} Sound
 * @property {string} name
 * @property {string} download_url
 */

async function getSounds() {
  if (!process.env.GITHUB_TOKEN) return;
  console.log("Downloading sounds...");
  /** @type {Sound[]} */
  const sounds = await get(SOUNDS_URL, true).then(
    (res) => /** @type {Promise<Sound[]>} */ (res.json()),
  );
  const outPath = path.join(OUT_DIR, "sounds");
  await fs.mkdir(outPath, { recursive: true });
  await Promise.all(
    sounds.map(async (sound) => {
      console.log(`Downloading ${sound.name}...`);
      const data = await get(sound.download_url).then((res) =>
        res.arrayBuffer(),
      );
      const filePath = path.join(outPath, sound.name);
      // @ts-expect-error - this is fine
      await fs.writeFile(filePath, Buffer.from(data));
      console.log(`Downloaded ${sound.name} to ${filePath}`);
    }),
  );
  console.log(`Downloaded sounds to ${outPath}`);
}

await fs.mkdir(OUT_DIR, { recursive: true });
await Promise.all([getClassiCube(), getTexture(), getSounds()]);
