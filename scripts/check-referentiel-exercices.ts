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

const byStatus = {
  publie: cat.filter((c) => c.status === "publie").length,
  a_valider: cat.filter((c) => c.status === "a_valider").length,
  brouillon: cat.filter((c) => c.status === "brouillon").length,
};
if (byStatus.a_valider !== 12) {
  console.error("Expected 12 a_valider, got", byStatus.a_valider);
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, count: 50, ...byStatus }, null, 2));
