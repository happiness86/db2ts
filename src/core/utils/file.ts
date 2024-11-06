import { log } from 'node:console'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { TsTemplate, TsTemplateBundle } from './template'
import type { OutputOptions } from '../types'
import type { TableDataMap } from '../types/adapter'

export async function generateTsFile(tablesData: TableDataMap, output: OutputOptions): Promise<undefined> {
  const bundle = new TsTemplateBundle()
  for await (const [tableName, tableData] of tablesData) {
    const t = new TsTemplate(tableData)
    if (output.singleFile) {
      bundle.collect(tableName, t.source)
    }
    else {
      const template = output.fileType === 'dts' ? t.dtsTemplate : t.template

      await writeTsFile(tableName, output, template)
    }
  }
  if (output.singleFile) {
    await writeTsFile('db2ts', output, bundle.dtsTemplate)
  }
}

async function writeTsFile(tableName: string, output: OutputOptions, data: string): Promise<undefined> {
  const { fileType, dir } = output
  const root = process.cwd()
  const finalDir = dir ? path.normalize(dir) : `${root}/db`
  await makeSureDirExist(finalDir)
  const fileExt = fileType === 'dts' ? 'd.ts' : 'ts'
  await fs.writeFile(`${finalDir}/${camelCase(tableName)}.${fileExt}`, data)
  log(`${finalDir}/${camelCase(tableName)}.${fileExt} 生成成功`)
}

async function makeSureDirExist(dirName: string): Promise<undefined> {
  try {
    // 尝试打开目录
    await fs.opendir(dirName)
  }
  catch (error: any) {
    // 如果目录不存在，则创建目录
    if (error.code === 'ENOENT') {
      log(`Directory ${dirName} does not exist. Creating it...`)
      await fs.mkdir(dirName, { recursive: true })
    }
    else {
      // 其他错误，重新抛出
      log(`Error opening directory ${dirName}:`, error)
      throw error
    }
  }
}

export function camelCase(field: string): string {
  return field.replace(/_(\w)/g, (str) => {
    return str[str.length - 1].toUpperCase()
  })
}
