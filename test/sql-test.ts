import { main } from '../src/main';

main({
  filenames: ['res/information_schema.sql', 'res/extra.sql'],
  tsDir: 'res/ts',
  clean: true,
});
