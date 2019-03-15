import { mappedTypes, Table, tableEnums, tables } from './state';
import * as mkdirp from 'mkdirp';
import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { compare_string } from './utils/compare';

let async = {
  mkdirp: util.promisify(mkdirp),
  writeFile: util.promisify(fs.writeFile),
};

export function genTsTypes(): string {
  // let types = '';
  let type_codes: Array<[string, string]> = [];
  mappedTypes.forEach((type, name) => {
    // types += `export type ${name} = ${type};\n`;
    let code = `export type ${name} = ${type};\n`;
    type_codes.push([type, code]);
  });
  type_codes.sort((a, b) => {
    let res = compare_string(a[0], b[0]);
    if (res === 0) {
      return compare_string(a[1], b[1]);
    }
    return res;
  });
  return type_codes.map(x => x[1]).join('');
  // return types;
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
      s += '}\n\n';
    });
  }

  /* interface */
  s += 'export interface ' + table.name + ' {\n';
  let imports = new Set<string>();
  table.fields.forEach(field => {
    if (mappedTypes.has(field.type)) {
      imports.add(field.type);
    }
    s += `  ${field.name}: ${field.type}\n`;
  });
  s += '}\n';

  /* import */
  if (imports.size > 0) {
    let t = 'import { ';
    t += Array.from(imports).sort().map(type => type).join(', ');
    t += ' ';
    t += '} from \'../sql.types\';\n\n';
    s = t + s;
  }

  return s;
}

export async function writeTsFiles(options: { tsDir: string, quiet?: boolean }) {
  let { tsDir, quiet } = options;
  await async.mkdirp(tsDir);
  await async.mkdirp(path.join(tsDir, 'tables'));
  let ps = [];
  tables.forEach(table => {
    let filename = path.join(tsDir, 'tables', table.name + '.ts');
    let content = genTsTable(table);
    if (!quiet) {
      console.log('saving to', filename);
    }
    ps.push(async.writeFile(filename, content));
  });
  ps.push((async () => {
    let filename = path.join(tsDir, 'sql.types.ts');
    let content = genTsTypes();
    if (content.trim().length === 0) {
      return;
    }
    if (!quiet) {
      console.log('saving to', filename);
    }
    return async.writeFile(filename, content);
  })());
  await Promise.all(ps);
}
