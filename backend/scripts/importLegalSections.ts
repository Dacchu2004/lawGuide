// scripts/importLegalSections.ts
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface RawSection {
  id: string;
  act: string;
  section: string;
  text: string;
  jurisdiction?: string;
  state?: string;
  source_link?: string;
  domain?: string;
}

async function main() {
  const filePath = path.join(__dirname, "..", "data", "legal_sections.json");
  console.log("📥 Reading:", filePath);

  if (!fs.existsSync(filePath)) {
    console.error("❌ legal_sections.json not found. Make sure it is in backend/data.");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const docs: RawSection[] = JSON.parse(raw);

  console.log(`🚀 Importing ${docs.length} sections into PostgreSQL...`);

  const BATCH_SIZE = 100;
  let count = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    
    // Create an array of upsert operations (promises)
    const upserts = batch.map((doc) =>
      prisma.legalSection.upsert({
        where: { id: doc.id },
        update: {
          act: doc.act,
          section: doc.section,
          text: doc.text,
          jurisdiction: doc.jurisdiction ?? "central",
          state: doc.state ?? "India",
          sourceLink: doc.source_link ?? null,
          domain: doc.domain ?? null,
        },
        create: {
          id: doc.id,
          act: doc.act,
          section: doc.section,
          text: doc.text,
          jurisdiction: doc.jurisdiction ?? "central",
          state: doc.state ?? "India",
          sourceLink: doc.source_link ?? null,
          domain: doc.domain ?? null,
        },
      })
    );

    // Execute the batch in a transaction
    await prisma.$transaction(upserts);

    count += batch.length;
    console.log(`... ${count} sections imported`);
  }

  console.log(`✅ Done. Imported/updated ${count} sections.`);
}

main()
  .catch((err) => {
    console.error("❌ Import failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
