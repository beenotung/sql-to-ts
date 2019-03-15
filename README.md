# sql-to-ts

Generate Typescript from SQL

[![npm Package Version](https://img.shields.io/npm/v/sql-to-ts.svg?maxAge=2592000)](https://www.npmjs.com/package/sql-to-ts)

## Installation
```bash
npm i -g sql-to-ts
```

## Usage Example:
```bash
sql-to-ts -o res/ts ./res/information_schema.sql ./res/extra.sql
```

### Usage
```text
> sql-to-ts --help
sql-to-ts, version 1.0.3
Usage:
  sql-to-ts [Options] SQL-file ...

Options:
  -o, --tsDir [File]     output directory for Typescript Files (Default is out)
  -q, --quiet [Flag]     Quiet mode (Default is off)
  -c, --clean [Flag]     clean the output directory before witting (Default is off)
  -h, --help             Display help and usage details
```

Input: SQL Create Table scripts generated by phpmyadmin

Output:
- Typescript Interface for each Table
- Typescript Type Alias for SQL Types
- Typescript Enum for SQL Enum
