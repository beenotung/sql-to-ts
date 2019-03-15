import * as fs from 'fs';
import * as util from 'util';
import { parseSQLString } from './parser';

export async function readSQLFile(filename: string) {
  const bin = await util.promisify(fs.readFile)(filename);
  const text = bin.toString();
  parseSQLString(text);
}
