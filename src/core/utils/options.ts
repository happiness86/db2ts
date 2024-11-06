import { defu } from 'defu'
import type { Db2TsOptions } from '../types'

const defaultOptions: Db2TsOptions = {
  driver: 'mysql',
  db: {},
  output: {
    fileType: 'ts',
    singleFile: false,
    // dir: 'db',
  },
}
export function mergeOptions(options = {}): Required<Db2TsOptions> {
  return defu(options, defaultOptions) as Required<Db2TsOptions>
}
