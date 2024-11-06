import MagicString, { Bundle } from 'magic-string'
import { camelCase } from './file'
import type { TableColumn, TableData } from '../types/adapter'

export class TsTemplate {
  s: MagicString
  constructor(public data: TableData) {
    this.s = new MagicString('')
    this.genTemplate()
  }

  get template(): string {
    return this.s.toString()
  }

  get dtsTemplate(): string {
    const temp = this.s.toString().replace(/export/g, 'declare')
    return temp
  }

  get source(): MagicString {
    return this.s
  }

  genTemplate(): void {
    const { tableName, tableComment, columns } = this.data
    if (tableComment) {
      this.s.append(`// ${tableComment}`).append('\n')
    }
    this.s.append('export interface ').append(`${camelCase(tableName)}Model`).append(' {').append('\n')
    columns.forEach((column) => {
      this.genProp(column)
    })
    this.s.append('}').append('\n')
  }

  genAnnotation(column: TableColumn): void {
    // 1. description 2. required 3. default
    const content = []
    if (column.columnComment) {
      content.push(`@description ${column.columnComment}`)
    }
    if (column.columnDefault) {
      content.push(`@default ${column.columnDefault}`)
    }
    this.s.append('/**').append('\n')
    content.forEach((c) => {
      this.s.append(' * ').append(c).append('\n')
    })
    this.s.append(' */').append('\n')
  }

  genProp(column: TableColumn): void {
    this.genAnnotation(column)
    this.s.append(camelCase(column.columnName))
    if (column.isNullable) {
      this.s.append('?')
    }
    this.s.append(': ').append(column.columnType).append('\n')
  }
}

export class TsTemplateBundle {
  b: Bundle
  constructor() {
    this.b = new Bundle()
  }

  get template(): string {
    return this.b.toString()
  }

  get dtsTemplate(): string {
    const temp = this.b.toString().replace(/export/g, 'declare')
    return temp
  }

  collect(tableName: string, content: MagicString): void {
    this.b.addSource({
      filename: tableName,
      content,
    })
  }
}
