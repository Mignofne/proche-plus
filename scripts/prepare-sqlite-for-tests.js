/**
 * Temporary local SQLite alignment for Playwright.
 * Backs up prisma/schema.prisma, switches provider to sqlite, generates client,
 * pushes schema and seeds. Use restore-postgres-schema.js afterwards.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const schemaPath = path.join(root, "prisma", "schema.prisma");
const backupPath = path.join(root, "prisma", "schema.postgresql.bak.prisma");

const schema = fs.readFileSync(schemaPath, "utf8");
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, schema, "utf8");
}

let next = schema.replace(
  /datasource db \{\s*provider = "postgresql"\s*url = env\("DATABASE_URL"\)\s*\}/,
  `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}`
);

if (next === schema) {
  // Already sqlite or different formatting
  next = schema
    .replace('provider = "postgresql"', 'provider = "sqlite"')
    .replace(
      /binaryTargets = \["native", "rhel-openssl-3\.0\.x"\]/,
      'binaryTargets = ["native"]'
    );
} else {
  next = next.replace(
    /binaryTargets = \["native", "rhel-openssl-3\.0\.x"\]/,
    'binaryTargets = ["native"]'
  );
}

fs.writeFileSync(schemaPath, next, "utf8");

function run(cmd) {
  console.log(">", cmd);
  execSync(cmd, { cwd: root, stdio: "inherit" });
}

run("npx prisma generate");
run("npx prisma db push --accept-data-loss");
run("npx tsx prisma/seed.ts");
console.log("SQLite ready for local tests");
