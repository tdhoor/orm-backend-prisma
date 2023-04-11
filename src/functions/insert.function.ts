import { bulkInsertMssql } from "@core/functions/bulk-insert-mssql.function";
import sql from "mssql";

export function insert(table, values: any[]) {
    return bulkInsertMssql(sql, table, values);
}