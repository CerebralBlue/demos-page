const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();
const csvFilePath = path.join(__dirname, "../data/companies.csv");

async function importCSV() {
  const companies = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      companies.push({
        company_name: row.company_name,
        duns: row.duns,
        Industry_Description: row.Industry_Description,
        Adverse_Media_Flag: row.Adverse_Media_Flag,
        Sanctions_Flag: row.Sanctions_Flag,
        Business_Status: row.Business_Status,
      });
    })
    .on("end", async () => {
      console.log(`Parsed ${companies.length} companies`);

      for (const company of companies) {
        try {
          await prisma.company.create({ data: company });
        } catch (error) {
          console.error(`Error inserting company with DUNS ${company.duns}:`, error.message);
        }
      }

      console.log("Import completed!");
      await prisma.$disconnect();
    });
}

importCSV().catch((e) => {
  console.error("Import failed:", e);
  prisma.$disconnect();
});
