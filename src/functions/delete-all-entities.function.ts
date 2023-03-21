import { Prisma } from "@prisma/client";
import { DB } from "../db";

export async function deleteAllEntities() {
    const tables = Object.values(Prisma.ModelName);
    for (const table of tables) {
        await DB.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
        await DB.$executeRawUnsafe('TRUNCATE table `' + table + '`;');
        await DB.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    }
    console.log("delete all done");
}