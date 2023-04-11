import { bukdInsertMssql } from "@core/functions/bulk-insert-mssql.function";

export function insert(table, values: any[]) {
    return bukdInsertMssql(table, values);
}