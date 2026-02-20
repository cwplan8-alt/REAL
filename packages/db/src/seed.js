const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "data", "seed-summary.json");
const summary = {
  generatedAt: new Date().toISOString(),
  notes: "Seed data is embedded in @repo/shared and loaded in-memory by @repo/db for fast MVP iteration.",
};

fs.mkdirSync(path.dirname(seedPath), { recursive: true });
fs.writeFileSync(seedPath, JSON.stringify(summary, null, 2));
console.log("Seed completed:", seedPath);
