import { compare_string, split_string } from '../src/utils/compare';

let values = ['varchar_10', 'varchar_20', 'varchar_16', 'varchar_64'];

values.forEach(s => console.log(s, ':', split_string(s)));

console.log('sorted:', values.sort((a, b) => compare_string(a, b)));
