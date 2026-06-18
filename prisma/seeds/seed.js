import { prisma } from "../../apps/api/src/common/utils/prisma.js";
import { seedDatabase } from "../../apps/api/src/scripts/seed.js";

seedDatabase()
  .then((result) => {
    console.log("ChillPlace demo seed completed.");
    console.table(result.accounts);
    console.log(`Demo password: ${result.password}`);
    console.log(result.counts);
  })
  .catch((error) => {
    console.error("ChillPlace demo seed failed.", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
