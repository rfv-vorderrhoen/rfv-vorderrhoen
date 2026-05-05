import { constants } from "node:fs";
import { access, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, "dist", "sitemap-index.xml");
const destination = resolve(projectRoot, "dist", "sitemap.xml");

try {
  await access(source, constants.R_OK);
} catch {
  console.error("Expected Astro sitemap output at dist/sitemap-index.xml.");
  process.exit(1);
}

await copyFile(source, destination);
console.log("Created dist/sitemap.xml");
