#!/bin/bash
set -e
set -o pipefail
rm -rf node_modules
npm i --prod
hash ts-node 2>/dev/null || npm i -g ts-node typescript
ts-node test/sql-test.ts
