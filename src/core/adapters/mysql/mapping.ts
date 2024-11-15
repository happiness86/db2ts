import type mysql from 'mysql2'

export type MysqlTypes = mysql.Types

const numberReg = /^(?:double|int|float|decimal|long|short|tiny|bigint)/
const stringReg = /^(?:varchar|json|text|datetime|date|timestamp|string|varString)/

export function dataTypeMapToTs(type: string): string {
  if (numberReg.test(type)) {
    return 'number'
  }
  else if (stringReg.test(type)) {
    return 'string'
  }
  return ''
}
