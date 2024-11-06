import process from 'node:process'
import { cac } from 'cac'
import { version } from '../package.json'
import db2ts from './core/index'

const cli = cac('db2ts')

// [] 选填 <>必填  '' boolean flag
cli.option('--single-file [singleFile]', 'whether compose results to single file', { default: false })
  .option('--file-type [fileType]', 'dts or ts', { default: 'ts' })
  .option('--dir [dir]', 'specify position of result', { default: `${process.cwd()}/db` })

cli.command('build', 'convert database tables to TypeScript')
  .option('--host <host>', 'database host')
  .option('--port <port>', 'database port')
  .option('--user <user>', 'login user')
  .option('--password <password>', 'login password')
  .option('--database <database>', 'name of database')
  .action((options) => {
    const { host, port, user, password, database, singleFile, fileType, dir } = options
    const db2tsOptions = {
      db: {
        host,
        port,
        user,
        password,
        database,
      },
      output: {
        fileType,
        singleFile,
        dir,
      },
    }
    db2ts(db2tsOptions)
  })

cli.help()
cli.version(version)
cli.parse()
