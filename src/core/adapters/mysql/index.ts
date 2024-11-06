import { log } from 'node:console'
import mysql from 'mysql2/promise'
import { dataTypeMapToTs } from './mapping'
import type { Adapter, TableColumn, TableDataMap, TableMeta } from '../../types/adapter'

let pool: mysql.Pool

export class MysqlAdapter implements Adapter {
  tableData: TableDataMap = new Map()
  constructor(public options: mysql.PoolOptions) {
    if (!pool) {
      pool = mysql.createPool(options)
    }
  }

  async init(): Promise<TableDataMap> {
    const tables = await this.getTablesMeta()
    for await (const table of tables) {
      const columns = await this.getTableColumns(table.tableName)
      this.tableData.set(table.tableName, {
        tableName: table.tableName,
        tableComment: table.tableComment,
        columns,
      })
    }
    return this.tableData
  }

  async getTableColumns(tableName: string): Promise<TableColumn[]> {
    const connection = await pool.getConnection()
    try {
      const [columns] = await connection.query(`
      SELECT COLUMN_NAME as columnName, COLUMN_TYPE as columnType, IS_NULLABLE as isNullable, COLUMN_DEFAULT as columnDefault, COLUMN_COMMENT as columnComment
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
    `, [this.options.database, tableName])
      return (columns as any[]).map((column) => {
        return {
          columnName: column.columnName,
          columnType: dataTypeMapToTs(column.columnType),
          columnOriginType: column.columnType,
          columnDefault: column.columnDefault,
          columnComment: column.columnComment,
          isNullable: column.isNullable.toLowerCase() === 'yes',
        }
      })
    }
    finally {
      connection.release()
    }
  }

  async getTablesMeta(): Promise<TableMeta[]> {
    const connection = await pool.getConnection()
    try {
      const [tables] = await connection.query(`
      SELECT TABLE_NAME as tableName, TABLE_COMMENT as tableComment
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [this.options.database])
      return (tables as any[]).map((table) => {
        return {
          tableName: table.tableName,
          tableComment: table.tableComment,
        }
      })
    }
    finally {
      connection.release()
    }
  }
}
