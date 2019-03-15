import { readSQLFile } from './reader';
import del from 'del';
import { writeTsFiles } from './ts-generator';

export interface Options {
  filenames: string[]
  tsDir: string
  clean?: boolean
  quiet?: boolean
}

export async function main(options: Options) {
  await Promise.all(options.filenames.map(filename => {
    if (!options.quiet) {
      console.log('reading', filename);
    }
    return readSQLFile(filename);
  }));

  if (options.clean) {
    if (!options.quiet) {
      console.log('cleaning', options.tsDir);
    }
    await del(options.tsDir);
  }

  if (!options.quiet) {
    console.log('saving ts files to', options.tsDir);
  }
  await writeTsFiles(options);
  if (!options.quiet) {
    console.log('saved all ts files');
  }
}
