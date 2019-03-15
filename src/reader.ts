import * as fs from 'fs';
import * as util from 'util';
import {parseSQLString} from "./parser";

export async function readSQLFile(filename: string) {
  let bin = await util.promisify(fs.readFile)(filename);
  let text = bin.toString();
  parseSQLString(text);
}
