import { mappedTypes, mapType, registerEnum, Table, tables } from './state';

function fixLineFeed(s: string) {
  return s.replace(/\r\n/g, '\n');
}

function skipSpaces(s: string) {
  return s
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .join('\n');
}

function skipSingleLineComments(s: string) {
  return s
    .split('\n')
    .filter(s => !s.startsWith('--'))
    .join('\n');
}

function skipMultipleLineComments(s: string) {
  let acc = '';
  let i = 0;
  const n = s.length;
  let isInComment = false;
  for (; i < n; ) {
    if (isInComment) {
      /* is in comment mode */
      if (s.startsWith('*/', i)) {
        /* is ending comment */
        i += 2;
        isInComment = false;
      } else {
        /* is not ending comment */
        i++;
      }
    } else {
      /* is in code mode */
      if (s.startsWith('/*', i)) {
        /* is starting comment */
        isInComment = true;
        i += 2;
      } else {
        /* is not starting comment */
        acc += s[i];
        i++;
      }
    }
  }
  return acc;
}

function skipComments(s: string) {
  s = skipSingleLineComments(s);
  s = skipMultipleLineComments(s);
  return s;
}

function skipEmptyStatement(s: string) {
  return s
    .split(';')
    .filter(s => s.trim().length > 0)
    .join(';');
}

function skipNonCreateTable(s: string) {
  return s
    .split(';')
    .filter(s =>
      s
        .trim()
        .toLowerCase()
        .startsWith('create table'),
    )
    .join(';');
}

function mapFieldName(s: string): string {
  return s.replace(/`/g, '');
}

function mapFieldType(s: string): string {
  return mapType(s);
}

function mapDecimal(s: string): string {
  for (;;) {
    const start = s.indexOf('decimal(');
    if (start === -1) {
      return s;
    }
    const end = s.indexOf(')', start) + 1;
    let t = s.substring(start, end);
    t = t
      .replace('(', '_')
      .replace(',', '_')
      .replace(')', '');
    mappedTypes.set(t, 'number');
    s = s.substring(0, start) + t + s.substring(end);
  }
}

function last<A>(xs: A[]): A {
  return xs[xs.length - 1];
}

// TODO
function mapEnum(s: string, context: { tableName: string }): string {
  for (;;) {
    const start = s.indexOf('enum(');
    if (start === -1) {
      return s;
    }
    const end = s.indexOf(')', start) + 1;
    let t = s.substring(start, end);
    let fieldName = last(
      s
        .substring(0, start)
        .split(' ')
        .map(s => s.trim())
        .filter(s => s.length > 0),
    );
    fieldName = last(fieldName.split(','));
    fieldName = mapFieldName(fieldName);
    const tableName = context.tableName;
    const values = t
      .split('(')[1]
      .split(')')[0]
      .split(',');
    const e = registerEnum(tableName, fieldName, values);
    t = e.name;
    s = s.substring(0, start) + t + s.substring(end);
  }
}

function mapCreateTable(s: string): Table {
  s = s.replace(/.*\)(.*);/, '');
  const ss = s.split('(');
  const tableName = mapFieldName(ss.shift().split(' ')[2]);
  s = ss.join('(');
  s = s.split(');')[0];
  s = s.split('\n').join('');
  s = mapDecimal(s);
  s = mapEnum(s, { tableName });
  const fields = s
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !s.startsWith(')'))
    .filter(s => !s.toLowerCase().startsWith('primary key'))
    .map(s => {
      const ss = s.split(' ');
      const name = mapFieldName(ss[0]);
      const type = mapFieldType(ss[1]);
      return { name, type };
    });
  const table: Table = {
    name: tableName,
    fields,
  };
  tables.set(table.name, table);
  return table;
}

function mapCreateTables(s: string) {
  return s.split(';').map(s => mapCreateTable(s + ';'));
}

// function toString(xs: any[] | string): string {
//   if (typeof xs === 'string') {
//     return xs;
//   }
//   return xs.map(x => toString(x)).join('');
// }

export function parseSQLString(text: string) {
  let s = fixLineFeed(text);
  s = skipSpaces(s);
  s = skipComments(s);
  s = skipEmptyStatement(s);
  s = skipNonCreateTable(s);
  // const tables =
  mapCreateTables(s);
}
