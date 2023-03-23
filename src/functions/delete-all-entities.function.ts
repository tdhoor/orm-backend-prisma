import { Prisma } from "@prisma/client";
import { DB } from "../db";

export async function deleteAllEntities() {
    const tables = Object.values(Prisma.ModelName);
    for (const tableName of tables) {
        console.log("delete: " + tableName);
        await DB.$executeRawUnsafe(`DELETE from [${tableName}];`)
        await DB.$executeRawUnsafe(`DBCC CHECKIDENT ([${tableName}], RESEED, 1);`);
    }
    console.log("delete all done");
}