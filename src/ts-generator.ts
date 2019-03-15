import {mappedTypes, Table, tableEnums, tables} from "./state";
import * as mkdirp from 'mkdirp';
import * as util from "util";
import * as path from "path";
import * as fs from "fs";

let async = {
  mkdirp: util.promisify(mkdirp),
  writeFile: util.promisify(fs.writeFile)
};

export function genTsTypes(): string {
  let types = '';
  mappedTypes.forEach((type, name) => {
    types += `export type ${name} = ${type};\n`
  });
  return types;
}

export function genTsTable(table: Table): string {
  let s = '';

  /* enum */
  if (tableEnums.has(table.name)) {
    let enums = tableEnums.get(table.name);
    enums.forEach(e => {
      s += `export enum ${e.name} {\n`;
      e.values.forEach(value => {
        s += `  ${value} = ${value},\n`;
      });
      s += '}\n\n'
    })
  }

  /* interface */
  s += 'export interface ' + table.name + ' {\n';
  let imports = new Set<string>();
  table.fields.forEach(field => {
    if (mappedTypes.has(field.type)) {
      imports.add(field.type);
    }
    s += `  ${field.name}: ${field.type}\n`
  });
  s += '}\n';

  /* import */
  if (imports.size > 0) {
    let t = 'import { ';
    t += Array.from(imports).sort().map(type => type).join(', ');
    t += ' ';
    t += "} from '../sql.types';\n\n";
    s = t + s;
  }

  return s;
}

export async function writeTsFiles(dirname: string) {
  await async.mkdirp(dirname);
  await async.mkdirp(path.join(dirname, 'tables'));
  let ps = [];
  tables.forEach(table => {
    let filename = path.join(dirname, 'tables', table.name + '.ts');
    let content = genTsTable(table);
    ps.push(async.writeFile(filename, content))
  });
  ps.push((async () => {
    let filename = path.join(dirname, 'sql.types.ts');
    let content = genTsTypes();
    if (content.trim().length === 0) {
      return
    }
    return async.writeFile(filename, content)
  })());
  await Promise.all(ps);
}
