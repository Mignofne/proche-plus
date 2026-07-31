/**
 * Restores prisma/schema.prisma from the postgresql backup and regenerates client.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const schemaPath = path.join(root, "prisma", "schema.prisma");
const backupPath = path.join(root, "prisma", "schema.postgresql.bak.prisma");

if (!fs.existsSync(backupPath)) {
  console.error("No backup at prisma/schema.postgresql.bak.prisma");
  process.exit(1);
}

fs.writeFileSync(schemaPath, fs.readFileSync(backupPath, "utf8"), "utf8");
execSync("npx prisma generate", { cwd: root, stdio: "inherit" });
console.log("PostgreSQL schema restored");
