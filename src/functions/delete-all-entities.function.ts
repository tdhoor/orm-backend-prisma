import { Prisma } from "@prisma/client";
import { DB } from "../db";

export async function deleteAllEntities() {
    const tables = Prisma.ModelName;
    const tableNames = Object.keys(tables).join(`","`);
    const query = `TRUNCATE "${tableNames}" RESTART IDENTITY CASCADE;`
    console.log("delete all " + query);
    await DB.$executeRawUnsafe(query)
    console.log("delete all done");
}