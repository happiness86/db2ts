import process from 'node:process'
import { MysqlAdapter } from './adapters/mysql'
import { generateTsFile } from './utils/file'
import { mergeOptions } from './utils/options'
import type { Db2TsOptions } from './types'

export default function db2ts(options: Db2TsOptions): void {
  const { driver, db, output } = mergeOptions(options)
  let ins = null
  if (driver === 'mysql') {
    ins = new MysqlAdapter(db)
  }
  ins?.init().then(async (tablesData) => {
    if (!tablesData)
      return
    await generateTsFile(tablesData, output)
    process.exit()
  })
}
