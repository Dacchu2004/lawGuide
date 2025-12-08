// scripts/backfillDomains.ts
import { PrismaClient } from "@prisma/client";
import { classifyDomain } from "./domainClassifier";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Backfilling `domain` for legalSection rows...");

  const sections = await prisma.legalSection.findMany({
    where: {
      OR: [{ domain: null }, { domain: "" }],
    },
  });

  console.log(`Found ${sections.length} rows without domain`);

  let updated = 0;

  for (const sec of sections) {
    const domain = classifyDomain(sec.text || "", sec.act || "");
    await prisma.legalSection.update({
      where: { id: sec.id },
      data: { domain },
    });
    updated++;
    if (updated % 200 === 0) {
      console.log(`... updated ${updated} sections`);
    }
  }

  console.log(`✅ Done. Updated ${updated} sections with domain classification.`);
}

main()
  .catch((err) => {
    console.error("❌ Backfill failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
