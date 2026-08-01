import { loadReferentielFromCsv } from "../prisma/seed-exercises";

const cat = loadReferentielFromCsv();
const names = cat.map((c) =>
  c.name.trim().toLowerCase().replace(/\s+/g, " ")
);
const uniq = new Set(names);

if (cat.length !== 50) {
  console.error("Expected 50 exercises, got", cat.length);
  process.exit(1);
}
if (uniq.size !== 50) {
  console.error("Duplicate names detected", names.length - uniq.size);
  process.exit(1);
}

const publish = cat.filter((c) => c.publish).length;
console.log(
  JSON.stringify(
    { ok: true, count: 50, publish, brouillon: 50 - publish },
    null,
    2
  )
);
