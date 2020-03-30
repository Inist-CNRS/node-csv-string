const { createReadStream } = require('fs');

const fastcsv = require('fast-csv');

const CSV = require('..');

const FILE = `${__dirname}/twitter.csv`;

createReadStream(FILE)
  .pipe(fastcsv.parse({ headers: true }))
  .on('data', (data) => {
    process.stdout.write(CSV.stringify(data));
  });
