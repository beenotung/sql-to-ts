if (process.argv.length <= 2) {
  console.error('Error: missing arguments of sql filename.');
  process.exit(1);
}
let filenames = process.argv.slice(2);
console.log(filenames)
