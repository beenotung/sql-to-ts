export function compare(a: string | number, b: string | number): -1 | 0 | 1 {
  return a < b ? -1 : a > b ? 1 : 0;
}

export type compare_chunks = Array<string | number>;

// function isNum(s: string, i: number): boolean {
//   let code = s.charCodeAt(i);
//   return 48 <= code && code <= (48 + 10);
// }

function toNum(s: string, i: number): number | false {
  const code = s.charCodeAt(i);
  if (48 <= code && code <= 48 + 10) {
    return code - 48;
  } else {
    return false;
  }
}

function parseString(s: string, i: number, res: compare_chunks): void {
  let acc = '';
  for (; i < s.length; i++) {
    const num = toNum(s, i);
    if (num === false) {
      acc += s[i];
    } else {
      if (acc.length > 0) {
        res.push(acc);
      }
      parseNumber(s, i + 1, num, res);
      return;
    }
  }
  if (acc.length > 0) {
    res.push(acc);
  }
}

function parseNumber(
  s: string,
  i: number,
  acc: number,
  res: compare_chunks,
): void {
  for (; i < s.length; i++) {
    const num = toNum(s, i);
    if (num === false) {
      res.push(acc);
      parseString(s, i, res);
      return;
    }
    acc = acc * 10 + num;
  }
  res.push(acc);
}

export function split_string(s: string): compare_chunks {
  const acc: compare_chunks = [];
  parseString(s, 0, acc);
  return acc;
}

export function compare_string(a: string, b: string): -1 | 0 | 1 {
  const as = split_string(a);
  const bs = split_string(b);
  const n = Math.min(as.length, bs.length);
  for (let i = 0; i < n; i++) {
    const res = compare(as[i], bs[i]);
    if (res !== 0) {
      return res;
    }
  }
  return compare(as.length, bs.length);
}
