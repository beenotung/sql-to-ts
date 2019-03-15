import * as fs from 'fs';

let filename = 'res/information_schema.sql';
let s = fs.readFileSync(filename).toString();

class Counter {
  varchar = 0;
  bigint = 0;
  'int(' = 0;
  longtext = 0;
  datetime = 0;
}

let counter = new Counter();

function filter(type: keyof Counter) {
  let out = [];
  s.split('\n')
    .forEach(s => {
      if (s.indexOf(type) === -1) {
        return out.push(s);
      }
      if (counter[type] < 1) {
        counter[type]++;
        return out.push(s);
      }
      if (s.startsWith(',') || s.endsWith(',')) {
        return
      }
      return out.push(s);
    });
  s = out.join('\n')
}

Object.keys(counter).forEach(x => filter(x as any));

fs.writeFileSync(filename, s);
