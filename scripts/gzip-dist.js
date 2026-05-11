const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const inputPath = path.resolve(__dirname, "..", "dist", "crypo-mining-fleet-card.js");
const outputPath = `${inputPath}.gz`;

if (!fs.existsSync(inputPath)) {
  throw new Error(`Build output not found: ${inputPath}`);
}

const source = fs.readFileSync(inputPath);
const compressed = zlib.gzipSync(source, { level: 9, mtime: 0 });

// Force deterministic gzip header across operating systems.
// Byte layout: ID1 ID2 CM FLG MTIME(4) XFL OS
compressed[4] = 0;
compressed[5] = 0;
compressed[6] = 0;
compressed[7] = 0;
compressed[9] = 255;

fs.writeFileSync(outputPath, compressed);

console.log(`Created ${path.basename(outputPath)} (${compressed.length} bytes)`);
