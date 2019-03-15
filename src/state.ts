export let mappedTypes = new Map<string, string>();
mappedTypes.set('longtext', 'string');
mappedTypes.set('text', 'string');
mappedTypes.set('double', 'number');
mappedTypes.set('datetime', 'string');
mappedTypes.set('blob', 'Blob | Buffer | string');
mappedTypes.set('longblob', 'Blob | Buffer | string');

export interface Field {
  name: string
  type: string
}

export interface Table {
  name: string
  fields: Field[]
}

export let tables = new Map<string, Table>();

export interface Enum {
  table: string
  field: string
  name: string
  values: string[]
}

/**
 * Table -> Name -> Enum
 * */
export let tableEnums = new Map<string, Map<string, Enum>>();

export function enumName(table: string, field: string) {
  return `${table}_${field}_enum`;
}

function mapGetOrSetDefault<K, V>(map: Map<K, V>, key: K, f: () => V): V {
  if (map.has(key)) {
    return map.get(key)
  }
  let value = f();
  map.set(key, value);
  return value
}

export function registerEnum(table: string, field: string, values: string[]) {
  let e: Enum = {
    table,
    field,
    name: enumName(table, field),
    values
  };
  mapGetOrSetDefault(tableEnums, e.table, () => new Map())
    .set(e.name, e);
  return e;
}

export function hasEnum(name: string) {
  let found = false;
  tableEnums.forEach(enums => found = found || enums.has(name));
  return found
}
