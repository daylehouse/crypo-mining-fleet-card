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
fs.writeFileSync(outputPath, compressed);

console.log(`Created ${path.basename(outputPath)} (${compressed.length} bytes)`);
