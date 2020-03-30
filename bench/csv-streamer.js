const { createReadStream } = require('fs');

const CSVStream = require('csv-streamer').Reader;

const CSV = require('..');

const FILE = `${__dirname}/twitter.csv`;
const csv = new CSVStream({ headers: true });

csv.on('data', (line) => {
  process.stdout.write(CSV.stringify(line));
});
createReadStream(FILE).pipe(csv);
