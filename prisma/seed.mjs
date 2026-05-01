import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: "demo@docuflow.app" },
    update: {},
    create: {
      id: "user_demo_1",
      name: "Demo User",
      email: "demo@docuflow.app",
      subscription: { create: { plan: "free", status: "active" } },
    },
  });

  const pro = await prisma.user.upsert({
    where: { email: "pro@docuflow.app" },
    update: {},
    create: {
      id: "user_demo_2",
      name: "Pro Tester",
      email: "pro@docuflow.app",
      subscription: { create: { plan: "pro", status: "active" } },
    },
  });

  const file = await prisma.file.upsert({
    where: { id: "file_demo_1" },
    update: {},
    create: {
      id: "file_demo_1",
      userId: demo.id,
      originalName: "invoice-march.pdf",
      storedName: "demo/invoice-march.pdf",
      mimeType: "application/pdf",
      size: 184320,
      url: "/uploads/demo/invoice-march.pdf",
      status: "ready",
    },
  });

  await prisma.processedFile.upsert({
    where: { id: "pf_demo_1" },
    update: {},
    create: {
      id: "pf_demo_1",
      userId: demo.id,
      fileId: file.id,
      toolType: "compress",
      outputUrl: "/uploads/demo/invoice-march.compressed.pdf",
      outputSize: 92160,
    },
  });

  await prisma.toolUsage.create({
    data: { userId: pro.id, toolType: "summarize", fileId: file.id },
  });

  console.log("Seeded demo users:", demo.email, pro.email);
}

main().finally(() => prisma.$disconnect());
