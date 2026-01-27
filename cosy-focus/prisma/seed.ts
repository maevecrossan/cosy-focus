import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Seed data goes here
    await prisma.focusItem.deleteMany();

    await prisma.focusItem.createMany({
        data: [
            { title: "Plan my day", status: "available" },
            { title: "Reply to emails", status: "available" },
            { title: "30 mins React practice", status: "in_focus" },
            { title: "Walk + reset", status: "in_focus" },
            { title: "Tidy desk", status: "completed" },
            { title: "Write 3 job applications", status: "completed" },
            { title: "Read 10 pages", status: "available" },
            { title: "Stretch for 5 minutes", status: "completed" },
        ],
    });

    console.log("✅ Seeded focus items");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });