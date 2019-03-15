import {hasEnum, mappedTypes, registerEnum, Table, tables} from "./state";

function fixLineFeed(s: string) {
  return s.replace(/\r\n/g, '\n')
}

function skipSpaces(s: string) {
  return s.split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .join('\n')
}

function skipSingleLineComments(s: string) {
  return s.split('\n')
    .filter(s => !s.startsWith('--'))
    .join('\n')
}

function skipMultipleLineComments(s: string) {
  let acc = '';
  let i = 0;
  const n = s.length;
  let isInComment = false;
  for (; i < n;) {
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
  return s.split(';')
    .filter(s => s.trim().length > 0)
    .join(';')
}

function skipNonCreateTable(s: string) {
  return s.split(';')
    .filter(s => s.trim().toLowerCase().startsWith('create table'))
    .join(';')
}

function mapFieldName(s: string): string {
  return s.replace(/`/g, '');
}

function mapFieldType(s: string): string {
  if (s.startsWith('varchar')
    || s.startsWith('bigint')
    || s.startsWith('smallint')
    || s.startsWith('tinyint')
    || s.startsWith('int')
  ) {
    s = s
      .replace('(', '_')
      .replace(')', '');
    mappedTypes.set(s, 'string')
  }
  if (s.startsWith('datetime')) {
    s = s
      .replace('(', '_')
      .replace(')', '');
    if (s !== 'datetime') {
      mappedTypes.set(s, 'datetime');
    }
  }
  if (!mappedTypes.has(s) && !hasEnum(s)) {
    console.error('Error: unsupported sql type:', s);
    process.exit(1);
  }
  return s;
}

function mapDecimal(s: string): string {
  for (; ;) {
    let start = s.indexOf('decimal(');
    if (start === -1) {
      return s;
    }
    let end = s.indexOf(')', start) + 1;
    let t = s.substring(start, end);
    t = t
      .replace('(', '_')
      .replace(',', '_')
      .replace(')', '');
    mappedTypes.set(t, 'number');
    s = s.substring(0, start)
      + t
      + s.substring(end);
  }
}

function last<A>(xs: A[]): A {
  return xs[xs.length - 1]
}

// TODO
function mapEnum(s: string, context: { tableName: string }): string {
  for (; ;) {
    let start = s.indexOf('enum(');
    if (start === -1) {
      return s
    }
    let end = s.indexOf(')', start) + 1;
    let t = s.substring(start, end);
    let fieldName = last(s.substring(0, start)
      .split(' ')
      .map(s => s.trim())
      .filter(s => s.length > 0));
    fieldName = last(fieldName.split(','));
    fieldName = mapFieldName(fieldName);
    let tableName = context.tableName;
    let values = t
      .split('(')[1]
      .split(')')[0]
      .split(',')
    ;
    let e = registerEnum(tableName, fieldName, values);
    t = e.name;
    s = s.substring(0, start)
      + t
      + s.substring(end);
  }
}


function mapCreateTable(s: string): Table {
  s = s.replace(/.*\)(.*);/, '');
  let ss = s.split('(');
  let tableName = mapFieldName(ss.shift().split(' ')[2]);
  s = ss.join('(');
  s = s.split(');')[0];
  s = s.split('\n').join('');
  s = mapDecimal(s);
  s = mapEnum(s, {tableName});
  let fields = s.split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !s.startsWith(')'))
    .map(s => {
      let ss = s.split(' ');
      let name = mapFieldName(ss[0]);
      let type = mapFieldType(ss[1]);
      return {name, type}
    });
  let table: Table = {
    name: tableName,
    fields: fields
  };
  tables.set(table.name, table);
  return table;
}

function mapCreateTables(s: string) {
  return s.split(';').map(s => mapCreateTable(s + ';'));
}

function toString(xs: any[] | string): string {
  if (typeof xs === 'string') {
    return xs
  }
  return xs.map(x => toString(x)).join('')
}

export function parseSQLString(text: string) {
  let s = fixLineFeed(text);
  s = skipSpaces(s);
  s = skipComments(s);
  s = skipEmptyStatement(s);
  s = skipNonCreateTable(s);
  let tables = mapCreateTables(s);
}
