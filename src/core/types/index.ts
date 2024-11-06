import type { PoolOptions } from 'mysql2'

export type DbDrivers = 'mysql'

export type DbConnectOptions = PoolOptions

export interface OutputOptions {
  /**
   * @description 生成ts文件或者dts文件
   */
  fileType?: 'ts' | 'dts'
  /**
   * @description 是否将所有的数据生成在一个文件内
   * @default false
   */
  singleFile?: boolean
  /**
   * @description 生成的文件的存储路径，绝对路径
   */
  dir?: string
}

export interface Db2TsOptions {
  driver?: DbDrivers
  db: DbConnectOptions
  output?: OutputOptions
}
