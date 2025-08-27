import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("secret123", 10);

  await prisma.user.createMany({
  data: [
    {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
    {
      email: "subadmin@example.com",
      password: await bcrypt.hash("sub123", 10),
      role: "SUBADMIN",
    },
    {
      email: "user@example.com",
      password: await bcrypt.hash("user123", 10),
      role: "USER",
    },
  ],
  skipDuplicates: true,
});

}

main()
  .then(() => {
    console.log("Users seeded ✅");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
