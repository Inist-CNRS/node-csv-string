const { createReadStream } = require('fs');

const nodecsv = require('csv');

const CSV = require('..');

const FILE = `${__dirname}/twitter.csv`;

const parser = nodecsv.parse();
parser.on('readable', function () {
  let record;
  while ((record = parser.read())) {
    process.stdout.write(CSV.stringify(record));
  }
});

createReadStream(FILE).pipe(parser);
