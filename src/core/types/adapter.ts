export interface Adapter {
  init: () => Promise<TableDataMap>
  getTablesMeta: () => Promise<TableMeta[]>
  getTableColumns: (tableName: string) => Promise<TableColumn[]>
}

export interface TableMeta {
  tableName: string
  tableComment: string
}

export type TableData = TableMeta & {
  columns: TableColumn[]
}

export type TableDataMap = Map<string, TableData>

export interface TableColumn {
  columnName: string
  columnType: string // string number
  columnOriginType: string // 原始类型
  isNullable: boolean
  columnDefault: string | number | null
  columnComment: string
}
