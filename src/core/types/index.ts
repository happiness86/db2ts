import type { PoolOptions } from 'mysql2'

export type DbDrivers = 'mysql'

export type DbConnectOptions = PoolOptions

export interface OutputOptions {
  fileType?: 'ts' | 'dts'
  singleFile?: boolean // 是否在一个文件内
  dir?: string
}

export interface Db2TsOptions {
  driver?: DbDrivers
  db: DbConnectOptions
  output?: OutputOptions
}
