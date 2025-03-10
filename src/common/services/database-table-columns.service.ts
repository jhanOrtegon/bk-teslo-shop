import { ObjectLiteral, Repository } from "typeorm";

export class DatabaseTableColumns {
  getColumnsExcludingById<T extends ObjectLiteral>(
    repository: Repository<T>
  ): (keyof T)[] {
    return repository.metadata.columns
      .map(column => column.propertyName as keyof T)
      .filter(col => col !== 'id');
  }

  getColumnsExcludingBy<T extends ObjectLiteral, K extends keyof T>(
    repository: Repository<T>,
    excludeColumns: K[] // Se tipa para que solo acepte columnas válidas de T
  ): Exclude<keyof T, K>[] {
    return repository.metadata.columns
      .map(column => column.propertyName as keyof T)
      .filter(col => !excludeColumns.includes(col as K)) as Exclude<keyof T, K>[];
  }
}
