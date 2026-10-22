import sharp from "sharp";
import { readdir, stat, writeFile, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";

// Run after importing new imagery. Original files remain available; application
// references switch only when the WebP is smaller. SVG logos stay vector.
const directory = "public/images";
const replacements = [];
for (const file of await readdir(directory)) {
  const extension = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".svg"].includes(extension)) continue;
  const source = join(directory, file);
  const original = (await stat(source)).size;
  if (extension === ".svg" && original < 80000) continue;
  const name = basename(file, extension) + ".webp";
  try {
    // This trusted, checked-in illustration embeds a large raster in its SVG.
    const result = await sharp(source, {
      limitInputPixels: 80000000,
      unlimited: file === "blog-omni.svg",
    })
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(join(directory, name));
    if (result.size < original)
      replacements.push({
        from: file,
        to: name,
        original,
        optimized: result.size,
      });
  } catch (error) {
    console.log(`Kept ${file}: ${error.message}`);
  }
}
async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await rewrite(path);
    else if (/\.(tsx?|json)$/.test(entry.name)) {
      let text = await readFile(path, "utf8");
      for (const { from, to } of replacements) text = text.replaceAll(from, to);
      await writeFile(path, text);
    }
  }
}
await rewrite("src");
console.log(
  JSON.stringify({
    images: replacements.length,
    originalBytes: replacements.reduce((n, r) => n + r.original, 0),
    optimizedBytes: replacements.reduce((n, r) => n + r.optimized, 0),
  }),
);
