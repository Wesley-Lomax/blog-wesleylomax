// Generate lightweight WebP card thumbnails from the full-resolution
// featured images referenced in post frontmatter.
//
//   node scripts/gen-thumbs.mjs
//
// Output: public/img/thumbs/<basename>.webp  (max 1000px wide, WebP q72)
// Referenced by src/components/PostCard.astro.
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_DIR = path.join(PUBLIC_DIR, 'img', 'thumbs');

const MAX_WIDTH = 1000; // covers the featured card at ~2x; regular cards well over
const QUALITY = 72;

const files = (await readdir(POSTS_DIR)).filter((f) => /\.mdx?$/.test(f));

// Collect unique featuredimage paths.
const images = new Set();
for (const file of files) {
  const src = await readFile(path.join(POSTS_DIR, file), 'utf8');
  const match = src.match(/^featuredimage:\s*["']?([^"'\n]+)["']?\s*$/m);
  if (match) images.add(match[1].trim());
}

await mkdir(OUT_DIR, { recursive: true });

let done = 0;
let skipped = 0;
for (const rel of images) {
  const srcPath = path.join(PUBLIC_DIR, rel.replace(/^\//, ''));
  if (!existsSync(srcPath)) {
    console.warn(`skip (missing source): ${rel}`);
    skipped++;
    continue;
  }
  const base = path.basename(rel).replace(/\.(png|jpe?g|webp|gif)$/i, '');
  const outPath = path.join(OUT_DIR, `${base}.webp`);
  await sharp(srcPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  done++;
}

console.log(`thumbnails: ${done} written, ${skipped} skipped -> public/img/thumbs/`);
