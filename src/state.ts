export let mappedTypes = new Map<string, string>();

mappedTypes.set('longtext', 'string');
mappedTypes.set('text', 'string');

mappedTypes.set('int', 'number | string');
mappedTypes.set('float', 'number | string');
mappedTypes.set('double', 'number | string');
mappedTypes.set('bigint', 'number | string');

mappedTypes.set('datetime', 'string');
mappedTypes.set('date', 'string');

mappedTypes.set('blob', 'Blob | Buffer | string');
mappedTypes.set('longblob', 'Blob | Buffer | string');

export function hasType(name: string) {
  return mappedTypes.has(name) || mappedTypes.has(name.toLowerCase());
}

export interface Field {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  fields: Field[];
}

export let tables = new Map<string, Table>();

export interface Enum {
  table: string;
  field: string;
  name: string;
  values: string[];
}

/**
 * Table -> Name -> Enum
 * */
export let tableEnums = new Map<string, Map<string, Enum>>();

export function enumName(table: string, field: string) {
  return `${table}_${field}_enum`;
}

export function registerEnum(table: string, field: string, values: string[]) {
  const e: Enum = {
    table,
    field,
    name: enumName(table, field),
    values,
  };
  if (!tableEnums.has(e.table)) {
    tableEnums.set(e.table, new Map());
  }
  tableEnums.get(e.table).set(e.name, e);
  return e;
}

export function hasEnum(name: string) {
  let found = false;
  tableEnums.forEach(enums => (found = found || enums.has(name)));
  return found;
}
