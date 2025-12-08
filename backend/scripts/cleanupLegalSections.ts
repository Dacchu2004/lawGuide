// backend/scripts/cleanupLegalSections.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function cleanText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*\d+\s*\n/g, "\n")     // ✅ remove isolated page numbers like 90
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function main() {
  console.log("🧹 Starting LegalSection cleanup...");

  const batchSize = 500;
  let skip = 0;
  let totalChecked = 0;
  let totalUpdated = 0;
  let totalDeleted = 0;

  while (true) {
    const rows = await prisma.legalSection.findMany({
      skip,
      take: batchSize,
      orderBy: { id: "asc" },
    });

    if (rows.length === 0) break;

    for (const row of rows) {
      totalChecked++;

      const text = (row.text || "").trim();
      const upper = text.toUpperCase();

      // ❌ Garbage detection
      const isVeryShort = text.length < 40;
      const looksLikeForm =
        upper.startsWith("FORM ") ||
        upper.includes("FORM NO.") ||
        upper.includes("FORM NUMBER");
      const looksLikeSchedule =
        upper.includes("SCHEDULE") ||
        upper.startsWith("THE FIRST SCHEDULE") ||
        upper.startsWith("THE SECOND SCHEDULE");
      const looksLikeAnnexure = upper.includes("ANNEXURE");

      const isGarbage =
        isVeryShort || looksLikeForm || looksLikeSchedule || looksLikeAnnexure;

      if (isGarbage) {
        await prisma.legalSection.delete({ where: { id: row.id } });
        totalDeleted++;
        continue;
      }

      // ✅ CLEAN & NORMALIZE
      const normalized = cleanText(text);

      if (normalized !== text) {
        await prisma.legalSection.update({
          where: { id: row.id },
          data: { text: normalized },
        });
        totalUpdated++;
      }
    }

    skip += batchSize;
    console.log(`...processed ${skip} rows`);
  }

  console.log("✅ Cleanup done:", {
    totalChecked,
    totalUpdated,
    totalDeleted,
  });
}

main()
  .catch((e) => {
    console.error("❌ Cleanup failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
