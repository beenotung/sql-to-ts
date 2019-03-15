import {readSQLFile} from "../src/reader";
import {writeTsFiles} from "../src/ts-generator";
import del from "del";

async function test() {
  let tsDir = 'res/ts';

  for (let filename of [
    'res/information_schema.sql',
    'res/extra.sql',
  ]) {
    console.log('reading', filename);
    await readSQLFile(filename);
  }

  console.log('cleaning ts folder');
  await del(tsDir);

  console.log('saving to', tsDir);
  await writeTsFiles(tsDir);
  console.log('saved all ts files');
}

test();
