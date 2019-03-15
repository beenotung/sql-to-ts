import { main, Options } from './main';
import * as fs from 'fs';

let name = 'sql-to-ts';
let version = '1.0.0';

function help(): string {
  return `${name}, version ${version}
Usage:
  ${name} [Options] SQL-file ...

Options:
  -o, --tsDir [File]     output directory for Typescript Files (Default is out)
  -q, --quiet [Flag]     Quiet mode (Default is off)
  -c, --clean [Flag]     clean the output directory before witting (Default is off)
  -h, --help             Display help and usage details`;
}

let options: Options = {
  filenames: [],
  tsDir: 'out',
  clean: false,
  quiet: false,
};

for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i];
  switch (arg) {
    case '-h':
    case '--help':
      console.log(help());
      process.exit();
      break;
    case '-o':
    case '--tsDir':
      i++;
      options.tsDir = process.argv[i];
      break;
    case '-c':
    case '--clean':
      options.clean = true;
      break;
    case '-q':
    case '--quiet':
      options.quiet = true;
      break;
    default:
      try {
        let stat = fs.statSync(arg);
        if (!stat.isFile()) {
          console.error('Error:', arg, 'is not an file');
          process.exit(1);
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.error('Error: File', arg, 'does not exist');
          process.exit(1);
        } else {
          console.error('Error: failed to access file', arg, ':', err);
          process.exit(1);
        }
      }
      options.filenames.push(process.argv[i]);
  }
}

if (options.filenames.length < 1) {
  console.error('Error: missing arguments of sql filename.');
  console.error(`run \`${name} --help\` for help and usage details.`);
  help();
  process.exit(1);
}

main(options);


