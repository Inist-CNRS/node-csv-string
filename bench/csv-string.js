const { createReadStream } = require('fs');

const CSV = require('..');

const FILE = `${__dirname}/twitter.csv`;
const stream = CSV.createStream();
stream.on('data', (row) => {
  process.stdout.write(CSV.stringify(row));
});

createReadStream(FILE).pipe(stream);
