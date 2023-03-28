import { Prisma } from "@prisma/client";
import { DB } from "../db";

let notFirstCall = false;

export async function deleteAllEntities() {
    const tables = Object.values(Prisma.ModelName);
    for (const tableName of tables) {
        if (notFirstCall) {
            await DB.$executeRawUnsafe(`DELETE from [${tableName}];`)
            await DB.$executeRawUnsafe(`DBCC CHECKIDENT ([${tableName}], RESEED, 0);`);
        }
    }
    notFirstCall = true;
}